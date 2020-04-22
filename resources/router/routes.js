import { join } from 'path'
import createRoutes from './generateRoutes'

const whiteList = [ '/dashboard' ]

const getRoutes = (route, permissions = [], parent = '/', active = '/') => {
  const fullPath = join(parent, route.path)
  const option = permissions.find(item => item.path === fullPath)
  const { id, parent_id, name, is_menu } = option || {}
  if (option) {
    route.meta = Object.assign({ name, id, parent_id }, route.meta)
    // 非menu路由，自动加上active。用于菜单高亮
    if (!is_menu) {
      route.meta.active = route.meta.active ? route.meta.active : active
    }
    if (route.children && route.children.length) {
      route.children = route.children.map(r => getRoutes(r, permissions, fullPath, is_menu ? fullPath : active))
      // 如果有子级，而且没有设置redirect那么重定向至第一个有meta.default的子路由
      if (route.children.length > 0) {
        const vaildRedirect = route.redirect ? route.children.some(item => item.path === route.redirect) : false
        if (!vaildRedirect) {
          const { path } = route.children.find(item => item.path.indexOf(':') === -1) || route.children[0]
          if (path) {
            route.redirect = join(fullPath, path)
          }
        }
      }
    }
  } else {
    if (whiteList.includes(route.path)) return route
    // 无权限的路由组件改为无权限页面组件
    route.redirect = '/403'
    route.children = undefined
  }
  return route
}
export default (permissions, options) => {
  const routes = createRoutes(options)
  return routes.reduce((result, route) => {
    if (Array.isArray(route)) {
      result.push(...route.map(item => getRoutes(item, permissions, '/')))
    } else {
      result.push(getRoutes(route, permissions, '/'))
    }
    return result
  }, [])
}
