<template>
  <b-alert class="mt-2" variant="danger" :show="hasError">Error: {{ error}}</b-alert>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'error',
  computed: {
    ...mapGetters(['error', 'hasError'])
  }
}
</script>
