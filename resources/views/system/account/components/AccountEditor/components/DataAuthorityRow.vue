<template>
  <el-row :gutter="24">
    <el-col :span="10">
      <el-form-item
        label="数据权限备注-级别:"
      >
        <base-select
          v-model="level"
          placeholder="数据权限备注:级别"
          :options="levels"
          :loading="$loadings.hierarchical"
        />
      </el-form-item>
    </el-col>
    <el-col :span="10">
      <el-form-item
        label="数据权限:"
      >
        <base-select
          :value="value"
          :options="options"
          :loading="$loadings.hierarchical"
          multiple
          filterable
          collapse-tags
          placeholder="数据权限"
          @input="$emit('input', $event)"
        />
      </el-form-item>
    </el-col>
    <el-col :span="4">
      <el-button
        type="primary"
        icon="el-icon-plus"
        circle
        @click="$emit('append')"
      ></el-button>
      <el-button
        type="danger"
        icon="el-icon-minus"
        circle
        @click="$emit('remove')"
      ></el-button>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'DataAuthorityRow',

  props: {
    value: Array,
    levels: {
      type: Array,
      default: () => []
    },
    data: {
      type: Object,
      default: () => ({})
    }
  },

  computed: {
    options () {
      return this.data[this.level] || []
    }
  },

  watch: {
    value: {
      handler (value) {
        if (value) {
          const id = value[0]
          for (const key in this.data) {
            const item = this.data[key]
            if (item.some(item => item.value === id)) {
              this.level = ~~key
              break
            }
          }
        }
      },
      immediate: true,
      deep: true
    }
  },

  data () {
    return {
      level: ''
    }
  }
}
</script>

<style lang="scss" scoped></style>
