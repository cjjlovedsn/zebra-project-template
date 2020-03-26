export default {
  name: 'BaseSelect',

  functional: true,

  props: {
    options: {
      type: Array,
      default: () => []
    }
  },

  render (h, context) {
    const { options } = context.props
    const elOption = options.map(attrs => {
      return <el-option { ...{ attrs } }/>
    })
    return <el-select { ...context.data }>{elOption}</el-select>
  }
}
