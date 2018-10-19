<template>
  <b-card class="course-answer">
    <h4 slot="header">
      {{ actualType }}
      <b-badge class="float-right" pill>{{ actualQuestionCount }}</b-badge>
    </h4>

    <p>{{ actualTopic }}</p>
    <b-row class="justify-content-md-center">
      <b-col md="auto">
        <h3>{{ theQuestion }}</h3>
        <h1 v-if="allCorrect"><b-badge variant="success">✓</b-badge></h1>
        <h1 v-else><b-badge variant="danger">✗</b-badge></h1>
      </b-col>
      <b-col md="4">
        <b-form-group
            v-for="(answer, index) in actualAnswers"
            :key="'a' + index">
          <b-form-input
              v-model="actualAnswers[index]"
              :state="checkedAnswers[index]"
              readonly>
          </b-form-input>
        </b-form-group>
      </b-col>
      <b-col md="4" v-if="!allCorrect">
        <b-form-group
            v-for="(answer, index) in expectedAnswers"
            :key="'b' + index">
          <b-form-input
              v-model="expectedAnswers[index]"
              plaintext>
          </b-form-input>
        </b-form-group>
      </b-col>
    </b-row>
    <div slot="footer">
      <b-button
          class="mr-2"
          :disabled="noMoreQuestions"
          ref="nextQuestion"
          size="lg"
          :to="{name: 'question'}"
          variant="success">
        Next
      </b-button>
      <b-button
          ref="finish"
          size="lg"
          :to="{name: 'course'}"
          variant="primary">
        Finish
      </b-button>
    </div>
  </b-card>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'course-answer',
  computed: {
    ...mapGetters(
      'course',
      ['actualAnswers', 'actualQuestionCount', 'actualTopic', 'actualType',
        'allCorrect', 'checkedAnswers', 'expectedAnswers', 'noMoreQuestions',
        'theQuestion']
    )
  },
  created () {
    this.$store.dispatch('course/checkAnswers')
  },
  mounted () {
    if (this.noMoreQuestions) {
      this.$refs.finish.$el.focus()
    } else {
      this.$refs.nextQuestion.$el.focus()
    }
  }
}
</script>
