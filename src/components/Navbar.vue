<template>
  <b-navbar toggleable="md" type="dark" variant="primary" class="mb-2">

    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

    <b-navbar-brand to="/">
      <img src="images/ivoc-logo-opak-50x36.png" alt="iVoc4">
    </b-navbar-brand>

    <b-collapse is-nav id="nav_collapse">

      <b-navbar-nav>
        <b-nav-item to="/">Home</b-nav-item>
        <b-nav-item to="/about">About</b-nav-item>
      </b-navbar-nav>

      <b-navbar-nav class="ml-auto">
        <b-nav-text v-if="loggedIn" right>{{ userName }}</b-nav-text>
      </b-navbar-nav>

    </b-collapse>
  </b-navbar>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Navbar',
  computed: {
    ...mapActions(['logout']),
    ...mapGetters(['loggedIn', 'userName'])
  }
}
</script>
