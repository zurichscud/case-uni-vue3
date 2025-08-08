<!-- 邀请好友享两大福利 -->
<template>
  <view class="invite">
    <image
      lazy-load
      mode="widthFix"
      :src="src"
      @click="handlePreview"
    ></image>

  </view>
</template>

<script setup>


const src='https://app.y9net.cn/data/01/38/wKgBNmPpoIuAZKK9AAQgKJOGCkI935.jpg'

function handlePreview() {
  uni.previewImage({
    current: 0,
    urls: [src],
  })
}
</script>

<style lang="scss">
</style>

<route lang="json">
{
  "name": "fenshePolicy",
  "layout": "default",
  "auth": true,
  "style": {
    "navigationBarTitleText": "分社社长政策"
  }
}
</route>
