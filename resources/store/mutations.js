import {
  UPDATE_TOKEN
} from './mutation-types'
export default {
  [UPDATE_TOKEN]: (state, payload) => {
    state.token = payload
  }
}
