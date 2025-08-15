<script setup>
const shareVisible = defineModel('modelValue', {
  type: Boolean,
  default: false,
})
const emit = defineEmits(['share', 'poster'])

function handleShareToFriend() {
  shareVisible.value = false
  emit('share')
}

function handleGeneratePoster() {
  shareVisible.value = false
  emit('poster')
}
</script>

<template>
  <wd-popup
    :safe-area-inset-bottom="true"
    v-model="shareVisible"
    position="bottom"
    closable
    custom-style="border-radius: 30rpx 30rpx 0 0;"
    @close="shareVisible = false"
    :z-index="600"
  >
    <view class="share-popup">
      <!-- 标题 -->
      <view class="share-title">分享到</view>

      <!-- 分享选项 -->
      <view class="share-options">
        <!-- 分享好友 -->
        <button
          class="share-option"
          open-type="share"
          hover-class="share-option-hover"
          @tap="handleShareToFriend"
        >
          <view class="share-icon">
            <i class="iconfont icon-weixin" style="color: #1aad19" />
          </view>
          <text class="share-text">分享好友</text>
        </button>

        <!-- 生成海报 -->
        <button class="share-option" hover-class="share-option-hover" @tap="handleGeneratePoster">
          <view class="share-icon">
            <i class="iconfont icon-weihaibao" style="color: #ff6b35" />
          </view>
          <text class="share-text">生成海报</text>
        </button>
      </view>
    </view>
  </wd-popup>
</template>

<style scoped lang="scss">
/* 分享弹窗样式 */
.share-popup {
  padding: 40rpx 40rpx 0;
  background: #ffffff;
}

.share-title {
  text-align: center;
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
  margin-bottom: 40rpx;
}

.share-options {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 40rpx 0;
}

.share-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: transparent;
  border: none;
  padding: 20rpx;
  border-radius: 20rpx;
  transition: all 0.3s ease;
  font-size: inherit;
  line-height: inherit;
  margin: 0;

  &::after {
    border: none;
  }
}

.share-option-hover {
  background: #f5f5f5;
  transform: scale(0.95);
}

.share-icon {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16rpx;

  .iconfont {
    font-size: 80rpx;
  }
}

.share-text {
  font-size: 28rpx;
  color: #333333;
}

.share-cancel {
  text-align: center;
  font-size: 32rpx;
  color: #666666;
  padding: 30rpx 0;
  margin-top: 20rpx;
  border-top: 1rpx solid #f0f0f0;
  cursor: pointer;
}
</style>
