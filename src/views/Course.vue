<template>
  <div>
    <b-container>
      <h4 class="display-4">
        {{ title }}
        <span class="float-right"><small><b-badge pill>{{ questionCount }}</b-badge></small></span>
      </h4>
    </b-container>
    <router-view />
   </div>
</template>

<script>
import bBadge from 'bootstrap-vue/es/components/badge/badge'
import bContainer from 'bootstrap-vue/es/components/layout/container'
import { mapGetters } from 'vuex'

export default {
  name: 'course',
  components: {
    bBadge,
    bContainer
  },
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
