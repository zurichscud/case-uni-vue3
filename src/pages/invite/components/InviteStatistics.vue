<script setup lang="ts">
interface StatItem {
  count: number
  label: string
}

const props = withDefaults(
  defineProps<{
    baoMin: number
    sheYuan: number
    fenShe: number
  }>(),
  {
    baoMin: 0,
    sheYuan: 0,
    fenShe: 0,
  },
)

const statisticsData = computed<StatItem[]>(() => [
  { count: props.baoMin, label: '直邀保民' },
  { count: props.sheYuan, label: '直邀社员' },
  { count: props.fenShe, label: '直邀分社社长' },
])
</script>

<template>
  <!-- 统计卡片容器 -->
  <view class="bg-white rounded-2xl mt-2 py-4" style="box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08)">
    <!-- 统计数据网格 -->
    <view class="flex">
      <view
        v-for="(item, index) in statisticsData"
        :key="index"
        class="flex-1 text-center"
        :class="{ 'border-right': index < statisticsData.length - 1 }"
      >
        <!-- 数量 -->
        <view class="mb-1">
          <text class="text-sm text-gray-500">
            {{ item.count }}
          </text>
        </view>

        <!-- 标签 -->
        <view>
          <text class="text-xs text-gray-500">
            {{ item.label }}
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
/* 分割线样式 */
.border-right {
  border-right: 1px solid #e5e7eb;
}

/* 响应式适配小屏幕 */
@media screen and (max-width: 750rpx) {
  .flex {
    flex-direction: column !important;
  }

  .flex > view {
    border-right: none !important;
    border-bottom: 1px solid #e5e7eb;
    padding: 24rpx 0 !important;
  }

  .flex > view:last-child {
    border-bottom: none !important;
  }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .bg-white {
    background-color: #1f2937 !important;
  }

  .text-gray-800 {
    color: #f9fafb !important;
  }

  .border-right {
    border-color: #4b5563 !important;
  }

  .text-gray-600 {
    color: #d1d5db !important;
  }
}
</style>
