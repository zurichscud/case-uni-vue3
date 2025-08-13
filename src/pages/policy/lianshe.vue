<template>
  <view class="main">
    <empty v-if="isError" />
    <image
      v-else
      lazy-load
      mode="widthFix"
      :src="src"
      @click="handlePreview"
      @load="handleLoad"
      @error="handleError"
    ></image>
  </view>
</template>

<script setup>
const src='https://app.y9net.cn/data/01/38/wKgBNmPpoIuAZKK9AAQgKJOGCkI935.jpg'
const isError = ref(false)

function handleLoad() {
  uni.hideLoading()
}

function handleError() {
  isError.value = true
  uni.hideLoading()
}

function handlePreview() {
  // uni.previewImage({
  //   current: 0,
  //   urls: [src],
  // })
}
onMounted(() => {
  uni.showLoading({
    title: '加载中...',
  })
})
</script>

<style scoped lang="scss"></style>

<route lang="json">
{
  "name": "lianshePolicy",
  "layout": "default",
  "auth": true,
  "style": {
    "navigationBarTitleText": "联社社长权益"
  }
}
</route>
