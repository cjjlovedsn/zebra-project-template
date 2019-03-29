<template>
  <div
    :class="['base-table', { 'border-hide': borderHide }]"
    @mousemove="debounceMove"
  >
    <div class="base-table__wrapper">
      <el-table
        :data="data"
        :max-height="limitTableHeight ? tableHeight : maxHeight"
        tooltip-effect="light"
        v-loading="loading"
        v-bind="$attrs"
        v-on="$listeners"
        class="base-table__inner"
        ref="table"
        :cell-class-name="borderHide ? 'border-hide' : ''"
        @cell-mouse-enter="handleCellEnter"
        @mouseleave.native="handleTogglePopper(false)"
      >
        <div
          class="data-empty"
          slot="empty"
        >
          <slot name="empty">
            <span>暂无数据</span>
          </slot>
        </div>
        <!-- 默认table-column插槽 -->
        <slot />
        <!-- 遍历columns -->
        <el-table-column
          v-for="item in columns"
          v-bind="Object.assign({ showOverflowTooltip: true }, columnOptions, item)"
          :key="item.prop"
        >
          <template
            slot="header"
            slot-scope="scope"
          >
            <slot
              v-if="item.header && $scopedSlots[item.header]"
              :name="item.header"
              v-bind="scope"
              :row="item"
            />
            <span v-else>{{ item.label }}</span>
          </template>
          <nest-column
            v-if="item.columns"
            :columns="item.columns"
          >
            <v-cell
              slot-scope="scope"
              v-bind="Object.assign({}, scope, item)"
              :empty-text="emptyText"
            />
          </nest-column>
          <v-cell
            v-bind="Object.assign({ popoverOptions }, scope, item)"
            slot-scope="scope"
            :empty-text="emptyText"
          />
        </el-table-column>
      </el-table>
    </div>
    <transition name="el-fade-in">
      <div
        v-if="showTooltip && row"
        v-show="visible"
        class="base-table__tooltip"
        :style="position"
        ref="tooltip"
        @mouseenter="inTooltip = true"
        @mouseleave="inTooltip = false"
      >
        <slot
          name="content"
          :row="row"
        >{{ content }}</slot>
      </div>
    </transition>
    <el-pagination
      v-if="pagination"
      v-bind="pageAttrs"
      style="padding: 12px 14px"
      :current-page="query.page"
      :page-size="query.size"
      :total="total"
      layout="slot, total, sizes, ->, prev, pager, next"
      @size-change="handleChange({ size: $event })"
      @current-change="handleChange({ page: $event })"
      ref="page"
    >
      <!-- 兼容elementUI 2.5.4版本后出现的slot组件不更新的bug -->
      <PageText />
    </el-pagination>
  </div>
</template>

<script>
import debounce from 'throttle-debounce/debounce'
import PageText from './pageText'
import NestColumn from './NestColumn'
import Cell from './Cell'
import { contains } from '@/utils'
export default {
  name: 'BaseTable',

  components: {
    NestColumn,
    'v-cell': Cell,
    PageText
  },

  props: {
    value: {
      type: Object,
      default () {
        return {}
      }
    },
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
      required: true,
      validator (value) {
        return value.every(item => item.prop)
      }
    },
    data: {
      type: Array,
      required: true
    },
    total: {
      type: Number,
      default: 0
    },
    emptyText: {
      type: String,
      default: '-'
    },
    columnOptions: Object,
    pageOptions: Object,
    loading: Boolean,
    limitTableHeight: Boolean,
    maxHeight: [String, Number],
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
    showTooltip: Boolean,
    content: String,
    borderHide: Boolean
  },

  computed: {
    query: {
      get () {
        return Object.assign({
          page: 1,
          size: 5
        }, this.value)
      },
      set (value) {
        this.$emit('input', value)
      }
    },
    pageAttrs () {
      return Object.assign({
        prevText: '上一页',
        nextText: '下一页',
        pageSizes: [5, 10, 25, 50]
      }, this.pageOptions)
    },
    tableHeight () {
      if (this.limitTableHeight) return window.innerHeight - this.height
      return undefined
    }
  },

  beforeCreate () {
    this.debounceClose = debounce(200, () => !this.inTooltip && this.handleClosePopper())
    this.debounceMove = debounce(1000 / 60, (event) => !this.inTooltip && this.handleMove(event))
  },

  mounted () {
    this.limitTableHeight && this.setTableMaxHeight()
  },

  data () {
    return {
      visible: false,
      show: false,
      row: null,
      position: {
        top: 0,
        left: 0
      },
      height: 140, // 初始高度
      inTooltip: false
    }
  },

  methods: {
    handleChange (value) {
      this.query = Object.assign(this.query, value)
    },
    setTableMaxHeight () {
      const { table, page } = this.$refs
      const { top = 0 } = table ? table.$el.getBoundingClientRect() : {}
      const { height = 0 } = page ? page.$el.getBoundingClientRect() : {}
      this.height = top + height
    },
    handleCellEnter (row, column, cell) {
      this.row = row
    },
    handleClosePopper () {
      if (this.show) return
      this.visible = false
    },
    handleTogglePopper (show) {
      this.show = show
      this.debounceClose()
    },
    handleMove (event) {
      const { table, tooltip } = this.$refs
      const body = table && table.$el.querySelector('.el-table__body')
      if (body && tooltip) {
        const offset = 15
        const bodyRect = body.getBoundingClientRect()
        const { width, height } = tooltip.getBoundingClientRect()
        let top = event.clientY
        let left = event.clientX
        let maxX = bodyRect.width - width
        let maxY = bodyRect.height - height
        // 偏右
        if (left > maxX) {
          left -= width + offset
        } else {
          left += offset
        }
        // 偏下
        if (top > maxY) {
          top -= height + offset
        } else {
          top += offset
        }
        this.position = {
          top: top + 'px',
          left: left + 'px'
        }
        this.visible = this.row && contains(event.target, body, true)
      }
    }
  }
}
</script>

<style lang="scss">
$pager-item-size: 32px;
.base-table {
  position: relative;
  &__inner {
    border-radius: 4px;
    color: $--color-text-regular;
  }
  .el-pagination {
    color: $--color-text-secondary;
    .btn-prev,
    .btn-next {
      &:not(:disabled) {
        color: $--color-text-secondary;
      }
    }
    .el-pager,
    .number {
      margin: 0 4px;
      padding: 0;
      min-width: $pager-item-size;
      height: $pager-item-size;
      line-height: $pager-item-size;
      border: 1px solid $--border-color-base;
      border-radius: 4px;
      font-size: 13px;
      font-weight: normal;
      &.active {
        background-color: $--color-primary;
        color: $--color-white;
      }
    }
  }
  &__tooltip {
    position: fixed;
    z-index: 2000;
    transition: all 0.2s linear;
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
}
</style>
