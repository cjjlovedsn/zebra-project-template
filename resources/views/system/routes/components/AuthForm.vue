<template>
  <el-form
    :model="params"
    ref="form"
    label-width="60px"
  >
    <el-form-item
      label="名称"
      prop="name"
    >
      <el-input v-model="params.name" />
    </el-form-item>
    <el-form-item
      label="路径"
      prop="path"
      required
    >
      <el-autocomplete
        v-model="params.path"
        :fetch-suggestions="querySearch"
      />
    </el-form-item>
    <el-form-item
      label="是否菜单显示"
      prop="is_menu"
      label-width="100px"
    >
      <el-switch
        v-model="params.is_menu"
        active-color="#13ce66"
        inactive-color="#edf2fc"
      ></el-switch>
    </el-form-item>
    <el-form-item
      v-if="params.is_menu"
      prop="icon"
      label="图标"
    >
      <el-input v-model="params.icon" />
    </el-form-item>
  </el-form>
</template>

<script>
const props = [ 'path', 'name', 'is_menu', 'icon', 'parent' ]
export default {
  name: 'AuthForm',

  props,

  computed: {
    suggestions () {
      const value = this.parent?.path ?? ''
      return value ? [ { value } ] : []
    }
  },

  created () {
    props.forEach(key => {
      if (key === 'parent') return
      this.$watch(key, value => (this.params[ key ] = value), {
        immediate: true
      })
    })
  },

  data () {
    return {
      params: {
        path: '',
        name: '',
        is_menu: false,
        icon: ''
      }
    }
  },

  methods: {
    querySearch (queryString, cb) {
      const restaurants = this.suggestions
      const results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter (queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    submit (callback) {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (callback) return callback(this.params)
          this.$emit('submit', this.params)
        }
      })
    }
  }
}
</script>
