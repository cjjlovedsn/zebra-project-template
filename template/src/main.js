import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from './lib/axios'
<%_ if (options.elementUI) { _%>
<%_ if (options.theme) { _%>
import './plugins/element.js'
<%_ } else { _%>
import ElementUI from 'element-ui'
import './theme.variables.scss'
<%_ } _%>
<%_ } _%>
import VueCookie from 'vue-cookie'
<%_ if (options.echarts) { _%>
import VueEcharts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
<%_ } _%>
import GlobalComponentRegister from './plugins/register'
  
Vue.config.productionTip = false

Vue.use(axios, { store, router })
<%_ if (options.elementUI && !options.theme) { _%>
Vue.use(ElementUI, { size: '<%= options.elementSize %>' })
<%_ } _%>
Vue.use(VueCookie)
Vue.use(GlobalComponentRegister)
<%_ if (options.echarts) { _%>
Vue.component('v-chart', VueEcharts)
<%_ } _%>

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
