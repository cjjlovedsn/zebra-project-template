import Title from './src/main.vue'

Title.install = Vue => {
  Vue.component(Title.name, Title)
}

export default Title
