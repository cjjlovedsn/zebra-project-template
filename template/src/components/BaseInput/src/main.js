export default {
  functional: true,

  name: 'BaseInput',

  render (h, context) {
    const { children = [] } = context
    const { message, prefixIcon } = context.props
    const offset = prefixIcon ? [30, 0] : undefined
    const slots = children.map(item => {
      const { slot } = item.data
      if (slot) return <template slot={slot}>{item}</template>
      return item
    })
    return <form-error message={message} offset={offset}>
      <el-input { ...context.data } >
        {slots}
      </el-input>
    </form-error>
  }
}
