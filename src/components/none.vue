<template>
  <view class="none">
    <image
      class="noneImg"
      :src="src ? src : 'https://app.y9net.cn/data/01/32/wKgBNmNbRMWABwAlAAEua5gMAPY358.png'"
    ></image>
    <view v-if="btn" class="btn">{{ btn }}</view>
    <view v-else class="noneText">{{ name }}</view>
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
