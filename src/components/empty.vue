<template>
  <view class="none">
    <image
      class="noneImg"
      :src="src"
    ></image>
    <view class="noneText">{{ text }}</view>
  </view>
</template>

<script setup>
import defaultImg from '@/static/empty.png'
defineProps({
  src: {
    type: String,
    default: defaultImg,
  },
  text: {
    type: String,
    default:'空空如也'
  },
})
</script>

<style lang="scss" scoped>
.none {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
