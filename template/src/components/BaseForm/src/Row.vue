<template>
  <tr
    v-bind="$attrs"
    class="base-form-row"
  >
    <slot />
  </tr>
</template>

<script>
export default {
  name: 'BaseFormRow'
}
</script>

<style lang="scss" scoped></style>
