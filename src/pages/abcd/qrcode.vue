<script setup>
import { ref } from 'vue'
import uqrcode from '@/uni_modules/Sansnn-uQRCode/components/u-qrcode/u-qrcode.vue'

const uqrcodeRef = ref()

const options = ref({
  sizeUnit: 'rpx',
  margin: 20,
  auto: true,
})
</script>

<template>
  hello
  <view class="qrcode">
    <uqrcode ref="uqrcodeRef" canvas-id="qrcode" :value="2024" :options="options"></uqrcode>
  </view>
</template>

<style scoped lang="scss">
.qrcode {
  width: 100rpx;
  height: 100rpx;

}
</style>

<route lang="json">
{
  "name": "myQrcode",
  "layout": "default",
  "auth": true,
  "style": {
    "navigationBarTitleText": "邀请二维码"
  }
}
</route>
