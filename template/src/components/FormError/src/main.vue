<template>
  <div class="form-error ignore-error">
    <transition name="el-fade-in">
      <span
        v-show="!disabled && (error || visible)"
        class="form-error__message text-danger"
        :style="styles"
        @click="handleClick"
      >
        <span class="form-error__inner">{{ _message }}</span>
      </span>
    </transition>
    <slot />
  </div>
</template>

<script>
const isTarget = (target, key) => {
  return key
    ? (target ? !!target.$refs[ key ] : false)
    : (target ? typeof target.focus === 'function' : false)
}
export default {
  name: 'FormError',

  props: {
    message: String,
    errorRef: String,
    offset: {
      type: Array,
      validator: value => value.every(i => typeof i === 'number'),
      default: () => [ 5, 1 ]
    },
    error: Boolean,
    disabled: Boolean
  },

  computed: {
    parent () {
      let parent = this.$parent
      while (parent && parent.$options.componentName !== 'ElFormItem') {
        parent = parent.$parent
      }
      return parent || {}
    },
    visible () {
      const { parent, target } = this
      return parent.validateState === 'error' && target && (target.readonly || !target.focused)
    },
    _message () {
      return this.message || this.parent.validateMessage
    },
    styles () {
      if (this.target) {
        const { offsetTop: top, offsetLeft: left } = this.target.$el
        const width = this.target.$refs?.input?.offsetWidth
        const [ x, y ] = this.offset
        return {
          top: top + y + 'px',
          left: left + x + 'px',
          width: width ? width + 'px' : ''
        }
      }
      return {}
    }
  },

  mounted () {
    this.target = this.getTargetInput(this.$slots.default)
  },

  updated () {
    this.slots = this.getTargetInput(this.$slots.default)
  },

  data () {
    return {
      target: null
    }
  },

  methods: {
    handleClick () {
      if (this.target && typeof this.target.focus === 'function') {
        this.target.focus()
      }
      this.$emit('click')
    },
    getTargetInput (target) {
      if (Array.isArray(target)) {
        for (const { child, $children: children, data } of target) {
          let result
          if (child) {
            if (data && data.ref === this.errorRef) return child
            if (isTarget(child, this.errorRef)) return (this.errorRef ? child.$refs[ this.errorRef ] : child)
            result = this.getTargetInput(child.$children)
          }
          if (children) {
            if (isTarget(children, this.errorRef)) return (this.errorRef ? children.$refs[ this.errorRef ] : children)
            result = this.getTargetInput(children.$children)
          }
          if (result) return result
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .form-error {
    position: relative;
    &::v-deep + .el-form-item__error {
      display: none!important;
    }
    &::v-deep {
      .el-input__inner,
      .el-textarea__inner {
        border-color: $--border-color-base!important;
      }
      .el-input__inner:focus,
      .el-textarea__inner:focus {
        border-color: $--input-focus-border!important;
      }
    }
  }
  .form-error__message {
    position: absolute;
    padding: 1px;
    z-index: 1;
    left: 5px;
    width: 100%;
  }
  .form-error__inner {
    background-color: #fff;
  }
</style>
