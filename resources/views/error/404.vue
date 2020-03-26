<template>
  <div class="page-not-found">
    <div class="container clearfix">
      <img
        src="./assets/ufo.png"
        class="pull-left"
        style="margin-right: 80px;"
        alt="ufo"
      >
      <div>
        <p style="font-size: 60px;">404</p>
        <div>抱歉，您访问的页面不存在</div>
        <el-button
          type="text"
          size="large"
        >
          <router-link
            tag="span"
            to="/"
          >返回首页</router-link>
        </el-button>
      </div>
    </div>
    <div class="copyright">Copyright© 2019 北京光速斑马数据科技有限公司, all rights reserved | 京ICP备17036596号-1</div>
  </div>
</template>

<script>
export default {
  name: 'pageNotFound'
}
</script>

<style lang="scss" scoped>
  .page-not-found {
    height: 100%;
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
