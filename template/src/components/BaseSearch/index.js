import Search from './src/main.js'

Search.install = Vue => {
  Vue.component(Search.name, Search)
}

export default Search
