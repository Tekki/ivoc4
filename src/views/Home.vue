<template>
  <div class="home">
    <FileList v-if="loggedIn" />
    <Login v-else />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import FileList from '@/components/FileList.vue'
import Login from '@/components/Login.vue'

export default {
  name: 'home',
  components: {
    FileList,
    Login
  },
  computed: {
    ...mapGetters(['appId', 'loggedIn'])
  }
}
</script>
