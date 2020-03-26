<template>
  <div class="base-card">
    <div class="base-card__header">
      <!-- @slot 标题栏 -->
      <slot name="title"></slot>
      <spacer></spacer>
      <!-- @slot 工具栏 -->
      <slot name="tool">
        <span
          v-if="showClose"
          class="base-card__close-btn el-icon-close"
          @click="close"
        />
      </slot>
    </div>
    <!-- @slot 默认插槽 -->
    <slot />
  </div>
</template>

<script>
export default {
  name: 'BaseCard',

  props: {
    /**
     * 是否显示关闭按钮
    */
    showClose: Boolean
  },

  methods: {
    close (e) {
      /**
       * 点击关闭按钮
       * @event click
       * @type {Event}
       */
      this.$emit('close', e)
    }
  }
}
</script>

<style lang="scss" scoped>
  .base-card__header {
    display: flex;
  }
  .base-card__close-btn {
    cursor: pointer;
    &:hover {
      color: $--color-primary;
    }
  }
</style>
