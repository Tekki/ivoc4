<template>
  <div class="about">
    <h1 class="display-1">iVoc4</h1>
    <h3>Learning System</h3>
    <p class="lead">Form and Vocabulary Trainer</p>
    <p>
      iVoc is a vocabulary and form trainer that stores its data in spreadsheets on
      <b-link href="https://onedrive.live.com/about/de-de/" target="_blank">OneDrive Personal</b-link> or
      <b-link href="https://onedrive.live.com/about/de-de/business/" target="_blank">OneDrive for Business</b-link>.
      It works according to the learning method described by
      <b-link href="https://en.wikipedia.org/wiki/Leitner_system" target="_blank">Sebastian Leitner</b-link>.
      In short, this means that the program knows when and how often it has to ask which question.
    </p>
    <h4>Sample courses</h4>
    <p>
      Take a look at one of our sample courses to see how the program works:
    </p>
    <b-row class="justify-content-md-center mb-3">
      <b-list-group>
        <b-list-group-item
            v-for="(sample, index) in sampleCourses"
            :key="index"
            :to="sample.link"
            >
          <strong>{{ sample.title }}</strong> {{ sample.description}}
        </b-list-group-item>
      </b-list-group>
    </b-row>
    <p>Please notice that sample courses don't save your progress.</p>
    <h4>Application Folder</h4>
    <p>
      After the first login, the program will create an application folder called
      <strong>iVoc4</strong> on your OneDrive. This is the place where you have
      save your learning tables.
    </p>
    <h4>Prepared learning tables</h4>
    <p>You can download the following tables and copy them into your iVoc4 application folder:</p>
    <b-row class="justify-content-md-center mb-3">
      <b-list-group>
        <b-list-group-item
            v-for="(table, index) in learningTables"
            :key="index"
            :href="table.url"
            target="_blank">
          <strong>{{ table.title }}</strong> {{ table.description }}
        </b-list-group-item>
      </b-list-group>
    </b-row>
    <h4>Source Code</h4>
    <p>
      You find the source code of this program, together with much more information,
      on <b-link href="https://github.com/Tekki/ivoc4" target="_blank">GitHub</b-link>.
    </p>
  </div>
</template>

<script>
import bLink from 'bootstrap-vue/es/components/link/link'
import bListGroup from 'bootstrap-vue/es/components/list-group/list-group'
import bListGroupItem from 'bootstrap-vue/es/components/list-group/list-group-item'
import bRow from 'bootstrap-vue/es/components/layout/row'

export default {
  name: 'about',
  components: {
    bLink,
    bListGroup,
    bListGroupItem,
    bRow
  },
  data () {
    return {
      learningTables: [
        {
          title: 'Template',
          description: 'that shows how to build new tables',
          url: 'https://1drv.ms/x/s!ApzJglF9t0d6irsJKA7lv752kwQ0mQ'
        },
        {
          title: 'Lateinische Formen',
          description: 'Latin forms',
          url: 'https://1drv.ms/x/s!ApzJglF9t0d6irsKJ9dsvV32hmrmwg'
        },
        {
          title: 'Altgriechisch-Deutsch',
          description: 'Ancient Greek-German',
          url: 'https://1drv.ms/x/s!ApzJglF9t0d6irsHaY5B6G7jvg4WGQ'
        },
        {
          title: 'Angol-Magyar Alapszókincs',
          description: 'English-Hungarian Basic Vocabulary',
          url: 'https://1drv.ms/x/s!ApzJglF9t0d6irsIITsAM7S3Vy2QgQ'
        },
        {
          title: 'Ungarisch-Deutsch',
          description: 'Magyar-Német Szókincs, Hungarian-German Vocabulary',
          url: 'https://1drv.ms/x/s!ApzJglF9t0d6irsGPOlrYBNYmW1cwQ'
        }
      ],
      sampleCourses: [
        { title: 'Language Course', description: 'Translations between English, German and French', link: '/course/sample1' },
        { title: 'Vimtutor', description: 'Most of the commands from Vim Tutor', link: '/course/sample2' }
      ]
    }
  }
}
</script>
