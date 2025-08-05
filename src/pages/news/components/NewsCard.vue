<script setup>
defineProps({
  title: {
    type: String,
    default: '',
  },
})
const emit = defineEmits(['to'])

function handleClick() {
  emit('to')
}
</script>

<template>
  <view
    @click="handleClick"
    class="flex justify-between items-start p-2 bg-white rounded-4 shadow-sm mb-2 relative overflow-hidden"
  >
    <view class="flex-1 flex justify-between items-center">
      <view class="text-base text-gray-900 font-semibold text-ellipsis my-2 mx-2">
        {{ title }}
      </view>
      <text class="iconfont icon-jiantou_liebiaoxiangyou" style="font-size: 50rpx"></text>
    </view>
  </view>
</template>

<style scoped></style>
