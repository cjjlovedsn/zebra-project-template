import Upload from './src/main.vue'

Upload.install = Vue => {
  Vue.component(Upload.name, Upload)
}

export default Upload
