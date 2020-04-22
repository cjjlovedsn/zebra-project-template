<template>
  <ul :class="['menuList', { root }]">
    <template v-for="({ name, path, icon, children, is_menu }, index) in routes">
      <li
        v-if="is_menu"
        :class="['menu-item', `level-${level}`, { active: path === parentPath || path === $route.fullPath || path === $route.meta.active }]"
        :key="index"
      >
        <router-link
          tag="div"
          :to="{ path }"
          class="menu-item__wrap"
          :class="{ 'is-parent': level === 0 && children.length > 0 }"
        >
          <i
            v-if="icon"
            :class="['menu-icon',icon]"
          ></i>
          <div class="menu-name">{{name}}</div>
        </router-link>
        <SideMenu
          :children="children"
          :root="false"
          :permissions="permissions"
          :level="level + 1"
        />
      </li>
    </template>
  </ul>
</template>
<script>
export default {
  name: 'SideMenu',

  props: {
    children: {
      type: Array,
      default () {
        return []
      }
    },
    root: {
      type: Boolean,
      default: true
    },
    permissions: {
      type: Array,
      default: () => []
    },
    level: {
      type: Number,
      default: 0
    }
  },

  computed: {
    routes () {
      const children = [ ...this.children ]
      return children.sort((a, b) => a.order - b.order)
    },
    parentPath () {
      const { path } = this.$route
      const { parent_id } = this.permissions.find(item => item.path === path) || {}
      if (parent_id) {
        const parent = this.permissions.find(item => item.id === parent_id) || {}
        return parent.path
      }
      return ''
    }
  }
}
</script>

<style lang="scss" scoped>
  $menu-height: 40px;
  $menu-font-size: 14px;
  .menuList {
    font-size: 13px;
    &.root > .menu-item > .menu-item__wrap > .menu-name {
      font-size: $menu-font-size;
    }
    .menu-item {
      line-height: $menu-height;
      text-align: left;
      color: $--color-menu-default;
      font-weight: bold;
      cursor: pointer;
      &.level-1 {
        line-height: 29px;
        font-weight: normal;
      }
      &.active {
        color: #fff;
      }
    }
    .menu-item__wrap {
      padding: 0 18px;
      @include clearfix;
      &:hover {
        color: #fff;
      }
      &.is-active:not(.is-parent) {
        color: #fff;
        background-color: $--color-menu-active;
      }
    }
    .menu-icon {
      float: left;
      width: $menu-font-size * 1.5;
      line-height: $menu-height;
      font-size: 19px;
    }
    .menu-name {
      margin-left: $menu-font-size * (12 / 14 + 1.5);
    }
  }
</style>
