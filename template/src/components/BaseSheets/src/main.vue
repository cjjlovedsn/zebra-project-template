<template>
  <div class="base-sheets">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'BaseSheets'
}
</script>

<style lang="scss" scoped>
  .base-sheets {
    display: flex;
    align-items: center;
  }
</style>
