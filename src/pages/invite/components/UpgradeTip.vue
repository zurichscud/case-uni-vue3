<script setup>
import { REMARK } from '@/enums/remark'

defineProps({
  remark: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <view class="summary-container">
    <!-- 保民 -->
    <template v-if="remark === REMARK.BaoMin">
      <text>保民无法邀请，点击申请成为社员</text>
    </template>
    <!-- 社员 -->
    <template v-else-if="remark === REMARK.SheYuan">
      <text>您目前社员数量：</text>
      <text class="summary-num">{{ 1 }}位</text>
      ，保民
      <text class="summary-num">{{ 2 }}位</text>
      ，再邀请
      <text class="summary-highlight">{{ 3 }}位社员</text>
      就可以成为分社社长
    </template>
    <!-- 分社社长 -->
    <template v-else-if="remark === REMARK.FenSheZhang">
      <text>您目前分社数量：</text>
      <text class="summary-num">{{ 1 }}个</text>
      ，再有
      <text class="summary-highlight">{{ 2 }}个分社</text>
      就可以成为联社社长
    </template>
    <template v-else>未知身份</template>
  </view>
</template>

<style scoped lang="scss">
.summary-container {
  margin: 24rpx 0;
  padding: 24rpx 30rpx;
  background: linear-gradient(90deg, #e0f7fa 0%, #f1f8e9 100%);
  border-radius: 16rpx;
  font-size: 28rpx;
  color: #333;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
.summary-num {
  color: #1976d2;
  font-weight: bold;
  margin: 0 4rpx;
}
.summary-highlight {
  color: #43a047;
  font-weight: bold;
  margin: 0 4rpx;
}
</style>
