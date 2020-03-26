<template>
  <div :class="['base-table', { 'border-hide': borderHide, 'base-table--loading': loading }]">
    <header
      v-if="$slots.header || filterable"
      class="base-table__header"
    >
      <slot name="header"></slot>
      <ColumnsFilter
        v-if="filterable"
        :value="computedDefaultChecked"
        :options="computedColumns"
        class="base-table__filter"
        @change="checked = $event"
      />
    </header>
    <div class="base-table__wrapper">
      <el-table
        :data="tableData"
        :max-height="limitTableHeight ? tableHeight : maxHeight"
        :key="tableColumns.length"
        v-bind="$attrs"
        v-on="$listeners"
        class="base-table__inner"
        :class="{ 'fit-row': fitRow }"
        ref="table"
        :cell-class-name="borderHide ? 'border-hide' : ''"
        @selection-change="selectionChange"
      >
        <div
          class="data-empty"
          slot="empty"
        >
          <div
            v-loading="loading"
            :element-loading-text="loadingText"
            element-loading-spinner="el-icon-loading"
            class="base-table__loading"
          >
          </div>
          <slot name="empty">
            <span v-if="!loading">{{ noDataText }}</span>
          </slot>
        </div>
        <!-- 默认table-column插槽 -->
        <slot />
        <div slot="append">
          <div
            v-if="fitRow && padRowNumber > 0 && data.length > 0"
            class="pad-empty"
            :class="{ 'is-hidden': loading }"
          >
            <span>{{ noDataText }}</span>
          </div>
        </div>
        <!-- 遍历columns -->
        <template v-for="({ align = 'center', header, columns: cols = [], ...attrs }) in tableColumns">
          <el-table-column
            v-bind="Object.assign({ showOverflowTooltip }, columnOptions, attrs)"
            :align="align"
            :key="attrs.prop || attrs._id"
          >
            <template
              v-if="header"
              v-slot:header="scope"
            >
              <slot
                v-if="header && $scopedSlots[header]"
                :name="header"
                v-bind="scope"
                :row="attrs"
              />
            </template>
            <nest-column
              v-if="cols.length > 0"
              :columns="cols"
              :options="Object.assign({ popoverOptions, align, showOverflowTooltip }, columnOptions, attrs)"
              :empty-text="emptyText"
              :empty-value="_emptyValue"
            />
            <template
              v-if="!attrs.type"
              #default="scope"
            >
              <v-cell
                v-if="cols.length === 0"
                v-bind="Object.assign({ popoverOptions, showOverflowTooltip }, scope, attrs)"
                :empty-text="emptyText"
                :empty-value="_emptyValue"
              />
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>
    <el-pagination
      v-if="pagination"
      v-bind="pageAttrs"
      style="padding: 12px"
      :current-page="page"
      :page-size="size"
      :total="total"
      @update:currentPage="handleChange('page', $event)"
      @update:pageSize="handleChange('size', $event)"
      layout="slot, total, sizes, ->, prev, pager, next"
      ref="page"
    >
      <template v-slot>
        <span
          class="el-pagination__total"
        >显示第{{ size * (page - 1) + 1 }}-{{ size * page }}条结果，</span>
      </template>
    </el-pagination>
  </div>
</template>

<script>
import NestColumn from './NestColumn'
import Cell from './Cell'
import ColumnsFilter from './ColumnsFilter'
import * as utils from './utils'
export default {
  name: 'BaseTable',

  inheritAttrs: false,

  components: {
    NestColumn,
    'v-cell': Cell,
    ColumnsFilter
  },

  props: {
    /**
     * 列配置对象数组
     * @param { String } columns.label
     * @param { String } columns.prop
     * @param { String } columns.slotName
     * @param { Object } columns.map
     * @param { Array } columns.columns
     */
    columns: {
      type: Array,
      required: true
    },
    data: {
      type: Array,
      default () {
        return []
      }
    },
    total: {
      type: Number,
      default: 0
    },
    page: {
      type: Number,
      default: 1
    },
    size: {
      type: Number,
      default: 10
    },
    emptyText: {
      type: String,
      default: '-'
    },
    columnOptions: Object,
    pageOptions: Object,
    loading: Boolean,
    limitTableHeight: {
      type: Boolean,
      default: true
    },
    maxHeight: [ String, Number ],
    /**
     * 需要搭配limitTableHeight使用。用于修正表格高度
     */
    offset: {
      type: Number,
      default: 100
    },
    pagination: {
      type: Boolean,
      default: true
    },
    /**
     * 提示框配置项
     * slot属性是必须的，其他属性将绑定到popover组件上
     * @param { String } popoverOptions.slot 提示信息插槽名
     */
    popoverOptions: Object,
    borderHide: Boolean,
    emptyValue: null, // 空值表
    filterable: Boolean,
    checkedAll: Boolean,
    selectionRows: Array,
    selectionKey: String,
    spanMethod: Function,
    fitRow: {
      type: [ Boolean, Number ],
      default: true
    },
    noDataText: {
      type: String,
      default: '没有更多数据了'
    },
    loadingText: {
      type: String,
      default: '数据加载中...'
    },
    showOverflowTooltip: {
      type: Boolean,
      default: true
    }
  },

  computed: {
    pageAttrs () {
      return Object.assign({
        prevText: '上一页',
        nextText: '下一页',
        pageSizes: [ 5, 10, 25, 50 ]
      }, this.pageOptions)
    },
    tableHeight () {
      if (this.limitTableHeight) return Math.max(this.innerHeight - this.height, 360)
      return undefined
    },
    _emptyValue () {
      const values = [ undefined, null ]
      if (Array.isArray(this.emptyValue)) {
        return values.concat(this.emptyValue)
      }
      return values.concat([ this.emptyValue ])
    },
    computedColumns () {
      return utils.computedColumns(this.columns, this)
    },
    tableColumns () {
      const columns = this.computedColumns
      const checked = utils.getAllColumnsId(this.checked)
      if (this.filterable) return utils.filterColumns(columns, checked)
      return columns
    },
    selectionEnable () {
      return this.computedColumns.some(item => item.type === 'selection')
    },
    padRowNumber () {
      const size = this.size
      const len = this.data.length
      const n = typeof this.fitRow === 'number' ? (this.fitRow - len) : (this.fitRow ? (size - len) : 0)
      return Math.max(0, n)
    },
    tableData () {
      if (this.loading) return []
      return this.data
    },
    computedDefaultChecked () {
      const columns = this.computedColumns
      if (!this.filterable) return []
      if (this.checkedAll) return utils.getAllColumnsId(columns)
      const hasChecked = columns.some(item => item.checked)
      return columns.reduce((arr, item) => {
        // 有checked的情况下，默认只显示有checked=true的项
        if (hasChecked) {
          item.checked && arr.push(item)
        } else {
          // 显示checked为undefined的项
          if (item.checked === undefined) {
            arr.push(item)
          }
        }
        return arr
      }, [])
    }
  },

  mounted () {
    this.limitTableHeight && this.setTableMaxHeight()
    window.addEventListener('resize', this.resize)
  },

  beforeDestroy () {
    window.removeEventListener('resize', this.resize)
  },

  watch: {
    selectionRows: {
      handler (value) {
        if (this.selectionEnable && value) {
          const { table } = this.$refs
          const key = this.selectionKey
          if (table) {
            for (const item of this.data) {
              const checked = key
                ? value.some(v => item[ key ] === v)
                : value.includes(item)
              table.toggleRowSelection(item, checked)
            }
          }
        }
      },
      immediate: true
    },
    computedDefaultChecked: {
      handler (value) {
        this.checked = value
      },
      immediate: true
    }
  },

  data () {
    return {
      innerHeight: window.innerHeight,
      height: 0, // 初始高度
      checked: [] // 已选择的列
    }
  },

  methods: {
    resize () {
      this.innerHeight = window.innerHeight
    },
    handleChange (type, value) {
      this.$emit(`update:${type}`, value)
      this.$nextTick(() => {
        this.$emit('change', this.page, this.size)
      })
      if (type === 'size') {
        this.setTableMaxHeight()
      }
    },
    setTableMaxHeight () {
      const { table, page } = this.$refs
      const { top = 0 } = table ? table.$el.getBoundingClientRect() : {}
      const { height = 0 } = page ? page.$el.getBoundingClientRect() : {}
      this.height = top + height + this.offset
    },
    selectionChange (e) {
      if (this.selectionEnable) {
        const rows = this.selectionKey ? e.map(item => item[ this.selectionKey ]) : e
        this.$emit('update:selection-rows', rows)
      }
    },
    clearSelection () {
      this.$refs.table.clearSelection()
    }
  }
}
</script>

<style lang="scss">
  .base-table {
    position: relative;
    background-color: #fff;
    &__inner {
      color: $--color-text-regular;
    }
    &.border-hide {
      .el-table {
        td,
        th {
          border: 0 none;
        }
        &:before {
          display: none;
        }
      }
    }
    .fit-row {
      .data-empty {
        height: 360px;
        line-height: 360px;
      }
      .pad-empty {
        height: 40px;
        line-height: 40px;
        color: #999;
        text-align: center;
      }
    }
  }

  .base-table--loading {
    .el-table__body-wrapper {
      overflow: hidden!important;
    }
    .base-table__loading {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      text-align: center;
      line-height: 1.5em;
      z-index: 999;
      font-size: 14px;
    }
  }

  .base-table__wrapper {
    position: relative;
  }

  .base-table__header {
    display: flex;
    margin-bottom: 10px;
    justify-content: flex-end;
    align-items: center;
  }
  .base-table__filter {
    float: right;
    margin-left: 10px;
  }
</style>
