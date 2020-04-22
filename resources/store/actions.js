import * as api from './service'
import {
  UPDATE_TOKEN,
  RESET_TOKEN,
  UPDATE_USERINFO
} from './mutation-types'
export default {
  [UPDATE_TOKEN]: ({ commit }) => api.getToken().then(token => {
    commit(UPDATE_TOKEN, token)
    return token
  }),
  [UPDATE_USERINFO]: ({ commit }, payload) => api.getPermissions(payload).then(data => {
    commit(UPDATE_USERINFO, data)
    return data
  }, error => {
    commit(UPDATE_USERINFO, {})
    throw error
  }),
  [RESET_TOKEN]: ({ commit }) => {
    api.cleanToken()
    commit(RESET_TOKEN)
  }
}
