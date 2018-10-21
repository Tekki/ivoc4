import axios from 'axios'

const sampleUrl = window.location.origin + '/samples/'

export default {
  get (id) {
    return new Promise(
      (resolve, reject) => {
        axios.get(sampleUrl + id + '.json').then(resolve, reject)
      }
    )
  }
}
