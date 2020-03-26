module.exports = [
  {
    name: 'multiple',
    type: 'confirm',
    message: '是否配置多页面？',
    default: false
  },
  {
    name: 'title',
    type: 'input',
    message: '请输入页面默认标题：',
    when: answer => !answer.multiple
  },
  {
    name: 'pages',
    type: 'input',
    message: '请输入页面名称，以英文逗号分隔：',
    when: answer => answer.multiple
  },
  {
    name: 'titles',
    type: 'input',
    message: '请输入页面标题，以英文逗号分隔：',
    when: answer => answer.multiple
  },
  {
    name: 'proxy',
    type: 'input',
    message: '请输入测试环境服务器地址：'
  },
  {
    name: 'mock',
    type: 'input',
    message: '请输入mock地址：'
  },
  {
    name: 'elementUI',
    type: 'confirm',
    message: `是否需要使用element-ui？`,
    default: true
  },
  {
    name: 'component',
    type: 'confirm',
    message: `是否按需引入？`,
    default: false,
    when: answer => answer.elementUI
  },
  {
    name: 'theme',
    type: 'confirm',
    message: `是否需要自定义element-ui主题？`,
    default: true,
    when: answer => answer.elementUI
  },
  {
    name: 'et',
    type: 'confirm',
    message: `是否需要自定义主题工具？`,
    default: false,
    when: answer => answer.elementUI && answer.component && answer.theme
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
