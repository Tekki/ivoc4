<template>
  <b-card class="course-overview" @keydown.enter="$router.push({name: 'answer'})">
    <h4 slot="header">
      Day {{ minDay }}
    </h4>
    <b-row class="justify-content-md-center">
      <b-col md="auto">
        <table class="table">
          <tbody>
            <tr>
              <th>Questions</th>
              <td align="right">{{ todayQuestions }}</td>
              <td></td>
            </tr>
            <tr>
              <th>Correct</th>
              <td align="right">{{ todayCorrect }}</td>
              <td align="right">{{ todayCorrectPercent }} %</td>
            </tr>
            <tr>
              <th>Wrong</th>
              <td align="right">{{ todayWrong }}</td>
              <td align="right">{{ todayWrongPercent }} %</td>
            </tr>
            <tr v-if="todayQuestions > 0">
              <td colspan="3">
                <b-progress class="mt-1" :max="todayQuestions">
                  <b-progress-bar :value="todayCorrect" variant="success"></b-progress-bar>
                  <b-progress-bar :value="todayWrong" variant="danger"></b-progress-bar>
                </b-progress>
              </td>
            </tr>
          </tbody>
        </table>
      </b-col>
    </b-row>
    <b-form-group horizontal breakpoint="lg">
    </b-form-group>
    <div slot="footer">
      <b-button
          class="mr-2"
          :disabled="noTestQuestions"
          size="lg"
          :to="{name: 'question', params: {type: 'test'}}"
          variant="warning">
        Test <b-badge pill variant="light">{{ testCount }}</b-badge>
      </b-button>
      <b-button
          :disabled="noTrainingQuestions"
          size="lg"
          :to="{name: 'question', params: {type: 'training'}}"
          variant="success">
        Training <b-badge pill variant="light">{{ trainingCount }}</b-badge>
      </b-button>
    </div>
  </b-card>
</template>

<script>
import bBadge from 'bootstrap-vue/es/components/badge/badge'
import bButton from 'bootstrap-vue/es/components/button/button'
import bCard from 'bootstrap-vue/es/components/card/card'
import bCol from 'bootstrap-vue/es/components/layout/col'
import bFormGroup from 'bootstrap-vue/es/components/form-group/form-group'
import bRow from 'bootstrap-vue/es/components/layout/row'
import bProgress from 'bootstrap-vue/es/components/progress/progress'
import bProgressBar from 'bootstrap-vue/es/components/progress/progress-bar'
import { mapGetters } from 'vuex'

export default {
  name: 'course-overview',
  components: {
    bBadge,
    bButton,
    bCard,
    bCol,
    bFormGroup,
    bRow,
    bProgress,
    bProgressBar
  },
  computed: {
    ...mapGetters(
      'course',
      ['minDay', 'noTestQuestions', 'noTrainingQuestions', 'testCount',
        'todayCorrect', 'todayCorrectPercent', 'todayQuestions',
        'todayWrong', 'todayWrongPercent', 'trainingCount']
    )
  }
}
</script>
