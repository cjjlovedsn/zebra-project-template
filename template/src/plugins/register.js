export default {
  install (Vue) {
    const context = require.context('../components/global', true, /index\.(vue|js)/)
    for (let key of context.keys()) {
      const component = context(key).default
      Vue.component(component.name, component)
    }
  }
}
