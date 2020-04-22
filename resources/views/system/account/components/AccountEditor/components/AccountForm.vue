<template>
  <el-form
    :model="params"
    label-width="160px"
    class="account-form"
    ref="form"
  >
    <el-row :gutter="24">
      <el-col :span="12">
        <base-form-item
          label="用户名:"
          prop="account_name"
          required
          message="请填写用户名"
        >
          <el-input
            v-model="params.account_name"
            :disabled="!isNew"
          />
        </base-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item
          label="密码:"
          prop="password"
          :required="isNew"
          message="请填写密码"
        >
          <el-input
            v-model="params.password"
            :type="lookup ? 'text' : 'password'"
          >
            <el-button
              type="text"
              slot="suffix"
              class="mr-2"
              @mousedown.native="lookup = true"
              @mouseup.native="lookup = false"
            >
              <i class="el-icon-view" />
            </el-button>
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="24">
      <el-col :span="12">
        <el-form-item
          label="姓名:"
          prop="nick_name"
        >
          <el-input v-model="params.nick_name" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item
          label="邮箱:"
          prop="email"
          required
          message="请填写邮箱"
        >
          <el-input v-model="params.email" />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="24">
      <el-col :span="12">
        <el-form-item
          label="角色:"
          prop="roles"
        >
          <el-checkbox-group v-model="params.roles">
            <el-checkbox
              v-for="{ label, value } in roles"
              :key="value"
              :label="value"
            >{{ label }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-col>
    </el-row>
    <DataAuthorityConfig
      :value="dataAuth"
      v-bind="$attrs"
      ref="config"
    />
  </el-form>
</template>

<script>
import DataAuthorityConfig from './DataAuthorityConfig'
export default {
  name: 'AccountForm',

  components: {
    DataAuthorityConfig
  },

  props: {
    value: Object,
    dataAuth: Array,
    roles: Array,
    isNew: Boolean
  },

  watch: {
    value: {
      handler (value) {
        this.params = Object.assign(this.params, value)
      },
      immediate: true,
      deep: true
    }
  },

  data () {
    return {
      params: {
        account_name: '',
        password: '',
        nick_name: '',
        email: '',
        roles: []
      },
      lookup: false
    }
  },

  methods: {
    submit (callback) {
      this.$refs.config.submit(data => {
        this.$refs.form.validate(valid => {
          if (valid) {
            const value = { ...this.params, datas: data }
            callback(value)
          }
        })
      })
    },
    reset () {
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
  .account-form {
    /deep/ {
      .el-input,
      .el-select {
        width: 160px;
      }
    }
  }
</style>
