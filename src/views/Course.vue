<template>
  <div>
    <h4 class="display-4">
      {{ title }}
      <span class="float-right"><small><b-badge pill>{{ questionCount }}</b-badge></small></span>
    </h4>
    <router-view />
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'course',
  computed: {
    ...mapGetters(
      'course',
      ['minDay', 'questionCount', 'testCount', 'title', 'trainingCount']
    )
  },
  created () {
    this.$store.dispatch('course/loadCourse', this.$route.params.id)
  }
}
</script>
