const path = require('path')
const CompressionPlugin = require('compression-webpack-plugin')
const resolve = (...args) => path.join(__dirname, ...args)
const {
  NODE_ENV,
  OUTPUT_DIR,
  VIEWS_PATH
} = process.env
const isProd = NODE_ENV === 'production'
module.exports = {
  outputDir: isProd && OUTPUT_DIR
    ? resolve(OUTPUT_DIR)
    : undefined,
  pages: {
    index: {
      entry: './src/main.js',
      template: './public/index.html',
      filename: isProd && VIEWS_PATH
        ? resolve(VIEWS_PATH, 'index.blade.php')
        : 'index.html'
    }
  },
  <%_ if (options.compressImage) { _%>
  chainWebpack: config => {
    if (isProd) {
      /* 图片压缩 */
      config.module
        .rule('images')
        .use('image-webpack-loader')
        .loader('image-webpack-loader')
        .tap(() => {
          return {
            mozjpeg: {
              progressive: true,
              quality: 65
            },
            // optipng.enabled: false will disable optipng
            optipng: {
              enabled: false
            },
            pngquant: {
              quality: '65-90',
              speed: 4
            }
          }
        })
    }
  },
  <%_ } _%>
  configureWebpack: config => {
    if (isProd) {
      return {
        plugins: [
          /* gzip压缩 */
          new CompressionPlugin({
            test: /\.js$|\.html$|.\css/, // 匹配文件名
            threshold: 10240, // 对超过10k的数据压缩
            deleteOriginalAssets: false // 不删除源文件
          })
        ]
      }
    }
  },
  devServer: {
    public: 'local.data-stone.com',
    open: false,
    host: '0.0.0.0',
    disableHostCheck: true,
    proxy: {
      '/mock': {
        target: `http://127.0.0.1:3000`,
        changeOrigin: true,
        pathRewrite: {
          '^/mock': ''
        }
      },
      <%_ if (options.proxy) { _%>
      '/api': {
        target: '<%=options.proxy%>',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
      <%_ } _%>
    }
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        resolve('./src/styles/variables.scss'),
        resolve('./src/styles/mixins.scss'),
      ]
    }
  }
}
