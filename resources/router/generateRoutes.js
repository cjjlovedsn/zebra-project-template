import { join } from 'path'
import store from '../store'
import Layout from '../components/Layout'
const ctx = require.context('../views', true, /^((?!\.config\b|\/error\/).)*\.(vue|js)$/, 'lazy')
const configCtx = require.context('../views', true, /\.config\.js$/)
const files = ctx.keys()
const configFiles = configCtx.keys()
const routeFiles = files.filter(key => !/\b(components?|layout|lib|assets|config|login|service)\b/.test(key))
const exclude = []
// 嵌套的排在前面，方便处理嵌套路由，防止嵌套路由二次添加
routeFiles.sort((a, b) => b.length - a.length)
// 动态路由往后排，防止同级非动态路由被覆盖
routeFiles.sort((a) => a.indexOf('_'))

const createRoute = (globalConfig) => (file, isRoot, isNest) => {
  if (exclude.includes(file)) return
  const dir = file.replace(/\.(vue|js)$/, '')
  const paths = dir.slice(2).split(/\//)
  let fileName = paths.pop() || ''
  let route = {}

  // 生成path
  const getPath = (suffix) => {
    const pname = fileName.replace(/^index$/, '')
    let path = ''
    if (isNest) {
      path = [...paths.slice(1), suffix || pname].join('/')
      exclude.push(file)
    } else {
      path = join('/', ...paths, suffix || pname)
    }
    return path.replace(/\/$/, '')
  }
  let path = getPath()
  let redirect

  // 判断是否嵌套路由
  let children = routeFiles.filter(item => fileName && item.includes(dir) && item !== file)
  if (children.length > 0) {
    route.children = children.map((file, index) => {
      const r = createRoute(globalConfig)(file, false, true)
      if (index === 0 && r) {
        redirect = join(path, r.path)
      }
      return r
    }).filter(item => item !== undefined)
  }

  // 判断是否动态路由
  if (/_(.+)$/.test(fileName)) {
    fileName = RegExp.$1
    const index = file.replace(RegExp(`_${fileName}\\.(vue|js)$`), 'index.$1')
    const paramsIsRequired = routeFiles.includes(index)
    // 生成动态路由
    const suffix = `:${fileName}${paramsIsRequired ? '' : '?'}`
    path = getPath(suffix)
    route.props = true
  }

  // 生成name
  const arr = paths.length > 0 && !fileName ? [] : [fileName]
  const name = [...paths, ...arr].join('-')
  if (name === 'index' && !isNest) {
    path = '/'
  }
  const _route = isRoot ? {
    path,
    component: Layout,
    children: [
      {
        path: '',
        name,
        redirect,
        component: () => import(`../views${file.slice(1)}`)
      },
      ...route.children ?? []
    ]
  } : {
    path,
    name,
    redirect,
    component: () => import(`../views${file.slice(1)}`)
  }

  Object.assign(route, _route)

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
              next('403')
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

const getRoutes = (options = {}) => {
  exclude.splice(0)
  const { extend, exclude: excludeReg } = options
  const routes = routeFiles.filter(item => excludeReg instanceof RegExp ? !excludeReg.test(item) : true).map(file => createRoute(extend)(file, true)).filter(item => item !== undefined)
  return routes
}

export default getRoutes
