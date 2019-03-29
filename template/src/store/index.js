import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

const context = require.context('./modules', true, /(state|actions|mutations|getters)\.js$/)
const modules = context.keys().reduce((modules, filePath) => {
  const paths = filePath.replace(/^\.\/(.+)\.js$/, '$1').split(/\//)
  const fileName = paths.pop()
  let last = modules
  while (paths.length > 0) {
    const k = paths.shift()
    last = last[k] = last[k] || {}
  }
  last[fileName] = context(filePath).default
  return modules
}, {})

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state,
  actions,
  mutations,
  getters,
  modules
})
