module.exports = {
  // set your styleguidist configuration here
  title: 'Default Style Guide',
  components: 'src/components/**/[A-Z]*.vue',
  defaultExample: false,
  usageMode: 'expand', // 是否展开用法
  exampleMode: 'expand', // 是否展开示例代码
  styleguideDir: 'styleguide', // 打包的目录
  codeSplit: true, // 打包时是否进行分片
  skipComponentsWithoutExample: true // 是否跳过没有样例的组件
  // sections: [
  //   {
  //     name: 'First Section',
  //     components: 'src/components/**/[A-Z]*.vue'
  //   }
  // ],
  // webpackConfig: {
  //   // custom config goes here
  // },
}
