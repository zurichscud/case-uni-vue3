<script setup>
// 获取状态文本
function getStatusText(status) {
  const statusMap = {
    1: '文本1',
    2: '文本2',
    3: '文本3',
    4: '文本4',
  }
  return statusMap[status] || '未知状态'
}
</script>

<template>
  <view class="status-indicator" :class="`status-${item.status}`">
    <view class="status-dot"></view>
    <text class="status-text">{{ getStatusText(item.status) }}</text>
  </view>
</template>

<style scoped lang="scss">
.status-indicator {
  display: flex;
  align-items: center;
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10rpx);
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  animation: float 3s ease-in-out infinite;
  z-index: 3;
  position: relative;

  .status-dot {
    width: 12rpx;
    height: 12rpx;
    border-radius: 50%;
    margin-right: 8rpx;
    animation: pulse 2s ease-in-out infinite;
  }

  .status-text {
    font-size: 22rpx;
    font-weight: 500;
  }

  &.status-1 {
    .status-dot {
      background: #ff9500;
      box-shadow: 0 0 8rpx rgba(255, 149, 0, 0.6);
    }
    .status-text {
      color: #ff9500;
    }
  }

  &.status-2 {
    .status-dot {
      background: #007aff;
      box-shadow: 0 0 8rpx rgba(0, 122, 255, 0.6);
    }
    .status-text {
      color: #007aff;
    }
  }

  &.status-3 {
    .status-dot {
      background: #34c759;
      box-shadow: 0 0 8rpx rgba(52, 199, 89, 0.6);
    }
    .status-text {
      color: #34c759;
    }
  }

  &.status-4 {
    .status-dot {
      background: #8e8e93;
      box-shadow: 0 0 8rpx rgba(142, 142, 147, 0.6);
    }
    .status-text {
      color: #8e8e93;
    }
  }
}
</style>
