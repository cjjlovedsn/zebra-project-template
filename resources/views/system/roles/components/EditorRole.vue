<template>
  <el-dialog
    :visible.sync="visible"
    :title="title"
    append-to-body
    width="80%"
    class="role-editor__dialog"
  >
    <el-form
      :model="params"
      label-width="130px"
      hide-required-asterisk
      ref="form"
    >
      <el-form-item
        label="角色名"
        prop="name"
        required
      >
        <span
          slot="error"
          class="error-message text-danger"
        >请输入角色名</span>
        <el-input v-model="params.name" />
      </el-form-item>
      <el-form-item
        label="描述"
        prop="description"
        required
      >
        <span
          slot="error"
          class="error-message text-danger"
        >请输入描述</span>
        <el-input v-model="params.description" />
      </el-form-item>
      <el-form-item
        label="角色级别"
        prop="level"
        required
      >
        <span
          slot="error"
          class="error-message text-danger"
        >请选择角色级别</span>
        <el-radio-group v-model="params.level">
          <el-radio
            v-for="{ label, value } in levels"
            :key="value"
            :label="value"
          >{{ label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="业务类型"
        prop="business_id"
        required
      >
        <span
          slot="error"
          class="error-message text-danger"
        >请选择业务类型</span>
        <el-radio-group v-model="params.business_id">
          <el-radio
            v-for="{ label, value } in business"
            :key="value"
            :label="value"
          >{{ label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="权限选择"
        prop="permission_arr"
      ></el-form-item>
      <div>
        <PermissionTree
          :default-nodes="nodes"
          :tree-data="treeData"
          ref="tree"
        />
      </div>
    </el-form>
    <div slot="footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button
        type="primary"
        :loading="loading"
        @click="saveHandle"
      >保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import PermissionTree from './PermissionTree'
export default {
  name: 'RoleEditor',

  components: {
    PermissionTree
  },

  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      title: '',
      visible: false,
      params: {
        name: '',
        description: '',
        business_id: '',
        level: ''
      },
      nodes: [],
      levels: [ '管理员', '全国', '大区', '小区', '经销商', '服务顾问' ].map((label, i) => ({ label, value: String(i + 1) })),
      isEdit: false,
      treeData: [],
      submit: () => { },
      business: []
    }
  },

  methods: {
    init ({ nodes = [], data, treeData, title, isEdit, business = [] }, callback) {
      this.nodes = nodes
      this.isEdit = !!isEdit
      this.business = business
      this.params = Object.assign({
        name: '',
        description: '',
        business_id: '',
        level: ''
      }, data)
      this.title = title
      this.treeData = treeData
      this.visible = true
      this.submit = callback
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    saveHandle () {
      this.$refs.form.validate(valid => {
        if (valid) {
          const permission = this.$refs.tree.getCheckedKeys()
          this.submit({ ...this.params, permission }, this.isEdit, () => (this.visible = false))
        }
      })
    }
  }
}
</script>

<style lang="scss">
  .role-editor__dialog {
    .el-dialog__footer {
      position: sticky;
      bottom: -20px;
    }
  }
</style>
