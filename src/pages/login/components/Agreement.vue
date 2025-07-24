<script setup>
import router from '@/utils/router'

const isAgree = defineModel('modelValue', {
  type: Boolean,
  default: false,
})
</script>

<template>
  <view class="flex items-center justify-center gap-1 text-xs text-gray-500 mt-6">
    <wd-checkbox v-model="isAgree" shape="round" size="20"></wd-checkbox>
    <view class="text-left">
      <text>我已认真阅读并同意理赔公社</text>
      <text
        class="link text-blue-500 mx-1"
        @click="router.push('/pages/public/agreement/serviceText')"
      >
        《服务协议》
      </text>
      <text>和</text>
      <text
        class="link text-blue-500 mx-1"
        @click="router.push('/pages/public/agreement/privacyText')"
      >
        《隐私条款》
      </text>
    </view>
  </view>
</template>

<style scoped></style>
