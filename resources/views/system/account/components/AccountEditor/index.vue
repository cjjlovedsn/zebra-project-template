<template>
  <span>
    <slot :open="openDialog">
      <el-button @click="openDialog">{{ buttonText }}</el-button>
    </slot>
    <el-dialog
      :visible.sync="visible"
      :title="title"
      center
      append-to-body
      :width="width"
      :before-close="reset"
    >
      <AccountForm
        :value="value"
        :levels="levels"
        :data="datas"
        :data-auth="dataAuth"
        :isNew="isNew"
        :roles="roles"
        ref="account"
      />
      <div class="bdt1 pt20">
        <slot
          name="append"
          :value="value"
        />
      </div>
      <div slot="footer">
        <el-button type="primary" @click="saveHandle">确&nbsp;&nbsp;定</el-button>
        <el-button type="default" @click="visible = false">取&nbsp;&nbsp;消</el-button>
      </div>
    </el-dialog>
  </span>
</template>

<script>
import AccountForm from './components/AccountForm'
export default {
  name: 'AccountEditor',

  components: {
    AccountForm
  },

  props: {
    buttonText: {
      type: String,
      default: '新增帐号'
    },
    title: {
      type: String,
      default: '新增帐号'
    },
    width: {
      type: [ Number, String ],
      default: '80%'
    },
    isNew: Boolean
  },

  data () {
    return {
      visible: false,
      levels: [],
      datas: {},
      roles: [],
      value: {},
      dataAuth: []
    }
  },

  methods: {
    reset (done) {
      this.$refs.account.reset()
      done && done()
    },
    saveHandle () {
      const { account } = this.$refs
      account && account.submit(data => {
        this.$emit('save', data, () => {
          account.reset()
          this.visible = false
        })
      })
    },
    openDialog ({ datas: dataAuth, ...value }) {
      this.dataAuth = dataAuth
      this.value = value
      this.$api.common.getRoleList().then(roles => {
        this.roles = roles
        return this.$api.common.getLevelAndData()
      }).then(data => {
        this.levels = data.level
        this.datas = data.list
        this.visible = true
      })
    }
  }
}
</script>

<style lang="stylus" scoped></style>
