import Sheets from './src/main.vue'

Sheets.install = Vue => {
  Vue.component(Sheets.name, Sheets)
}

export default Sheets
