<template>
  <div class="roles">
    <base-title title="角色管理">
      <el-button type="primary" @click="openCreateRoleDialog">创建角色</el-button>
    </base-title>
    <base-table
      :data="list"
      :total="total"
      :columns="columns"
      :page.sync="params.page"
      :size.sync="params.size"
      :loading="$loadings.list"
      highlight-current-row
      class="mt-5 px-5"
      @change="fetchData"
    >
      <template v-slot:operate="{ row }">
        <el-button type="text" @click="openEditRoleDialog(row)">编辑</el-button>
      </template>
    </base-table>
    <RoleEditor
      ref="editor"
    />
  </div>
</template>

<script>
import RoleEditor from './components/EditorRole'
import * as utils from '@/utils'
import roles, { getRole, update } from './service'
import permissions from '../service'
export default {
  name: 'Roles',

  components: {
    RoleEditor
  },

  data () {
    return {
      list: [],
      total: 0,
      params: {
        page: 1,
        size: 10
      },
      columns: [
        {
          label: 'ID',
          prop: 'id'
        },
        {
          label: '角色名',
          prop: 'name'
        },
        {
          label: '描述',
          prop: 'description'
        },
        {
          label: '业务名',
          prop: 'business'
        },
        {
          label: '创建时间',
          prop: 'created_at'
        },
        {
          label: '更新时间',
          prop: 'updated_at'
        },
        {
          label: '操作',
          slotName: 'operate'
        }
      ],
      visible: false
    }
  },

  methods: {
    fetchData () {
      roles(this.params).then(data => {
        this.list = data.list || []
        this.total = data.total || 0
      })
    },
    // 打开创建角色弹框
    openCreateRoleDialog () {
      this.createTabs().then(async treeData => {
        const business = await this.getBusinessType()
        this.$refs.editor.init({ title: '角色新增', treeData, business }, this.saveHandler)
      })
    },
    initValue ({ business_id, description, id, level, name }) {
      return { id, business_id, description, level, name }
    },
    // 打开编辑角色弹框
    openEditRoleDialog (row) {
      this.getEditorInfo(row.id).then(data => {
        this.$refs.editor.init(data, this.saveHandler)
      })
    },
    /**
     * 生成treeData
     * @param {string} label 树节点名
     * @param {string} id 树节点value
     * @param {string} type 对应的类型：1 路由 2接口
     * @param {string} value 权限表
     */
    createTree (label, id, type, value) {
      const temp = value.filter(item => item.type === type)
      const list = utils.setTreeByField(temp, 'business_id')
      return {
        label,
        value: id,
        key: `${id}_${type}`,
        data: list[id]
      }
    },
    getBusinessType () {
      return Promise.resolve([]).then(data => data.concat([
        {
          label: '后台',
          value: '0'
        }
      ]))
    },
    async createTabs () {
      const business = await this.getBusinessType()
      const result = await permissions()
      const temp1 = business.map(({ label, value, type }) => ({ label: `${label}路由`, value, type: 1 }))
      const temp2 = business.map(({ label, value }) => ({ label: `${label}接口`, value, type: 2 }))
      const data = temp1.concat(temp2)
      const permissions = utils.responseFormat.string2number(result, ['id', 'parent_id', 'client', 'level', 'order', 'type'], true)
      return data.map(({ label, value, type }) => this.createTree(label, value, type, permissions))
    },
    getEditorInfo (id) {
      return getRole(id).then(async data => {
        // 获取已设置好的权限id表
        const parentIds = data.perms.map(item => parseInt(item.parent_id))
        // 排除掉父级，防止子级被全选中
        const nodes = data.perms.filter(item => !parentIds.includes(item.id))
        const treeData = await this.createTabs()
        const business = await this.getBusinessType()
        return {
          nodes,
          business,
          data: this.initValue(data),
          treeData,
          title: '角色修改',
          isEdit: true
        }
      })
    },
    saveHandler (params, isEdit, done) {
      update(params, isEdit).then(message => {
        this.$message.success(message)
        this.fetchData()
        done()
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
