import Table from './src/main.vue'

Table.install = Vue => {
  Vue.component(Table.name, Table)
}

export default Table
