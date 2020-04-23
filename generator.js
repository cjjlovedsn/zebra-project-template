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
      'vuex': '^3.0.1',
      "nprogress": "^0.2.0",
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

  if (options.multiple) {
    api.render(files => {
      Object.keys(files)
        .filter(path => [ 'src/App.vue', 'src/main.js', 'src/router.js', 'src/store.js' ].some(keyword => path.includes(keyword)))
        .forEach(path => delete files[path])
    })
  }

  // 安装elementUI
  if (options.elementUI) {
    require('./element')(api, options)
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
  require('./pages')(api, options)

  // 配置权限
  if (options.perms) {
    require('./perms')(api, options)
  }

  const pages = options.pages ? options.pages.split(',') : []
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
