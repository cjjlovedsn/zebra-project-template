module.exports = (api, options, rootOptions) => {
  api.extendPackage({
    scripts: {
      "serve": "vue-cli-service serve --mode dev",
      "commit": "git-cz",
      "release": "standard-version",
      "styleguide": "vue-cli-service styleguidist",
      "styleguide:build": "vue-cli-service styleguidist:build",
      "fix-memory-limit": "cross-env LIMIT=4096 increase-memory-limit"
    },
    dependencies: {
      'axios': '^0.18.0',
      'dayjs': '^1.7.8',
      'vue-cookie': '^1.1.4',
      'vue-router': '^3.0.1',
      'vuex': '^3.0.1'
    },
    devDependencies: {
      'compression-webpack-plugin': '^2.0.0',
      'style-resources-loader': '^1.2.1',
      'vue-cli-plugin-style-resources-loader': '^0.1.3',
      '@babel/plugin-proposal-nullish-coalescing-operator': '^7.8.3',
      '@babel/plugin-proposal-optional-chaining': '^7.8.3',
      '@commitlint/cli': '^8.3.5',
      'commitizen': '^4.0.3',
      'commitlint-config-cz': '^0.13.0',
      'cz-customizable': '^6.2.0',
      'husky': '^4.2.3',
      'increase-memory-limit': '^1.0.7',
      'standard-version': '^7.1.0',
      'vue-cli-plugin-styleguidist': '^4.7.6'
    },
    eslintConfig: {
      rules: {
        'vue/require-prop-type-constructor': 'off',
        'vue/require-valid-default-prop': 'off',
        camelcase: 0,
        "template-curly-spacing" : "off",
        indent : "off"
      }
    },
    "husky": {
      "hooks": {
        "pre-commit": "lint-staged",
        "commit-msg": "commitlint -e $GIT_PARAMS"
      }
    },
    "config": {
      "commitizen": {
        "path": "node_modules/cz-customizable"
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
  // 安装echarts
  if (options.echarts) {
    api.extendPackage({
      dependencies: {
        'vue-echarts': '^5.0.0'
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

  // 渲染env文件
  api.render({
    './.env': './resources/_env.ejs'
  }, { data: {} })
  // 渲染env.dev文件
  api.render({
    './.env.dev': './resources/_env.ejs'
  }, { data: options })
  
  api.render({
    './babel.config.js': './resources/babel.config.ejs',
  })
  // 配置多页面
  const pages = options.pages ? options.pages.split(',') : []
  const titles = options.multiple && options.titles ? options.titles.split(',') : []
  pages.forEach((page, index) => {
    api.render({
      [`./src/app/${page}/plugins/axios.js`]: './resources/axios.ejs',
      [`./src/app/${page}/main.js`]: './resources/main.ejs',
      [`./src/app/${page}/store/actions.js`]: './resources/store/actions.js',
      [`./src/app/${page}/store/getters.js`]: './resources/store/getters.js',
      [`./src/app/${page}/store/mutation-types.js`]: './resources/store/mutation-types.js',
      [`./src/app/${page}/store/mutations.js`]: './resources/store/mutations.js',
      [`./src/app/${page}/store/state.js`]: './resources/store/state.js',
      [`./src/app/${page}/store/modules/README.md`]: './resources/store/modules/README.md',
      [`./src/app/${page}/store/index.js`]: './resources/store.ejs',
      [`./src/app/${page}/router.js`]: './resources/router.ejs',
      [`./src/app/${page}/routes.js`]: './resources/routes.ejs',
      [`./src/app/${page}/views/error/assets/ufo.png`]: './resources/views/error/assets/ufo.png',
      [`./src/app/${page}/views/error/403.vue`]: './resources/views/error/403.vue',
      [`./src/app/${page}/views/error/404.vue`]: './resources/views/error/404.vue',
      [`./src/app/${page}/views/error/500.vue`]: './resources/views/error/500.vue',
      [`./src/app/${page}/App.vue`]: './resources/App.vue',
    }, { name: page, title: titles[index] })
    if (options.echarts) api.render({ [`./src/app/${page}/plugins/echarts.js`]: './resources/echarts.ejs' })
  })
  if (!options.multiple) {
    api.render({
      './src/store/index.js': './resources/store.ejs',
      './src/store/actions.js': './resources/store/actions.js',
      './src/store/getters.js': './resources/store/getters.js',
      './src/store/mutation-types.js': './resources/store/mutation-types.js',
      './src/store/mutations.js': './resources/store/mutations.js',
      './src/store/state.js': './resources/store/state.js',
      './src/store/modules/README.md': './resources/store/modules/README.md',
      './src/router.js': './resources/router.ejs',
      './src/routes.js': './resources/routes.ejs',
      './src/views/error/403.vue': './resources/views/error/403.vue',
      './src/views/error/404.vue': './resources/views/error/404.vue',
      './src/views/error/500.vue': './resources/views/error/500.vue',
      './src/axios.js': './resources/axios.ejs',
    }, { name: 'index', title: options.title })
    if (options.echarts) api.render({ './src/plugins/echarts.js': './resources/echarts.ejs' })
  }
  api.render({
    './vue.config.js': './resources/vue.config.ejs',
  }, { pages: JSON.stringify(pages) })
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
