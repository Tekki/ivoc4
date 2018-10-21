<template>
  <b-card class="login">
    <h1 class="display-1">iVoc4</h1>
    <h3>Learning System</h3>
    <div slot="footer">
      <b-button class="mr-2" size="lg" variant="success" @click="login">Login</b-button>
      or go to the <router-link to="/course/sample1">sample course</router-link>.
    </div>
  </b-card>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Login',
  methods: {
    ...mapActions(['login'])
  }
}
</script>
