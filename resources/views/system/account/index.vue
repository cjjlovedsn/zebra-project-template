<template>
  <div>
    <base-title title="查询条件" />
    <base-search
      :model.sync="params"
      inline
      class="px-5"
      cache
      @search="fetchData"
    >
      <base-input
        v-model="params.account_name"
        prop="account_name"
        placeholder="账户名"
        clearable
      />
      <base-input
        v-model="params.nick_name"
        prop="nick_name"
        placeholder="姓名"
        clearable
      />
      <base-select
        v-model="params.role"
        prop="role"
        placeholder="角色"
        clearable
        :data="1"
        :options="[]"
      />
      <base-input
        v-model="params.data_permission"
        prop="data_permission"
        placeholder="数据权限"
        clearable
      />
      <base-select
        v-model="params.status"
        prop="status"
        placeholder="状态"
        clearable
        :options="select.status"
      />
    </base-search>
    <base-title title="查询结果-账号一览" class="mb-3">
      <account-editor
        title="账号一览-新增帐号"
        class="mx-2"
        is-new
        @save="addAccount"
      >
        <el-button
          slot-scope="scope"
          type="success"
          @click="showDetail(null, scope.open)"
        >新增</el-button>
      </account-editor>
      <base-dialog-upload
        v-model="file"
        :model="$data"
        show-file-name
        accept="excel"
        :submit="importAccount"
        :loading="$loadings.importfile"
        title="批量导入账号"
        class="mr-2"
      >
        <base-link slot="append" href="/">下载导入账号模板</base-link>
        <el-button type="success" slot-scope="scope" @click="scope.openDialog"><i class="el-icon-upload2"/>导入账号</el-button>
      </base-dialog-upload>
      <base-link href="/" :query="params">导出列表</base-link>
    </base-title>
    <base-table
      :data="list"
      :total="total"
      :columns="columns"
      :loading="$loadings.list"
      :page.sync="params.page"
      :size.sync="params.size"
      highlight-current-row
      class="px-5"
      @change="fetchData"
    >
      <template v-slot:status="{ row, value }">
        <el-button
          type="text"
          :class="row.status === '1' ? 'text-success' : 'text-danger'"
          @click="changeState(row, row.status === '1')"
        >{{ value }}</el-button>
      </template>
      <template v-slot:operate="{ row }">
        <account-editor
          title="账号一览-编辑帐号"
          @save="editAccount"
        >
          <el-button
            slot-scope="scope"
            type="text"
            @click="showDetail(row.id, scope.open)"
          >详情</el-button>
        </account-editor>
      </template>
    </base-table>
  </div>
</template>

<script>
import AccountEditor from './components/AccountEditor'
import columns from './components/columns'
import account, { update, getUser, importFile, changeState } from './service'
export default {
  name: 'AccountList',

  components: {
    AccountEditor
  },

  data () {
    return {
      list: [],
      total: 0,
      columns,
      params: {
        page: 1,
        size: 10,
        account_name: '',
        nick_name: '',
        role: '',
        data_permission: '',
        status: ''
      },
      roles: [],
      file: '',
      select: {
        status: [
          {
            label: '启用',
            value: '1'
          },
          {
            label: '停用',
            value: '2'
          }
        ]
      }
    }
  },

  methods: {
    fetchData () {
      account(this.params).then(data => {
        this.list = data.list || []
        this.total = data.total || 0
      })
    },
    addAccount (data, done) {
      update(data).then(message => {
        this.$message.success(message)
        done()
        this.fetchData()
      })
    },
    showDetail (id, open) {
      if (!id) return open({ roles: [], datas: [] })
      getUser(id).then(({ roles, ...data }) => {
        roles = roles.map(item => item.id)
        open({ ...data, roles })
      })
    },
    editAccount (data, done) {
      update(data, true).then(message => {
        this.$message.success(message)
        done()
        this.fetchData()
      })
    },
    importAccount (file, done) {
      if (!file) return
      const data = new FormData()
      data.append('file', file)
      importFile(data)
    },
    changeState (row, stoped) {
      this.$confirm(`是否${stoped ? '停用' : '启用'}账号【${row.account_name}】`, { type: 'warning' }).then(() => {
        changeState(row.id, stoped).then(message => {
          this.$message.success(message)
          this.fetchData()
        })
      }, () => {})
    }
  }
}
</script>

<style lang="scss" scoped></style>
