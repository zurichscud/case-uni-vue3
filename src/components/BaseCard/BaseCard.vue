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

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 140rpx;
    height: 140rpx;
    background: linear-gradient(
      135deg,
      rgba(63, 156, 255, 0.15) 0%,
      rgba(82, 196, 26, 0.12) 30%,
      rgba(255, 193, 7, 0.1) 60%,
      rgba(220, 53, 69, 0.08) 100%
    );
    border-radius: 0 16rpx 0 140rpx;
    z-index: 1;
    box-shadow: inset 0 0 20rpx rgba(255, 255, 255, 0.3);
  }

  &::after {
    content: '';
    position: absolute;
    top: 8rpx;
    right: 8rpx;
    width: 60rpx;
    height: 60rpx;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.8) 0%,
      rgba(255, 255, 255, 0.4) 50%,
      transparent 100%
    );
    border-radius: 50%;
    z-index: 2;
    animation: shimmer 3s ease-in-out infinite;
  }

  &:active {
    transform: scale(0.98);
    background: #f8f9fa;
  }
}
.base-card-index {
  position: absolute;
  top: 40rpx;
  right: 40rpx;
  font-size: 32rpx;
  color: #0d1a6b;
  font-weight: 600;
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
  border-top: 1rpx solid #f0f0f0;
}
</style>
