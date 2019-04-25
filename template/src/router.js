import Vue from 'vue'
import Router from 'vue-router'
import getRoutes from './routes'

const routes = getRoutes({
  config: {
    meta: {
      title: 'zebra-c'
    }
  }
})

Vue.use(Router)

const router = new Router({ routes })

router.beforeEach((to, from, next) => {
  if (to) {
    document.title = to.meta.title
  }
  next()
})

export default router
