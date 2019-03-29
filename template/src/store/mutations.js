import {
  UPDATE_TOKEN,
  SET_LOADING
} from './mutation-types'
export default {
  [UPDATE_TOKEN]: (state, payload) => {
    state.token = payload
  },
  [SET_LOADING]: (state, payload) => {
    state.loading = Object.assign(state.loading, payload)
  }
}
