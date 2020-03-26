export default {
  name: 'BaseFormItem',

  functional: true,

  props: {
    message: String,
    offset: Array
  },

  render (h, context) {
    const errorProps = {
      attrs: context.props
    }
    return <el-form-item {...context.data}>
      <form-error {...errorProps}>{context.children}</form-error>
    </el-form-item>
  }
}
