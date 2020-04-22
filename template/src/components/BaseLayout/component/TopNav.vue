<template>
  <div class="top-nav">
    <div class="top-nav__content">
      <slot></slot>
    </div>
    <div class="top-nav__menu"></div>
    <slot name="menu"/>
  </div>
</template>

<script>
export default {
  name: 'TopNav'
}
</script>

<style lang="scss">
$top-nav-height: 68px;
.top-nav {
    position: relative;
    display: flex;
    width: 100%;
    height: $top-nav-height;
    line-height: $top-nav-height;
    background-color: #ecf0f5;
    color: #43555e;
    font-size: 20px;
    &__content {
      flex: 1 1 auto;
    }
    &__menu {
      font-weight: normal;
      margin-right: 20px;
      line-height: 68px;
      @include clearfix;
      span {
        float: left;
      }
      .headerImg {
        font-size: 30px;
        margin: 20px 10px 0 12px;
      }
      .headerIcon {
        margin: 0 10px 0 12px;
      }
      .avatar {
        float: left;
        width: 30px;
        height: 30px;
        border-radius: 50%;
      }
      .bell {
        position: relative;
        cursor: pointer;
        float: left;
        font-size: 18px;
        .newInfo {
          position: absolute;
          top: 23px;
          right: 0;
          width: 8px;
          height: 8px;
          background: #f00;
          border-radius: 50%;
        }
      }
      .userName {
        float: left;
        max-width: 105px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .el-dropdown-menu__item {
        span {
          display: inline-block;
        }
        .font {
          font-size: 20px !important;
          color: #687284;
          margin-right: 15px;
        }
        .icon {
          font-size: 14px !important;
          color: #687284;
        }
      }
    }
  }
</style>
