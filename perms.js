const path = require('path');
const constant = require('./constant')
const util = require('./util')
module.exports = (api, options) => {
  const basePath = options.permsFor
    ? path.join(constant.APP_DIR, options.permsFor)
    : './src'
  const files = util.glob(path.join(__dirname, './resources/views/system'))
  const template = files.reduce((result, file) => {
    const filepath = file.split(/resources/)[1]
    const key = path.join(basePath, filepath)
    result[key] = file
    return result
  }, {
    [`${basePath}/views/system.vue`]: './resources/views/system.vue'
  })
  api.render(template)
}