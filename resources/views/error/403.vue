<template>
  <div class="not-authorized">
    <div class="container clearfix">
      <i class="el-icon-lock text-default"/>
      <div>
        <p style="font-size: 60px;">403</p>
        <div>抱歉，您没有权限访问该页面</div>
        <base-link @click="$router.back()"><i class="material-icons font-size-4" style="vertical-align: bottom;">undo</i>返回上页</base-link>
        <base-link router to="/">返回首页</base-link>
      </div>
    </div>
    <div class="copyright">Copyright© 2019 北京光速斑马数据科技有限公司, all rights reserved | 京ICP备17036596号-1</div>
  </div>
</template>

<script>
export default {
  name: 'NotAuthorized'
}
</script>

<style lang="scss" scoped>
  .not-authorized {
    height: 100%;
    .el-icon-lock {
      font-size: 10em;
    }
    .container {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      white-space: nowrap;
      color: #414957;
    }
  }
  .copyright {
    position: absolute;
    bottom: 24px;
    width: 100%;
    font-size: 12px;
    color: #c9c9c9;
    text-align: center;
  }
</style>
<style>
  #app {
    height: 100%;
  }
</style>
