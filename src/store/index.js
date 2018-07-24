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
      context.commit('error', false)
    }
  }
}

// getters

const getters = {
  appId: state => state.userAgent.clientId,
  error: state => state.error,
  fileList: state => state.fileList,
  hasError: state => state.error != null,
  loggedIn: state => state.userName != null,
  userName: state => state.userName
}

// mutations

const mutations = {
  error (state, payload) {
    if (!payload) {
      state.error = null
    } else if (payload.hasOwnProperty('message')) {
      state.error = payload.message
    } else {
      state.error = payload.replace(/.*\|/, '')
    }
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
