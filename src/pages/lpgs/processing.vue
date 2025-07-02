<template>
  <view>
    <view class="centerBox">
      <image
        class="img_box"
        src="https://app.y9net.cn/data/01/46/wKgBNmXgMYKAZ1VgAAA92pwszKQ235.png"
        mode=""
      ></image>
    </view>
    <view class="shen_tong"> 正加紧审核中…… </view>
    <view class="info"> 理赔公社审核人员将在1个工作日内审核完成！ </view>
    <view class="btn" @click="navto"> 下一步 </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {}
    },
    methods: {
      navto() {
        uni.switchTab({
          url: '/pages/index/index'
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .centerBox {
    display: flex;
    justify-content: center;
    margin-top: 60rpx;
  }
  .img_box {
    width: 116rpx;
    height: 116rpx;
  }
  .shen_tong {
    text-align: center;
    font-size: 36rpx;
    color: #111111;
    margin-bottom: 20rpx;
  }
  .info {
    text-align: center;
    color: #999999;
    font-size: 28rpx;
  }
  .btn {
    width: 580rpx;
    height: 88rpx;
    line-height: 88rpx;
    color: white;
    background: #3f9cff;
    box-shadow: 0px 4px 10px 0px rgba(63, 156, 255, 0.3);
    border-radius: 120rpx;
    position: fixed;
    bottom: 100rpx;
    left: 0;
    right: 0;
    margin: 0 auto;
    text-align: center;
  }
</style>
