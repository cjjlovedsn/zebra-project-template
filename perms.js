const path = require('path');
const constant = require('./constant')
const util = require('./util')
module.exports = (api, options) => {
 const basePath = options.permsFor
  ? path.join(constant.APP_DIR, options.permsFor)
  : './src'
 const files = util.glob('./resources/views/system')
 const template = files.reduce((result, file) => {
   const filepath = file.replace(/resources/, '')
   const key = path.join(basePath, filepath)
  result[key] = file
 }, {
   [`${basePath}/views/system.vue`]: './resources/views/system.vue'
 })
 api.render(template)
}