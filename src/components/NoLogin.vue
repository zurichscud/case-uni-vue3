<template>
  <view class="none">
    <image class="noneImg" src="/src/static/暂无数据.png"></image>
    <view class="noneText">请登录账号后查看～</view>
    <view class="w-30 mx-auto mt-4">
      <wd-button type="primary" block @click="router.push('/pages/login/login')">
        立即登录
      </wd-button>
    </view>
  </view>
</template>

<script setup>
defineProps({
  name: String,
  btn: String,
  src: String,
})
</script>

<style lang="scss" scoped>
.none {
  padding-top: 412rpx;
  background-color: #ffffff;
  height: 100%;
  width: 100%;
  text-align: center;
  .noneImg {
    width: 380rpx;
    height: 380rpx;
    display: block;
    margin: 0 auto;
  }
  .btn {
    color: #999999;
    font-size: 28rpx;
  }
  .noneText {
    color: #999999;
    font-size: 28rpx;
  }
}
</style>
