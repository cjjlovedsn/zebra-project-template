<template>
  <div>
    <el-tabs type="card">
      <el-tab-pane
        v-for="{ key, label, data } in treeData"
        :key="key"
        :label="label"
      >
        <el-tree
          :data="data"
          show-checkbox
          node-key="id"
          default-expand-all
          :props="defaultProps"
          ref="tree"
        >
          <template v-slot="{ node, data }">
            <span :title="data.description">{{ node.label }}</span>
          </template>
        </el-tree>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { flat } from '@/utils'
export default {
  name: 'PermissionTree',

  props: {
    defaultNodes: {
      type: Array,
      default () {
        return []
      }
    },
    treeData: {
      type: Array,
      default: () => []
    }
  },

  watch: {
    defaultNodes: {
      handler (value) {
        this.$nextTick(() => {
          const { tree = [] } = this.$refs
          tree.forEach(t => t.setCheckedNodes(value))
        })
      },
      immediate: true
    }
  },

  data () {
    return {
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },

  methods: {
    clear () {
      this.$refs.tree.forEach(t => t.setCheckedKeys([]))
    },
    getCheckedKeys () {
      const { tree = [] } = this.$refs
      const result = tree.map(t => t.getCheckedKeys().concat(t.getHalfCheckedKeys()))
      return flat(result, Infinity)
    }
  }
}
</script>
