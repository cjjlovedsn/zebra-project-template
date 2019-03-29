// 此组件用于解决 elementUI 2.5.4版本后出现的slot组件不更新的bug
export default {
  name: 'PageText',
  render (h) {
    const { internalCurrentPage: page, internalPageSize: size } = this.$parent.$parent
    const start = size * (page - 1) + 1
    const end = size * page
    return <span class="el-pagination__total">显示第{start}-{end}条结果，</span>
  }
}
