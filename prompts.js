module.exports = [
  {
    name: 'proxy',
    type: 'input',
    message: '请输入测试环境服务器地址：'
  },
  {
    name: 'elementUI',
    type: 'confirm',
    message: `是否需要使用element-ui？`,
    default: true
  },
  {
    name: 'theme',
    type: 'confirm',
    message: `是否需要自定义element-ui主题？`,
    default: true,
    when: answer => answer.elementUI
  },
  {
    name: 'elementSize',
    type: 'list',
    message: `选择element-ui组件默认尺寸`,
    choices: [
      'small',
      'medium',
      'large'
    ],
    default: 'small',
    when: answer => answer.elementUI
  },
  {
    name: 'compressImage',
    type: 'confirm',
    message: '是否需要图片压缩？',
    default: false
  }
]
