<template>
  <b-card class="login">
    <h1 class="display-1">iVoc4</h1>
    <h3>Learning System</h3>
    <div slot="footer">
      <b-button class="mr-2" size="lg" variant="success" @click="login">Login</b-button>
      or go to one of the <router-link to="/about">sample courses</router-link>.
    </div>
  </b-card>
</template>

<script>
import bButton from 'bootstrap-vue/es/components/button/button'
import bCard from 'bootstrap-vue/es/components/card/card'
import { mapActions } from 'vuex'

export default {
  name: 'Login',
  components: {
    bButton,
    bCard
  },
  methods: {
    ...mapActions(['login'])
  }
}
</script>
