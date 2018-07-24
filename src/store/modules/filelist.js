import graph from '../../api/graph'

// actions

const actions = {
  listFiles (context) {
    context.commit('error', false, {root: true})
    graph.get(context.rootState.userAgent, 'me/drive/special/approot/children').then(
      response => context.commit('files', response.data.value),
      error => context.commit('error', error, {root: true})
    )
  }
}

// getters

const getters = {
  files: state => {
    return state.files
  }
}

// mutations

const mutations = {
  files (state, payload) {
    state.files = payload
  }
}

// state

const state = {
  files: null
}

export default {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
}
