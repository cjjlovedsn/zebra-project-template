<template>
  <div class="permissions">
    <el-tabs type="card">
      <el-tab-pane
        v-for="{ title, data, business_id } in treeData"
        :key="business_id"
        :label="title"
      >
        <el-tree
          :data="data"
          :props="treeProps"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
          draggable
          @node-drop="handleDrop"
        >
          <span class="permissions__tree-item" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span class="permissions__tree-actions" :class="{ 'is-root': data.name === 'root' }">
              <el-button
                v-if="data.name !== 'root'"
                type="text"
                class="text-success"
                size="mini"
                @click="() => edit(node, data)"
              >
                <i class="el-icon-edit" />
              </el-button>
              <el-button
                type="text"
                class="text-success"
                size="mini"
                @click="() => append(data)"
              >
                <i class="el-icon-plus" />
              </el-button>
              <el-button
                v-if="data.name !== 'root'"
                type="text"
                size="mini"
                class="text-default"
                @click="() => remove(node, data)"
              >
                <i class="el-icon-delete" />
              </el-button>
            </span>
          </span>
        </el-tree>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import * as utils from '@/utils'
import AuthForm from './components/AuthForm'
import permissions, { combine } from '../service'
export default {
  name: 'PermissionList',

  created () {
    this.loadBusiness()
  },

  data () {
    return {
      id: 0,
      treeData: [],
      treeProps: {
        label: data => data.name || data.path
      }
    }
  },

  methods: {
    loadBusiness () {
      Promise.resolve([]).then(data => {
        const list = data.map(({ label, value: business_id }) => ({
          title: `${label}接口权限配置`,
          business_id,
          data: [
            {
              id: 0,
              name: 'root',
              client: 1,
              business_id,
              children: []
            }
          ]
        }))
        this.treeData = list.concat([
          {
            title: '后台接口权限配置',
            business_id: 0,
            data: [
              {
                id: 0,
                name: 'root',
                client: 2,
                children: []
              }
            ]
          }
        ])
        this.fetchData()
      })
    },
    fetchData () {
      return permissions().then(res => {
        const data = utils.responseFormat.string2number(res, ['id', 'parent_id', 'client', 'level', 'order', 'type', 'data_model_id', 'operate_type_id'], true).filter(item => item.type === 2)
        this.id = data.reduce((value, item) => (item.id > value ? ~~item.id : value), 0)
        this.setTreeData(data)
      })
    },
    setTreeData (permissions) {
      const data = utils.setTreeByField(permissions, 'business_id')
      this.treeData = this.treeData.map(item => {
        item.data[0].children = data[item.business_id]
        return item
      })
    },
    append (data) {
      const {
        id: parent_id,
        children,
        order = 0,
        client,
        level = 0,
        business_id
      } = data || {}
      const newChild = {
        id: ++this.id,
        parent_id,
        order: order + (children?.length ?? 0) + 1,
        client,
        level: level + 1,
        operateType: 'create',
        business_id
      }

      this.$msgbox({
        title: '权限配置创建',
        message: <AuthForm ref="form" parent={data} key={newChild.id} />,
        confirmButtonText: '创建',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            this.$refs.form.submit(res => {
              const result = Object.assign(newChild, res)
              if (!data.children) {
                this.$set(data, 'children', [])
              }
              this.submit([result]).then(() => {
                this.fetchData()
              })
              done()
            })
          } else {
            done()
          }
        }
      }).then(null, () => {})
    },
    remove (node, data) {
      this.update(node, data, null, 'delete')
    },
    update (node, data, newData, operateType) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      const params = Object.assign({ operateType }, children[index], newData)
      delete params.parents
      this.submit([params]).then(() => {
        if (newData) {
          children.splice(index, 1, newData)
        } else {
          children.splice(index, 1)
        }
      })
    },
    edit (node, data) {
      this.$msgbox({
        title: '权限配置编辑',
        message: <AuthForm {...{ attrs: data }} parent-={node.parent} ref="form" key={data.id} />,
        confirmButtonText: '保存',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            this.$refs.form.submit(res => {
              const result = Object.assign({}, data, res)
              this.update(node, data, result, 'update')
              done()
            })
          } else {
            done()
          }
        }
      }).then(null, () => {})
    },
    flatTreeData (data) {
      return data.reduce((result, { children = [], ...item }) => {
        return result.concat(item, this.flatTreeData(children))
      }, [])
    },
    submit (data) {
      const d = data || utils.flat(this.treeData.map(item => item.data))
      const list = this.flatTreeData(d).filter(item => item.operateType && item.name !== 'root')
      return combine(list.map(item => ({ ...item, type: 2 })))
    },
    updateDragData (parent) {
      const { children = [], order = 0, id: parent_id, level = 0 } = parent?.data ?? {}
      const result = children.map((item, index) => Object.assign(item, {
        order: order + index + 1,
        parent_id,
        level: level + 1,
        operateType: 'update'
      }))
      this.submit(result).then(() => {
        // eslint-disable-next-line no-unused-expressions
        parent?.data?.children?.splice(0, Infinity, ...result)
      })
    },
    handleDrop (draggingNode, dropNode, dropType) {
      switch (dropType) {
        case 'before':
        case 'after':
          this.updateDragData(dropNode.parent)
          break
        case 'inner':
          this.updateDragData(dropNode)
          break
        default:
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.permissions {
  padding: 20px;
  background-color: #fff;
  @include clearfix;
  &::v-deep {
    .el-tree-node {
      &.is-current
        > .el-tree-node__content
        > .permissions__tree-item
        > .permissions__tree-actions {
        transform: translateY(0);
        opacity: 1;
      }
    }
    .el-tree-node__content {
      height: auto;
    }
  }
  .permissions__tree-item:hover > .permissions__tree-actions,
  .permissions__tree-item > .is-root {
    transform: translateY(0);
    opacity: 1;
  }
}

.permissions__inner {
  margin: 20px 0;
  padding: 20px 10px;
  border: 1px solid $--border-color-base;
  border-radius: 6px;
}

.permissions__tree-item {
  display: inline-block;
  width: 100%;
  height: 36px;
  line-height: 36px;
  overflow: hidden;
}

.permissions__tree-actions {
  float: right;
  margin-right: 10px;
  opacity: 0;
  transform: translateY(100%);
  transition: all 0.2s;
}
</style>
