<!-- 邀请好友享两大福利 -->
<template>
  <view class="main">
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
.main {
  position: relative;

  image {
    width: 100%;
    vertical-align: middle;
  }
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
