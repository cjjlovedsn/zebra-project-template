module.exports = (api, options) => {
  api.extendPackage({
    dependencies: {
      'element-ui': '^2.6.3'
    }
  })
  // 自定义elementUI主题
  if (options.theme) {
    if (options.et) {
      api.extendPackage({
        scripts: {
          'theme-build': 'et',
          'theme-init': 'et --init ./src/lib/element-variables.scss'
        },
        devDependencies: {
          'babel-plugin-component': '^1.1.1',
          'element-theme': '^2.0.1',
          'element-theme-chalk': '^2.6.3'
        },
        'element-theme': {
          browsers: ['ie > 9', 'last 2 versions'],
          out: './src/theme',
          config: './src/theme-variables.scss',
          theme: 'element-theme-chalk',
          minimize: true,
          components: ['button', 'message']
        }
      })
      api.render({
        './src/theme/README.md': './resources/theme/README.md',
        './src/theme-variables.scss': './resources/theme-variables.ejs'
      })
    } else {
      api.render({
        './src/element-variables.scss': './resources/element-variables.scss'
      })
    }
  }
  api.render({
    './src/plugins/element.js': './resources/element.ejs'
  })
}