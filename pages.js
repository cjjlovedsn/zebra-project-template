const constant = require('./constant')
const store = [ 'index.ejs', 'state.js', 'actions.js', 'getters.js', 'mutation-types.js', 'mutations.js', 'service.js' ]
const plugins = [ 'axios.ejs', 'echarts.ejs' ]
const views = [ 'error/assets/ufo.png', 'error/403.vue', 'error/404.vue', 'error/500.vue' ]
const router = [ 'index.ejs', 'generateRoutes.js', 'routes.js' ]
const components = [ 'Layout.vue.ejs' ]
const _options = {
  store,
  plugins,
  views,
  router,
  components
}

const getTemplate = (path, { auto, perms }) => Object.keys(_options).reduce((acc, key) => {
  const files = _options[key]
  for (const file of files) {
    const filename = file.replace('.ejs', /\.vue/.test(file) ? '' : '.js')
    const dest = `${path}/${key}/${filename}`
    if (!auto && file.includes('generateRoutes')) continue
    if (!perms && file.includes('routes')) continue
    acc[dest] = `./resources/${key}/${file}`
  }
  return acc
}, {
  [`${path}/main.js`]: './resources/main.ejs',
  [`${path}/App.vue`]: './resources/App.vue',
})

module.exports = (api, options) => {
  const pages = options.pages ? options.pages.split(',') : []
  const perms = options.perms
  const auto = options.autoRoutes
  if (options.multiple) {
    const titles = options.titles ? options.titles.split(',') : []
    pages.forEach((page, i) => {
      const template = getTemplate(`${constant.APP_DIR}/${page}`)
      const title = titles[i]
      api.render(template, { name: page, title, perms, auto })
    })
    if (auto) {
    }
  } else {
    api.render(getTemplate('./src'), { name: 'index', title: options.title, perms, auto })
  }
}