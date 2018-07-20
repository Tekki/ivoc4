import Vue from 'vue'
import Vuex from 'vuex'

import course from './modules/course'
import filelist from './modules/filelist'
import graph from '../api/graph'

Vue.use(Vuex)

const modules = {
  course,
  filelist
}
const userAgent = graph.createUserAgent()

// actions

const actions = {
  login (context) {
    graph.login(context.state.userAgent).then(
      userName => context.dispatch('setUserName', userName),
      error => context.commit('error', error)
    )
  },
  logout (context) {
    graph.logout(context.state.userAgent)
  },
  setUserName (context, userName) {
    if (userName) {
      context.commit('userName', userName)
      context.commit('error', null)
    }
  }
}

// getters

const getters = {
  appId: state => {
    return state.userAgent.clientId
  },
  error: state => {
    return state.error
  },
  fileList: state => {
    return state.fileList
  },
  hasError: state => {
    return state.error != null
  },
  loggedIn: state => {
    return state.userName != null
  },
  userName: state => {
    return state.userName
  }
}

// mutations

const mutations = {
  error (state, payload) {
    state.error = payload ? payload.replace(/.*\|/, '') : null
  },
  userName (state, payload) {
    state.userName = payload
  }
}

// state

const state = {
  error: null,
  fileList: null,
  userName: null,
  userAgent
}

export default new Vuex.Store({
  actions,
  getters,
  modules,
  mutations,
  state
})
