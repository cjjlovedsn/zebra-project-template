/**
 * 处理columns数据
 * @param {array} data 原始列数组
 * @param {object} value 表格筛选参数
 * @param {vnode} context
 * @param {number} level 层级
 * @return {object}
 */
let temp = 0
export const computedColumns = (data = [], context, level = 0) => {
  const len = data.length
  const columns = []
  temp++
  for (let i = 0; i < len; i++) {
    const item = { ...data[i] }
    if (!item._id) {
      item._id = `id_${temp}_${level}_${i}`
    }
    if (typeof item.hide === 'function' && item.hide.call(context, context)) continue
    if (typeof item.hide === 'boolean' && item.hide) continue
    columns.push(item)

    const children = item.columns
    if (Array.isArray(children)) {
      item.columns = computedColumns(children, context, level + 1)
    }
  }
  return columns
}

/**
 * 深度获取数组的所有id
 * @param {string[]} data 原始列数组
 */
export const getAllColumnsId = (data = []) => data.reduce((result, item) => {
  result.push(item._id)
  return [...result, ...getAllColumnsId(item.columns || [])]
}, [])

/**
 * 深度过滤出选中的列
 * @param {array} data 原始列数组
 * @param {string[]} checked 选中的列的_id
 */
export const filterColumns = (data = [], checked) => {
  return data.reduce((result, { _id, columns, ...item }) => {
    const target = { _id, columns, ...item }
    if (checked.includes(_id)) result.push(target)
    if (Array.isArray(columns)) {
      target.columns = filterColumns(columns, checked)
    }
    return result
  }, [])
}
