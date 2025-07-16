<template>
  <view class="base-card" :class="customClass">
    <view v-if="$slots.index" class="base-card-index">
      <slot name="index" />
    </view>
    <view v-if="$slots.header" class="base-card-header">
      <slot name="header" />
    </view>
    <view class="base-card-content">
      <slot />
    </view>
    <view v-if="$slots.actions" class="base-card-actions">
      <slot name="actions" />
    </view>
  </view>
</template>

<script setup lang="ts">
defineProps<{
  customClass?: string
}>()
</script>

<style scoped lang="scss">
.base-card {
  background: #fff;
  border-radius: 16rpx;
  margin: 20rpx 0;
  padding: 30rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}
.base-card-index {
  position: absolute;
  top: 40rpx;
  right: 40rpx;
  font-size: 32rpx;
  color: #a1a0a0;
  font-weight: 600;
  z-index: 3;
  line-height: 1;
}
.base-card-header {
  margin-bottom: 16rpx;
}
.base-card-content {
  // 内容区可自定义扩展
}
.base-card-actions {
  display: flex;
  justify-content: flex-end;
  gap: 20rpx;
  border-top: 1rpx solid #f0f0f0;
}
</style>
