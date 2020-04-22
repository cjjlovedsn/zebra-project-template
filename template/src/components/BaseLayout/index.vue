<template>
  <div class="layout">
    <Menu
      :routes="routes"
      :permissions="permissions"
      :link="link"
      class="layout__menu"
    />
    <main class="layout__container">
      <TopNav>
        <slot name="nav" />
        <span slot="menu">
          <slot name="menu" />
        </span>
      </TopNav>
      <main class="layout__view">
        <router-view />
      </main>
    </main>
  </div>
</template>

<script>
import TopNav from './component/TopNav'
import Menu from './component/Menu'
export default {
  name: 'BaseLayout',

  props: {
    routes: {
      type: Array,
      required: true
    },
    permissions: {
      type: Array,
      required: true
    },
    link: {
      type: String,
      default: '/'
    }
  },

  components: {
    TopNav,
    Menu
  }
}
</script>

<style lang="scss" scoped>
  .layout {
    display: flex;
    height: 100%;
    min-height: 700px;
  }

  .layout__menu {
    flex-shrink: 0;
  }

  .layout__container {
    display: flex;
    flex-direction: column;
    padding: 0 20px;
    flex: 1;
    width: 0;
  }

  .layout__view {
    padding: 20px 0;
    background-color: #fff;
  }
</style>
