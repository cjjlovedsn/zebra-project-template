module.exports = (api, options) => {
  api.extendPackage({
    dependencies: {
      axios: '^0.18.0',
      'blueimp-md5': '^2.10.0',
      dayjs: '^1.7.8',
      'vue-cookie': '^1.1.4',
      'vue-router': '^3.0.1',
      vuex: '^3.0.1'
    },
    devDependencies: {
      'compression-webpack-plugin': '^2.0.0',
      'style-resources-loader': '^1.2.1',
      'vue-cli-plugin-style-resources-loader': '^0.1.3'
    },
    eslintConfig: {
      rules: {
        'vue/require-prop-type-constructor': 'off',
        'vue/require-valid-default-prop': 'off',
        camelcase: 0
      }
    }
  })
  // 安装elementUI
  if (options.elementUI) {
    api.extendPackage({
      dependencies: {
        'element-ui': '^2.6.3'
      }
    })
    // 自定义elementUI主题
    if (options.theme) {
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
        './src/plugins/element.js': './resources/element.ejs',
        './src/theme/README.md': './resources/theme/README.md'
      })
    }
    api.render({
      './src/theme-variables.scss': './resources/theme-variables.scss'
    })
  }
  // 安装echarts
  if (options.echarts) {
    api.extendPackage({
      dependencies: {
        'vue-echarts': '^3.1.3'
      },
      transpileDependencies: ['vue-echarts', 'resize-detector']
    })
  }
  if (options.compressImage) {
    api.extendPackage({
      devDependencies: {
        'image-webpack-loader': '^4.5.0'
      }
    })
  }

  api.render('./template')
  api.postProcessFiles(files => {
    let template = files['public/index.html']
    if (template) {
      const lines = template.split(/\r?\n/g).reverse()
      const lastMetaIndex = lines.findIndex(line => line.trim().match(/^<meta/))
      lines[lastMetaIndex] +=
        '\n    <meta name="token" content="{{csrf_token()}}">'
      files['public/index.html'] = lines.reverse().join('\n')
    }
  })
}
