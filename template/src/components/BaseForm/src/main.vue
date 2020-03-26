<template>
  <div class="base-form">
    <table
      class="base-form__body"
      :width="width"
      border="1"
      cellspacing="0"
      cellpadding="0"
    >
      <colgroup>
        <col
          v-for="([name, width], index) in groups"
          :key="index"
          :name="name"
          :width="width"
        />
      </colgroup>
      <thead>
        <slot name="header" />
      </thead>
      <tbody>
        <slot />
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'BaseForm',

  props: {
    data: Object,
    width: [ Number, String ]
  },

  provide () {
    return {
      form: this
    }
  },

  created () {
    this.$on('add-cell', (name, width) => this.groups.push([ name, width ]))
    this.$on('remove-cell', name => (this.groups = this.groups.filter(item => item[0] !== name)))
  },

  data () {
    return {
      groups: []
    }
  }
}
</script>

<style lang="scss" scoped></style>
