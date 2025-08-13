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

const src = appConfig.fenshePolicy
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

<style lang="scss"></style>

<route lang="json">
{
  "name": "fenshePolicy",
  "layout": "default",
  "auth": true,
  "style": {
    "navigationBarTitleText": "分社社长权益"
  }
}
</route>
