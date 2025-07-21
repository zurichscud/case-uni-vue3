<script setup>
import { ref } from 'vue'

const uqrcode = ref()

const options = ref({
  sizeUnit: 'rpx',
  margin: 20,
  auto: true,
})
</script>

<template>
  <view>
    <uqrcode ref="uqrcode" canvas-id="qrcode" :value="2024" :options="options"></uqrcode>
  </view>
</template>

<style scoped lang="scss"></style>

<route lang="json">
{
  "name": "teamQrcode2",
  "layout": "default",
  "auth": true,
  "style": {
    "navigationBarTitleText": "邀请二维码"
  }
}
</route>
