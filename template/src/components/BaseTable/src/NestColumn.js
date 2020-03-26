export default {
  functional: true,

  name: 'NestColumn',

  render (h, context) {
    const { props } = context
    let { columns = [], emptyText, emptyValue, options } = props
    const children = columns.map(column => {
      const { label, prop, _id, columns: cols = [], ...data } = column
      const attrs = { ...options, ...data, label, prop }
      const scoped = data.formatter
        ? {}
        : {
          scopedSlots: {
            default: scope => {
              const _props = { ...attrs, label, prop, ...scope }
              return <v-cell attrs={_props} nest empty-text={emptyText} empty-value={emptyValue} />
            }
          }
        }
      return (
        <el-table-column key={_id} attrs={attrs} {...scoped}>
          {cols.length > 0 && <nest-column columns={cols} empty-text={emptyText} empty-value={emptyValue} options={options} />}
        </el-table-column>
      )
    })
    children.unshift(children.splice(-1))
    return <template>{children}</template>
  }
}
