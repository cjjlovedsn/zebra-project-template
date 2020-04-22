<template>
  <div class="audi-menu">
    <el-scrollbar>
      <header class="audi-menu__header">
        <a :href="link" class="logo">
          <img src="~@/assets/images/logo.png" alt="">
        </a>
      </header>
      <SideMenu :children="routes" :permissions="permissions"/>
    </el-scrollbar>
  </div>
</template>

<script>
import SideMenu from './components/SideMenu'
export default {
  name: 'Menu',

  components: {
    SideMenu
  },

  props: {
    routes: {
      type: Array,
      required: true
    },
    permissions: Array,
    link: String
  }
}
</script>

<style lang="scss" scoped>
.audi-menu {
  width: 180px;
  background-color: #162140;
  .audi-menu__header {
    padding: 18px 0;
    text-align: center;
  }
}
</style>
