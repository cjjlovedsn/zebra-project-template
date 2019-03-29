import axios from '../lib/axios'
import { UPDATE_TOKEN } from './mutation-types'
export default {
  [UPDATE_TOKEN]: ({ commit }) => {
    return axios.get('/', {}, { responseType: 'text' }).then(({ data }) => {
      if (/name="?token"?\s*content="?([^>\s"]+)"?/.test(data)) {
        let token = RegExp.$1
        commit(UPDATE_TOKEN, token)
        return Promise.resolve(token)
      }
    })
  }
}
