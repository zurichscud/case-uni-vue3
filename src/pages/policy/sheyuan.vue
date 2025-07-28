<!-- 邀请好友享两大福利 -->
<template>
  <view class="invite">
    <image
      lazy-load
      mode="widthFix"
      :src="src"
    ></image>

  </view>
</template>

<script setup>

const src='https://app.y9net.cn/data/01/38/wKgBNmPpoLKAD18OAANSHqPedB4675.jpg'

</script>

<style lang="scss">
.invite {
  position: relative;

  image {
    width: 100%;
    vertical-align: middle;
  }
}

.popup_box {
  width: 70%;
  height: 500rpx;
}

.wx_code {
  position: absolute;
  width: 381rpx;
  height: 125rpx;
  opacity: 0;
  background-color: red;
  bottom: 118rpx;
  left: 178rpx;
}

.popup-content {
  width: 400rpx;
  border-radius: 20rpx;
  overflow: hidden;
}
</style>

<route lang="json">
{
  "name": "sheyuanPolicy",
  "layout": "default",
  "style": {
    "navigationBarTitleText": "社员奖励政策"
  }
}
</route>
