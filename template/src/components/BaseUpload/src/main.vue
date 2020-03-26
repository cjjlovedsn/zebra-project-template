<template>
  <div>
    <div class="clearfix">
      <label
        v-if="label"
        class="label"
      >{{ label }}</label>
      <el-input
        v-if="showFileName"
        :value="name"
        class="input"
        type="text"
        clearable
        @clear="handleClear"
      ></el-input>
      <el-button
        size="mini"
        v-bind="$attrs"
        @click="handleClick"
      >
        <slot>
          <span
            class="el-icon-upload2"
          >浏览</span>
        </slot>
        <input
          class="upload-file"
          type="file"
          ref="input"
          :accept="accept"
          :multiple="multiple"
          @change="handleChange"
        />
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseUpload',

  props: {
    showFileName: Boolean,
    multiple: Boolean,
    label: String,
    accept: {
      type: String,
      default: '*'
    },
    value: [String, Array, File]
  },

  watch: {
    value (v) {
      this.name = Array.isArray(v) ? v.map(item => item instanceof File ? item.name : item).join(',') : (v instanceof File) ? v.name : v
      if (!this.name) {
        this.clear()
      }
    }
  },

  data () {
    return {
      name: ''
    }
  },

  methods: {
    clear () {
      this.$refs.input.value = ''
      this.name = ''
      const value = this.multiple ? [] : null
      this.$emit('clear')
      this.$emit('input', value)
      this.$emit('change', value)
    },
    handleClick () {
      this.clear()
      this.$refs.input.click()
    },
    handleClear () {
      this.clear()
    },
    handleChange (event) {
      this.$emit('change', event)
      const files = this.multiple ? [...event.target.files] : event.target.files[0]
      this.name = this.multiple ? files.map(item => item.name).join(' ') : files.name
      this.$emit('input', files)
    }
  }
}
</script>

<style lang="scss" scoped>
  .upload-file {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
    outline: none;
    z-index: -1;
  }
  .label {
    float: left;
  }
  .label + .input {
    margin-left: 40px;
  }
  .input {
    float: left;
    margin-right: 10px;
    width: 180px;
  }
</style>
