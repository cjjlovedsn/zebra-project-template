export default {
  name: 'BaseSearch',

  inheritAttrs: false,

  props: {
    trigger: {
      type: String,
      default: 'blur'
    }
  },

  render (h) {
    const { trigger, $slots, $attrs } = this
    const children = $slots.default.map(child => {
      const { label, prop, rules, labelWidth, required, message } = Object.assign({}, child.componentOptions.propsData, child.data.attrs)
      const _required = [ { required: required !== undefined, message, trigger } ]
      const _rules = Array.isArray(rules) ? rules.some(item => item.required) ? rules : rules.concat(_required) : _required
      return <el-form-item
        label={label}
        prop={prop}
        rules={_rules}
        labelWidth={labelWidth}
      >{child}</el-form-item>
    })
    const search = () => this.$emit('search', $attrs.model)
    const reset = () => {
      this.$refs.form.resetFields()
      search()
    }
    return <div class="mb-3 clearfix">
      <el-form { ...{ props: $attrs } } ref="form">
        {children}
      </el-form>
      <div class="float-right">
        <el-button type="primary" onClick={search}>查询</el-button>
        <el-button onClick={reset}>重置</el-button>
        {$slots.append}
      </div>
    </div>
  }
}
