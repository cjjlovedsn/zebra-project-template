import * as types from './mutation-types'
import * as utils from '@/utils'
export default {
  [types.UPDATE_TOKEN]: (state, payload) => {
    state.token = payload
  },
  [types.UPDATE_USERINFO] (state, payload) {
    const data = utils.responseFormat.string2number(payload?.perms ?? [], ['parent_id', 'client'], true).filter(item => item.client === 2 && item.path)
    state.menu = utils.translateDataToTree(data)
    state.userinfo = payload
  },
  [types.RESET_TOKEN] (state) {
    state.token = null
  }
}
