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
import bButton from 'bootstrap-vue/es/components/button/button'
import bCard from 'bootstrap-vue/es/components/card/card'
import bCol from 'bootstrap-vue/es/components/layout/col'
import bListGroup from 'bootstrap-vue/es/components/list-group/list-group'
import bListGroupItem from 'bootstrap-vue/es/components/list-group/list-group-item'
import bRow from 'bootstrap-vue/es/components/layout/row'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'FileList',
  components: {
    bButton,
    bCard,
    bCol,
    bListGroup,
    bListGroupItem,
    bRow
  },
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
