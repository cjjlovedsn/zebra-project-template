export default {
  functional: true,

  name: 'Cell',

  render (h, context) {
    const {
      row = {},
      $index,
      column = {},
      prop,
      slotName,
      map,
      emptyText = '-',
      emptyValue,
      popoverOptions,
      cellClass,
      formatter,
      render
    } = context.props
    const className = typeof cellClass === 'function' ? cellClass(row) : (cellClass || '')
    const options = Object.assign({
      trigger: 'hover'
    }, popoverOptions)
    const valueFormat = () => {
      const value = row[prop]
      if (render) return render.call(context.parent, h, row, column, value, $index)
      if (formatter) return formatter.call(context.parent, row, column, value, $index)
      if (typeof prop !== 'undefined') {
        if (map) {
          if (!emptyValue.includes(map[value])) return map[value]
          if (!emptyValue.includes(map.default)) return map.default
        }
        return emptyValue.includes(value) ? emptyText : value
      }
      return emptyText
    }
    const value = row._emptyValue || valueFormat()
    const cellVm = () => {
      if (slotName) {
        const scopedSlot = context.parent.$scopedSlots[slotName]
        if (scopedSlot) return scopedSlot({ prop, $index, row, value, column })
      }
      return <span class={ className }>{ value }</span>
    }
    const { slot, ...attrs } = options
    const content = slot && context.parent.$scopedSlots[slot]
    if (content) {
      return (
        <el-popover { ...{ attrs } }>
          { content({ prop, $index, row, value, column }) }
          <span slot="reference" class={ className }>{ cellVm() }</span>
        </el-popover>
      )
    }
    return cellVm()
  }
}
