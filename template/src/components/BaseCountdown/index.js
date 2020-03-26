import Countdown from './src/main.vue'
export default {
  install (Vue) {
    Vue.component(Countdown.name, Countdown)
  }
}
