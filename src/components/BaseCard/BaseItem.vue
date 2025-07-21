<script setup>
defineProps({
  icon: {
    type: String,
    default: null,
  },
  label: {
    type: String,
    default: '',
  },
  value: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <view class="flex items-center my-1">
    <text class="iconfont text-[20rpx] text-[#999] mr-1" :class="icon" v-if="icon"></text>
    <text class="text-[24rpx] text-[#999] mr-2">{{ label }}</text>
    <text class="text-[28rpx] text-[#333]">
      {{ value }}
    </text>
  </view>
</template>

<style scoped></style>
