<template>
  <view class="network-error">
    <nut-empty image="network" description="网络错误"></nut-empty>
    <view class="mt-4">
      <wd-button size="small" type="primary" @tap="handleReLanch">刷新</wd-button>
    </view>
  </view>
</template>
<script setup lang="ts">
import router from '@/utils/router'
const handleReLanch = () => {
  router.redirect('/pages/index/index')
}
</script>
<style lang="scss" scoped>
.network-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
</style>
