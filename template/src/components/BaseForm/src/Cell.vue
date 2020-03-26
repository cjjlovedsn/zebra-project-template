<template>
  <td
    v-bind="$attrs"
    :class="name"
  >
    <span class="base-form-cell">
      <slot name="label">
        <span class="base-form-cell__label">{{ label }}</span>
      </slot>
      <slot>{{value}}</slot>
    </span>
  </td>
</template>

<script>
export default {
  name: 'BaseFormCell',

  inject: ['form'],

  props: {
    label: String,
    prop: String,
    width: [ String, Number ]
  },

  computed: {
    value () {
      return this.form.data[this.prop]
    }
  },

  created () {
    if (this.width) {
      const name = `base-form_${this.form._uid}_cell_${this._uid}`
      this.name = name
      this.form.$emit('add-cell', name, this.width)
    }
  },

  destroyed () {
    this.from.$emit('remove-cell', this.name)
  },

  data () {
    return {
      name: ''
    }
  }
}
</script>

<style lang="scss" scoped></style>
