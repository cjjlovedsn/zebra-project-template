<template>
  <el-popover
    placement="bottom-end"
    :trigger="trigger"
    transition="el-zoom-in-top"
    @show="open = true"
    @hide="open = false"
  >
    <el-button
      slot="reference"
      class="btn"
    >
      显示列
      <i
        class="el-icon-arrow-down el-icon--right arrow"
        :class="{'is-open': open}"
      />
    </el-button>
    <div class="columns-filter__wrap">
      <el-checkbox
        :indeterminate="isIndeterminate"
        :value="checkAll"
        @input="handleCheckAllChange"
        class="mb10"
      >全选</el-checkbox>
      <el-button
        type="text"
        class="columns-filter__reset"
        @click="handleReset"
      >重置</el-button>
      <div class="checkbox-list">
        <el-tree
          :data="options"
          show-checkbox
          default-expand-all
          node-key="_id"
          ref="tree"
          highlight-current
          :props="defaultProps"
          @check-change="handleChange"
        ></el-tree>
      </div>
    </div>
  </el-popover>
</template>

<script>
import * as utils from './utils'
export default {
  name: 'ColumnsFilter',

  props: {
    trigger: {
      type: String,
      validator: value => /(click|hover|focus|manual)/.test(value),
      default: 'click'
    },
    options: {
      type: Array,
      default: () => []
    },
    value: {
      type: Array,
      required: true
    }
  },

  computed: {
    allKeys () {
      return utils.getAllColumnsId(this.options)
    },
    defaultChecked () {
      return this.getCheckedKeys(this.value)
    },
    checkedKeys () {
      return utils.getAllColumnsId(this.checkedNodes)
    },
    checkAll () {
      return this.checkedKeys.length === this.allKeys.length
    },
    isIndeterminate () {
      const len = this.checkedKeys.length
      return len > 0 && len < this.allKeys.length
    }
  },

  watch: {
    defaultChecked: {
      handler (val) {
        this.$nextTick(() => {
          const { tree } = this.$refs
          if (tree) {
            tree.setCheckedKeys(val)
          }
        })
      },
      immediate: true
    }
  },

  data () {
    return {
      open: false,
      defaultProps: {
        label: 'label',
        children: 'columns'
      },
      checkedNodes: []
    }
  },

  methods: {
    getCheckedKeys (data) {
      if (Array.isArray(data)) {
        const result = data.reduce((result, { _id, columns = [] }) => {
          const cols = this.getCheckedKeys(columns)
          // 子节点全选中的时候设置当前节点选中
          if (columns.length === 0 || columns.every(item => cols.includes(item._id))) result.push(_id)
          return [ ...result, ...cols ]
        }, [])
        return result
      }
      return []
    },
    // 全选切换
    handleCheckAllChange (val) {
      if (val) {
        this.$refs.tree.setCheckedKeys(this.allKeys)
        this._handleChange(this.options)
      } else {
        const value = []
        this.$refs.tree.setCheckedNodes(value)
        this._handleChange(value)
      }
    },
    _handleChange (value) {
      this.$emit('change', value)
      this.checkedNodes = value
    },
    handleChange () {
      // 所有选中与半选中的数据
      const checkedNodes = this.$refs.tree.getCheckedNodes(false, true) || []
      const value = utils.filterColumns(this.options, checkedNodes.map(item => item._id))
      this._handleChange(value)
    },
    handleReset () {
      this._handleChange(this.value)
      this.$refs.tree.setCheckedKeys(this.defaultChecked)
    }
  }
}
</script>

<style lang="scss" scoped>
  .checkbox-list {
    max-height: 250px;
    overflow: auto;
  }
  .btn {
    position: relative;
    padding-right: 26px;
  }
  .arrow {
    position: absolute;
    right: 8px;
    transition: all 0.3s ease;
    &.is-open {
      transform: rotate(180deg);
    }
  }
  .columns-filter__wrap {
    .columns-filter__reset {
      float: right;
      padding: 0 20px 0 0;
      line-height: 19px;
    }
  }
</style>
