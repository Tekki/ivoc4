import Vue from 'vue'
import Router from 'vue-router'
import About from './views/About.vue'
import Home from './views/Home.vue'
import Course from './views/Course.vue'
import CourseAnswer from './views/CourseAnswer.vue'
import CourseOverview from './views/CourseOverview.vue'
import CourseQuestion from './views/CourseQuestion.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: '/course/:id',
      component: Course,
      children: [
        {
          path: '',
          name: 'course',
          component: CourseOverview
        },
        {
          path: 'question',
          name: 'question',
          component: CourseQuestion
        },
        {
          path: 'answer',
          name: 'answer',
          component: CourseAnswer
        }
      ]
    }
  ]
})
