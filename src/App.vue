<template>
  <b-container>
    <Navbar />
    <router-view />
    <Error />
  </b-container>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import Error from '@/components/Error.vue'
import Navbar from '@/components/Navbar.vue'

export default {
  name: 'app',
  components: {
    Error,
    Navbar
  }
}
</script>
