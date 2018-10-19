import graph from '../../api/graph'

// actions

const sampleId = 'sample'
const фн = {
  defaultState (state) {
    state.actualQuestion = {}
    state.actualTest = {
      allCorrect: null,
      answers: [],
      correct: []
    }
    state.actualType = null
    state.boxes = 0
    state.id = null
    state.minDay = Number.POSITIVE_INFINITY
    state.questions = []
    state.test = []
    state.title = ''
    state.today = {
      correct: 0,
      questions: 0,
      wrong: 0
    }
    state.training = []
    state.worksheets = []
  },
  form: {
    correct (expected, actualAnswers, i) {
      const answer = actualAnswers[i]
      return expected[i].hasOwnProperty(answer)
    },
    splitAnswers (correctAnswers) {
      const expected = []
      for (let i = 0, len = correctAnswers.length; i < len; i++) {
        expected[i] = {}
        correctAnswers[i].split(/,[ ]?/).forEach(answer => {
          expected[i][answer] = true
        })
      }
      return expected
    }
  },
  answer: {
    correct (expected, actualAnswers, i) {
      const answer = actualAnswers[i]
      const correct = expected.hasOwnProperty(answer)

      // remove with siblings from expected answers
      if (correct) {
        const j = expected[answer]
        Object.keys(expected).forEach(key => {
          if (expected[key] === j) {
            delete expected[key]
          }
        })
      }

      return correct
    },
    splitAnswers (correctAnswers) {
      const expected = {}
      for (let i = 0, len = correctAnswers.length; i < len; i++) {
        correctAnswers[i].split(/,[ ]?/).forEach(answer => {
          expected[answer] = i
        })
      }
      return expected
    }
  }
}

const actions = {
  askQuestion (context, type) {
    if (type) {
      context.commit('actualType', type)
      context.dispatch('shuffle')
      context.dispatch('nextQuestion')
    } else {
      context.dispatch('nextQuestion')
    }
  },
  analyzeTopic (context, payload) {
    let topic = payload.topic
    let values = payload.values

    // analyze header
    let columns = {}
    let header = values[0]
    for (let i = 0, len = header.length; i < len; i++) {
      if (header[i]) {
        columns[header[i].toLowerCase()] = i
      }
    }
    topic.columns = columns

    // collect questions
    for (let i = 1, len = values.length; i < len; i++) {
      let row = values[i]
      if (!row[columns.question]) { break }
      if (row[columns.day] && context.state.minDay > row[columns.day]) {
        context.commit('minDay', row[columns.day])
      }
      context.commit('addQuestion', {
        answers: row.slice(columns.answer).filter(answer => answer),
        day: row[columns.day],
        box: row[columns.box] || 1,
        training: row[columns.training],
        lesson: row[columns.lesson],
        question: row[columns.question],
        row: i + 1,
        topic,
        type: row[columns.type] || 'answer'
      })
    }
  },
  checkAnswers (context) {
    const actualQuestion = context.state.actualQuestion
    const correctAnswers = actualQuestion.answers
    context.commit('removeFirstQuestion')

    const actualAnswers = context.state.actualTest.answers
    const checkedAnswers = context.state.actualTest.correct

    const f = фн[actualQuestion.type]

    // split correct answers
    const expected = f.splitAnswers(correctAnswers)

    // check actual answers
    let allCorrect = true
    for (let i = 0, len = actualAnswers.length; i < len; i++) {
      if (f.correct(expected, actualAnswers, i)) {
        checkedAnswers[i] = true
      } else {
        checkedAnswers[i] = false
        allCorrect = false
      }
    }

    context.commit('allCorrect', allCorrect)
    if (allCorrect) {
      // move to next box and later day, remove from training
      if (actualQuestion.training) {
        actualQuestion.training = null
      } else {
        actualQuestion.day = context.state.minDay + 2 ** actualQuestion.box
        actualQuestion.box = Math.min(actualQuestion.box + 1, context.state.boxes)
      }
      context.commit('countCorrect')
    } else {
      // move to first box and next day, add to training
      actualQuestion.day = context.state.minDay + 1
      actualQuestion.box = 1
      actualQuestion.training = 1
      context.commit('addTraining', actualQuestion)
      context.commit('countWrong')
    }
    context.dispatch('updateWorksheet', actualQuestion)
  },
  filterQuestions (context) {
    if (context.state.minDay === Number.POSITIVE_INFINITY) {
      context.commit('minDay', 1)
    }

    // filter test and training
    context.state.questions.forEach(
      question => {
        if (question.training) {
          context.commit('addTraining', question)
        }
        if (!question.day || question.day === context.state.minDay) {
          context.commit('addTest', question)
        }
      }
    )
  },
  loadCourse (context, id) {
    context.commit('error', false, { root: true })
    context.commit('resetState')
    if (id === sampleId) {
      context.commit('sampleData')
      context.dispatch('filterQuestions')
    } else {
      graph.get(
        context.rootState.userAgent, `me/drive/items/${id}/workbook/worksheets`
      ).then(
        response => {
          context.commit('id', id)
          context.commit('worksheets', response.data.value)
          context.dispatch('loadMetadata')
          context.dispatch('loadTopics')
        },
        error => context.commit('error', error, { root: true })
      )
    }
  },
  loadMetadata (context) {
    let id = context.state.id
    let sheet = context.state.worksheets[0]
    graph.get(
      context.rootState.userAgent,
      `me/drive/items/${id}/workbook/worksheets/${sheet.id}/UsedRange`
    ).then(
      response => context.commit('metadata', response.data.values),
      error => context.commit('error', error, { root: true })
    )
  },
  loadTopics (context) {
    let id = context.state.id

    // load worksheets
    let topics = context.state.worksheets.slice(1).map(
      topic => {
        return graph.get(
          context.rootState.userAgent,
          `me/drive/items/${id}/workbook/worksheets/${topic.id}/UsedRange`
        ).then(
          response => context.dispatch('analyzeTopic', { topic, values: response.data.values }),
          error => context.commit('error', error, { root: true })
        )
      }
    )

    Promise.all(topics).then(
      () => context.dispatch('filterQuestions')
    )
  },
  nextQuestion (context) {
    const actualType = context.state.actualType
    const actualQuestion = context.state[actualType][0]
    context.commit('actualQuestion', actualQuestion)
    context.commit('clearAnswers')
  },
  shuffle (context) {
    for (let i = context.state[context.state.actualType].length - 1; i > 0; i--) {
      context.commit('swapQuestions', [i, Math.floor(Math.random() * (i + 1))])
    }
  },
  skipQuestion (context) {
    context.commit('moveQuestionToEnd')
    context.dispatch('nextQuestion')
  },
  updateWorksheet (context, question) {
    if (question.topic['@odata.id']) {
      const url = question.topic['@odata.id'].substring(1) +
        `/range(address='A${question.row}:C${question.row}')`
      const data = {
        values: [[ question.day, question.box, question.training || '' ]]
      }
      graph.patch(context.rootState.userAgent, url, data).then(
        response => context.commit('error', false, { root: true }),
        error => context.commit('error', error, { root: true })
      )
    }
  }
}

// getters

const getters = {
  actualAnswers: state => state.actualTest.answers,
  actualQuestionCount: state => state.actualType ? state[state.actualType].length : 0,
  actualTopic: state =>
    state.actualQuestion.topic ? state.actualQuestion.topic.name : '',
  actualType: state => state.actualType,
  allCorrect: state => state.actualTest.allCorrect,
  checkedAnswers: state => state.actualTest.correct,
  expectedAnswers: state => state.actualQuestion.answers,
  minDay: state => state.minDay,
  noMoreQuestions: state =>
    state[state.actualType] && state[state.actualType].length === 0,
  noTestQuestions: state => state.test.length === 0,
  noTrainingQuestions: state => state.training.length === 0,
  questionCount: state => state.questions.length,
  questionType: state => state.actualQuestion.type,
  testCount: state => state.test.length,
  theQuestion: state => state.actualQuestion.question,
  title: state => state.title,
  todayCorrect: state => state.today.correct,
  todayCorrectPercent: state =>
    Math.round(100 * state.today.correct / (state.today.questions || 1)),
  todayQuestions: state => state.today.questions,
  todayWrong: state => state.today.wrong,
  todayWrongPercent: state =>
    Math.round(100 * state.today.wrong / (state.today.questions || 1)),
  trainingCount: state => state.training.length
}

// mutations

const mutations = {
  actualQuestion (state, payload) {
    state.actualQuestion = payload
  },
  actualType (state, payload) {
    state.actualType = payload
  },
  addQuestion (state, payload) {
    state.questions.push(payload)
  },
  addTest (state, payload) {
    state.test.push(payload)
  },
  addTraining (state, payload) {
    state.training.push(payload)
  },
  allCorrect (state, payload) {
    state.actualTest.allCorrect = payload
  },
  clearAnswers (state) {
    state.actualTest.answers = Array(state.actualQuestion.answers.length).fill('')
    state.actualTest.correct = Array(state.actualQuestion.answers.length).fill(null)
  },
  countCorrect (state) {
    state.today.questions++
    state.today.correct++
  },
  countWrong (state) {
    state.today.questions++
    state.today.wrong++
  },
  id (state, payload) {
    state.id = payload
  },
  metadata (state, payload) {
    payload.slice(1).forEach(
      row => {
        state[row[0].toLowerCase()] = row[1]
      }
    )
  },
  moveQuestionToEnd (state) {
    state[state.actualType].push(state[state.actualType].shift())
  },
  minDay (state, payload) {
    state.minDay = payload
  },
  removeFirstQuestion (state) {
    state[state.actualType].shift()
  },
  resetState (state) {
    фн.defaultState(state)
  },
  sampleData (state) {
    фн.defaultState(state)
    let enDe = {
      name: 'English-German'
    }
    let numbers = {
      name: 'Numbers in German, English and French'
    }
    let french = {
      name: 'French conjugation'
    }
    state.boxes = 5
    state.id = sampleId
    state.minDay = 1
    state.questions = [
      {
        answers: ['ja'],
        box: 1,
        day: 1,
        question: 'yes',
        topic: enDe,
        type: 'answer',
        training: null
      },
      {
        answers: ['nein'],
        box: 1,
        day: 1,
        question: 'no',
        topic: enDe,
        type: 'answer',
        training: null
      },
      {
        answers: ['hallo'],
        box: 1,
        day: 1,
        question: 'hi',
        topic: enDe,
        type: 'answer',
        training: null
      },
      {
        answers: ['bitte'],
        box: 1,
        day: 1,
        question: 'please',
        topic: enDe,
        type: 'answer',
        training: null
      },
      {
        answers: ['danke'],
        box: 1,
        day: 1,
        question: 'thank you',
        topic: enDe,
        type: 'answer',
        training: null
      },
      {
        answers: ['bitte sehr'],
        box: 1,
        day: 1,
        question: 'you\'re welcome',
        topic: enDe,
        type: 'answer',
        training: null
      },
      {
        answers: ['Entschuldigung'],
        box: 1,
        day: 1,
        question: 'excuse me',
        topic: enDe,
        type: 'answer',
        training: null
      },
      {
        answers: ['auf Wiedersehen'],
        box: 1,
        day: 1,
        question: 'goodbye',
        topic: enDe,
        type: 'answer',
        training: null
      },
      {
        answers: ['eins', 'ein, eine'],
        box: 1,
        day: 1,
        question: 'one',
        topic: enDe,
        type: 'answer',
        training: null
      },
      {
        answers: ['zwei'],
        box: 1,
        day: 1,
        question: 'two',
        topic: enDe,
        type: 'answer',
        training: null
      },
      {
        answers: ['drei'],
        box: 1,
        day: 1,
        question: 'three',
        topic: enDe,
        type: 'answer',
        training: null
      },
      {
        answers: ['Hälfte', 'halb'],
        box: 1,
        day: 1,
        question: 'half',
        topic: enDe,
        type: 'answer',
        training: null
      },
      {
        answers: ['weniger'],
        box: 1,
        day: 1,
        question: 'less',
        topic: enDe,
        type: 'answer',
        training: null
      },
      {
        answers: ['mehr'],
        box: 1,
        day: 1,
        question: 'more',
        topic: enDe,
        type: 'answer',
        training: null
      },
      {
        answers: ['jetzt'],
        box: 1,
        day: 1,
        question: 'now',
        topic: enDe,
        type: 'answer',
        training: null
      },
      {
        answers: ['später'],
        box: 1,
        day: 1,
        question: 'later',
        topic: enDe,
        type: 'answer',
        training: null
      },
      {
        answers: ['vorher'],
        box: 1,
        day: 1,
        question: 'before',
        topic: enDe,
        type: 'answer',
        training: null
      },
      {
        answers: ['Morgen'],
        box: 1,
        day: 1,
        question: 'morning',
        topic: enDe,
        type: 'answer',
        training: null
      },
      {
        answers: ['Nachmittag'],
        box: 1,
        day: 1,
        question: 'afternoon',
        topic: enDe,
        type: 'answer',
        training: null
      },
      {
        answers: ['Abend'],
        box: 1,
        day: 1,
        question: 'evening',
        topic: enDe,
        type: 'answer',
        training: null
      },
      {
        answers: ['Nacht'],
        box: 1,
        day: 1,
        question: 'night',
        topic: enDe,
        type: 'answer',
        training: null
      },
      {
        answers: ['heute'],
        box: 1,
        day: 1,
        question: 'today',
        topic: enDe,
        type: 'answer',
        training: null
      },
      {
        answers: ['gestern'],
        box: 1,
        day: 1,
        question: 'yesterday',
        topic: enDe,
        type: 'answer',
        training: null
      },
      {
        answers: ['morgen'],
        box: 1,
        day: 1,
        question: 'tomorrow',
        topic: enDe,
        type: 'answer',
        training: null
      },
      {
        answers: ['diese Woche'],
        box: 1,
        day: 1,
        question: 'this week',
        topic: enDe,
        type: 'answer',
        training: null
      },
      {
        answers: ['letzte Woche'],
        box: 1,
        day: 1,
        question: 'last week',
        topic: enDe,
        type: 'answer',
        training: null
      },
      {
        answers: ['nächste Woche'],
        box: 1,
        day: 1,
        question: 'next week',
        topic: enDe,
        type: 'answer',
        training: null
      },
      {
        answers: ['Mittag'],
        box: 1,
        day: 1,
        question: 'noon',
        topic: enDe,
        type: 'answer',
        training: null
      },
      {
        answers: ['Mittag'],
        box: 1,
        day: 1,
        question: 'midday',
        topic: enDe,
        type: 'answer',
        training: null
      },
      {
        answers: ['Mitternacht'],
        box: 1,
        day: 1,
        question: 'midnight',
        topic: enDe,
        type: 'answer',
        training: null
      },
      {
        answers: ['schwarz'],
        box: 1,
        day: 1,
        question: 'black',
        topic: enDe,
        type: 'answer',
        training: null
      },
      {
        answers: ['weiss'],
        box: 1,
        day: 1,
        question: 'white',
        topic: enDe,
        type: 'answer',
        training: null
      },
      {
        answers: ['grau'],
        box: 1,
        day: 1,
        question: 'grey, gray',
        topic: enDe,
        type: 'answer',
        training: null
      },
      {
        answers: ['rot'],
        box: 1,
        day: 1,
        question: 'red',
        topic: enDe,
        type: 'answer',
        training: null
      },
      {
        answers: ['grün'],
        box: 1,
        day: 1,
        question: 'green',
        topic: enDe,
        type: 'answer',
        training: null
      },
      {
        answers: ['blau'],
        box: 1,
        day: 1,
        question: 'blue',
        topic: enDe,
        type: 'answer',
        training: null
      },
      {
        answers: ['gelb'],
        box: 1,
        day: 1,
        question: 'yellow',
        topic: enDe,
        type: 'answer',
        training: null
      },
      {
        answers: ['Bahnhof'],
        box: 1,
        day: 1,
        question: 'train station',
        topic: enDe,
        type: 'answer',
        training: null
      },
      {
        answers: ['Bushaltestelle'],
        box: 1,
        day: 1,
        question: 'bus station',
        topic: enDe,
        type: 'answer',
        training: null
      },
      {
        answers: ['Flughafen'],
        box: 1,
        day: 1,
        question: 'airport',
        topic: enDe,
        type: 'answer',
        training: null
      },
      {
        answers: ['eins', 'one', 'un'],
        box: 1,
        day: 1,
        question: '1',
        topic: numbers,
        type: 'form',
        training: null
      },
      {
        answers: ['zwei', 'two', 'deux'],
        box: 1,
        day: 1,
        question: '2',
        topic: numbers,
        type: 'form',
        training: null
      },
      {
        answers: ['drei', 'three', 'trois'],
        box: 1,
        day: 1,
        question: '3',
        topic: numbers,
        type: 'form',
        training: null
      },
      {
        answers: ['vier', 'four', 'quatre'],
        box: 1,
        day: 1,
        question: '4',
        topic: numbers,
        type: 'form',
        training: null
      },
      {
        answers: ['fünf', 'five', 'cinq'],
        box: 1,
        day: 1,
        question: '5',
        topic: numbers,
        type: 'form',
        training: null
      },
      {
        answers: ['sechs', 'six', 'six'],
        box: 1,
        day: 1,
        question: '6',
        topic: numbers,
        type: 'form',
        training: null
      },
      {
        answers: ['sieben', 'seven', 'sept'],
        box: 1,
        day: 1,
        question: '7',
        topic: numbers,
        type: 'form',
        training: null
      },
      {
        answers: ['acht', 'eight', 'huit'],
        box: 1,
        day: 1,
        question: '8',
        topic: numbers,
        type: 'form',
        training: null
      },
      {
        answers: ['neun', 'nine', 'neuf'],
        box: 1,
        day: 1,
        question: '9',
        topic: numbers,
        type: 'form',
        training: null
      },
      {
        answers: ['j\'aime', 'tu aimes', 'il aime, elle aime', 'nous aimons', 'vous aimez', 'ils aiment, elles aiment'],
        box: 1,
        day: 1,
        question: 'aimer',
        topic: french,
        type: 'form',
        training: null
      },
      {
        answers: ['je finis', 'tu finis', 'il finit, elle finit', 'nous finissons', 'vous finissez', 'ils finissent, elles finissent'],
        box: 1,
        day: 1,
        question: 'finir',
        topic: french,
        type: 'form',
        training: null
      },
      {
        answers: ['je sors', 'tu sors', 'il sort, elle sort', 'nous sortons', 'vous sortez', 'ils sortent, elles sortent'],
        box: 1,
        day: 1,
        question: 'sortir',
        topic: french,
        type: 'form',
        training: null
      },
      {
        answers: ['je vois', 'tu vois', 'il voit, elle voit', 'nous voyons', 'vous voyez', 'ils voient, elles voient'],
        box: 1,
        day: 1,
        question: 'voir',
        topic: french,
        type: 'form',
        training: null
      }
    ]
    state.title = 'Sample Course'
    state.worksheets = [ enDe, numbers, french ]
  },
  swapQuestions (state, payload) {
    const actualQuestions = state[state.actualType]
    const [i, j] = payload
    const tmp = actualQuestions[i]
    actualQuestions[i] = actualQuestions[j]
    actualQuestions[j] = tmp
  },
  worksheets (state, payload) {
    state.worksheets = payload
  }
}

// state

const state = {
  actualQuestion: {},
  actualTest: {},
  actualType: null,
  boxes: 0,
  id: null,
  minDay: Number.POSITIVE_INFINITY,
  questions: [],
  test: [],
  today: {
    correct: 0,
    questions: 0,
    wrong: 0
  },
  title: '',
  training: [],
  worksheets: []
}

export default {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
}
