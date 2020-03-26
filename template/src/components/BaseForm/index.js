import Form from './src/main.vue'
import Row from './src/Row.vue'
import Cell from './src/Cell.vue'
import './src/style.scss'
export default {
  install (Vue) {
    Vue.component(Form.name, Form)
    Vue.component(Row.name, Row)
    Vue.component(Cell.name, Cell)
  }
}
