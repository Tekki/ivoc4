<template>
  <b-card class="course-question" @keydown.enter="$router.push({name: 'answer'})">
    <h4 slot="header">
      {{ actualType }}
      <b-badge class="float-right" pill>{{ actualQuestionCount }}</b-badge>
    </h4>

    <p>{{ actualTopic }}</p>
    <b-row class="justify-content-md-center">
      <b-col md="auto">
        <h3>{{ theQuestion }}</h3>
        <h1><b-badge variant="primary">?</b-badge></h1>
      </b-col>
      <b-col md="4">
        <b-form-group
            v-for="(answer, index) in actualAnswers"
            :key="index">
          <b-form-input
              v-model="actualAnswers[index]"
              :placeholder="placeholder(index)"
              :ref="'answer' + index">
          </b-form-input>
        </b-form-group>
      </b-col>
    </b-row>
    <div slot="footer">
      <b-button
          class="mr-2"
          size="lg"
          :to="{name: 'answer'}"
          variant="success">
        Check
      </b-button>
      <b-button
          class="mr-2"
          @click="skipQuestion"
          size="lg"
          variant="warning">
        Skip
      </b-button>
      <b-button
          size="lg"
          :to="{name: 'course'}"
          variant="primary">
        Finish
      </b-button>
    </div>
  </b-card>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'

export default {
  name: 'course-question',
  computed: {
    ...mapGetters(
      'course',
      [
        'actualAnswers', 'actualQuestionCount', 'actualTopic', 'actualType',
        'theQuestion', 'questionType'
      ]
    )
  },
  created () {
    this.$store.dispatch('course/askQuestion', this.$route.params.type)
  },
  methods: {
    ...mapActions('course', ['skipQuestion']),
    placeholder (index) {
      return this.questionType === 'form' ? (index + 1).toString() : '*'
    }
  },
  mounted () {
    this.$refs.answer0[0].$el.focus()
  }
}
</script>
