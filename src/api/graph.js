import axios from 'axios'
import * as Msal from 'msal'

const apiScopes = process.env.VUE_APP_SCOPES.split(' ')
const appId = process.env.VUE_APP_ID
const graphUrl = 'https://graph.microsoft.com/v1.0'
const redirectUri = window.location.origin // process.env.VUE_APP_REDIRECT_URI

const фн = {
  accessToken (userAgent) {
    return new Promise(
      (resolve, reject) => {
        userAgent.acquireTokenSilent(apiScopes).then(
          resolve,
          () => userAgent.acquireTokenPopup(apiScopes).then(resolve, reject)
        )
      }
    )
  }
}

export default {
  createUserAgent () {
    return new Msal.UserAgentApplication(
      appId, '',
      () => {}, { redirectUri }
    )
  },
  get (userAgent, endpoint, accessToken) {
    return new Promise(
      (resolve, reject) => {
        // фн.accessToken(userAgent).then(
        //   accessToken => {
        let config = {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
        let url = `${graphUrl}/${endpoint}`
        axios.get(url, config).then(resolve, reject)
        //   },
        //   reject
        // )
      }
    )
  },
  login (userAgent) {
    return new Promise(
      (resolve, reject) => (
        userAgent.loginPopup(apiScopes).then(
          idToken => {
            let userName = decodeURIComponent(escape(userAgent.getUser().name))
            фн.accessToken(userAgent).then(
              accessToken => resolve({userName, accessToken}),
              reject
            )
          },
          reject
        )
      )
    )
  },
  logout (userAgent) {
    // userAgent.logout()
  },
  patch (userAgent, endpoint, data) {
    return new Promise(
      (resolve, reject) => {
        фн.accessToken(userAgent).then(
          accessToken => {
            let config = {
              headers: { Authorization: `Bearer ${accessToken}` }
            }
            let url = `${graphUrl}/${endpoint}`
            axios.patch(url, data, config).then(resolve, reject)
          },
          reject
        )
      }
    )
  }
}
