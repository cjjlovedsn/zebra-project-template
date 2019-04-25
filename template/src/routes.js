import _path from 'path'
import store from './store'
const ctx = require.context('./views', true, /^((?!\.config\b|\/error\/).)*\.(vue|js)$/, 'lazy')
const configCtx = require.context('./views', true, /\.config\.js$/)
const errorCtx = require.context('./views', true, /error\/(404|500).(vue|js)$/)
const files = ctx.keys()
const configFiles = configCtx.keys()
const routeFiles = files.filter(key => !/\b(components?|layout|lib|assets|config)\b/.test(key))

const createRoute = (globalConfig) => (file, isNest) => {
  const dir = file.replace(/\.(vue|js)$/, '')
  const paths = dir.slice(2).split(/\//)
  let fileName = paths.pop() || ''
  let suffix = ''
  let route = {}

  // 判断是否嵌套路由
  let children = routeFiles.filter(item => fileName && item.includes(dir) && item !== file)
  if (children.length > 0) {
    route.children = children.map((file, index) => {
      const r = createRoute(file, true)
      if (index === 0) {
        route.redirect = r.name
      }
      return r
    })
  }

  // 判断是否动态路由
  if (/_(.+)$/.test(fileName)) {
    fileName = RegExp.$1
    const index = file.replace(RegExp(`_${fileName}\\.(vue|js)$`), 'index.$1')
    const paramsIsRequired = routeFiles.includes(index)
    // 生成动态路由
    suffix = `:${fileName}${paramsIsRequired ? '' : '?'}`
    route.props = true
  }

  // 生成path
  let path
  const pname = fileName.replace(/^index$/, '')
  if (isNest) {
    path = [...paths.slice(1), suffix || pname].join('/')
    const index = routeFiles.findIndex(item => item !== file)
    if (index > -1) {
      routeFiles.splice(index, 1)
    }
  } else {
    path = _path.join('/', ...paths, suffix || pname)
  }

  // 生成name
  const arr = paths.length > 0 && !fileName ? [] : [fileName]
  const name = [...paths, ...arr].join('-')
  if (name === 'index' && !isNest) {
    path = '/'
  }

  Object.assign(route, {
    path,
    name,
    component: () => ctx(file)
  })

  if (typeof globalConfig === 'function') {
    Object.assign(route, globalConfig(route, file))
  } else {
    Object.assign(route, globalConfig)
  }

  // 额外的配置
  const configPath = dir + '.config.js'
  if (configFiles.includes(configPath)) {
    const conf = configCtx(configPath)
    const { validate, ...config } = conf.default || conf
    Object.assign(route, config)
    if (validate) {
      route.beforeEnter = async (to, _, next) => {
        if (validate) {
          try {
            const valid = await validate.call(to, { params: to.params, store })
            if (valid) {
              next()
            } else {
              next('404')
            }
          } catch (error) {
            next('/500')
          }
        } else {
          next()
        }
      }
    }
  }

  return route
}

// error页面
const errorPages = errorCtx.keys().map(file => {
  const [, name] = /(404|500).(vue|js)$/.exec(file)
  return {
    path: name === '404' ? '*' : '/500',
    name,
    component: () => import(`./views${file.slice(1)}`)
  }
})

const getRoutes = (options = {}) => {
  const { extend } = options
  const routes = routeFiles.map(file => createRoute(extend)(file))
  return [
    ...errorPages,
    ...routes
  ]
}

export default getRoutes
