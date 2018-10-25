<template>
  <b-alert class="mt-2" variant="danger" :show="hasError">Error: {{ error}}</b-alert>
</template>

<script>
import bAlert from 'bootstrap-vue/es/components/alert/alert'
import { mapGetters } from 'vuex'

export default {
  name: 'error',
  components: {
    bAlert
  },
  computed: {
    ...mapGetters(['error', 'hasError'])
  }
}
</script>
