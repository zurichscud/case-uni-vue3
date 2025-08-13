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
import appConfig from '@/config/app'

const src = appConfig.sheyuanPolicy
const isError = ref(false)

function handleLoad() {
  uni.hideLoading()
}

function handleError() {
  isError.value = true
  uni.hideLoading()
}

function handlePreview() {
  uni.previewImage({
    current: 0,
    urls: [src],
  })
}
onMounted(() => {
  uni.showLoading({
    title: '加载中...',
  })
})
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
  "auth": true,
  "style": {
    "navigationBarTitleText": "社员政策"
  }
}
</route>
