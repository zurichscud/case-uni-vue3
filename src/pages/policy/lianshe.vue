<template>
  <view >
    <image
      lazy-load
      mode="widthFix"
      :src="src"
      @click="handlePreview"
      alt=""
      style="width: 100%"
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

<style scoped lang="scss"></style>

<route lang="json">
{
  "name": "lianshePolicy",
  "layout": "default",
  "auth": true,
  "style": {
    "navigationBarTitleText": "联社社长政策"
  }
}
</route>
