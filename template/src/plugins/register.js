import Vue from 'vue'
const context = require.context('../components/', true, /index\.js/)
for (let key of context.keys()) {
  const component = context(key).default
  Vue.use(component)
}
