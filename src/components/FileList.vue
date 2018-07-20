<template>
  <b-card class="filelist">
    <h4 slot="header">Courses on OneDrive</h4>
    <b-row class="justify-content-md-center">
      <b-list-group>
        <b-list-group-item
            v-for="file in files"
            :key="file.id"
            :disabled="noIvocFile(file)"
            :to="`/course/${file.id}`">
          {{ file.name }}
        </b-list-group-item>
      </b-list-group>
    </b-row>
    <b-button slot="footer" variant="success" @click="listFiles">Refresh</b-button>
  </b-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'FileList',
  computed: {
    ...mapGetters(['userName']),
    ...mapGetters('filelist', ['files'])
  },
  created () {
    this.$store.dispatch('filelist/listFiles')
  },
  methods: {
    ...mapActions(['logout']),
    ...mapActions('filelist', ['listFiles']),
    noIvocFile: file => !file.name.match(/^iVoc-.+xlsx$/)
  }
}
</script>
