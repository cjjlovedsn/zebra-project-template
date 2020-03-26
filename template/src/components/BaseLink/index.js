import Link from './src/main.vue'

Link.install = Vue => {
  Vue.component(Link.name, Link)
}

export default Link
