<script setup>
import { REMARK } from '@/enums/remark'

defineProps({
  remark: {
    type: String,
    default: '',
  },
  count: {
    type: Object,
    default: () => ({
      sheyuanCount: 0,
      baominCount: 0,
      fensheCount: 0,
      liansheCount: 0,
      lackCount: 0,
    }),
  },
})
</script>

<template>
  <!-- 需要优化升级文字 -->
  <view class="summary-container">
    <!-- 保民 -->
    <template v-if="remark === REMARK.BaoMin">
      <text>保民无法邀请</text>
    </template>
    <!-- 社员 -->
    <template v-else-if="remark === REMARK.SheYuan">
      <view class="summary-highlight" v-if="count.lackPersonCount1">
        再邀请{{ count.lackPersonCount1 }}位人员
      </view>
      <text v-if="count.lackPersonCount2 || count.lackCaseCount">或者</text>
      <text v-if="count.lackCaseCount">再提交 {{ count.lackCaseCount }}个案件</text>
      <text v-if="count.lackPersonCount2" class="summary-highlight">
        再邀请{{ count.lackPersonCount2 }}位人员
      </text>
      就可以成为分社社长
    </template>
    <!-- 分社社长 -->
    <template v-else-if="remark === REMARK.FenSheZhang">
      <text>您目前分社数量：</text>
      <text class="summary-num">{{ count.fensheCount }}个</text>
      ，再有
      <text class="summary-highlight">{{ count.lackPersonCount1 }}个分社</text>
      就可以成为联社社长
    </template>
    <!--  -->
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
