<script setup lang="ts">
import throttle from '@/utils/throttle'

interface MenuItem {
  name: string
  icon?: string
  handle?: () => void
  openType?: string
}

interface Props {
  list: MenuItem[][]
}

defineProps<Props>()

function handleClick(item: MenuItem): void {
  if (item.handle) {
    throttle(item.handle)
  }
}
</script>

<template>
  <view class="menu-card" v-for="(menu, index) in list" :key="index">
    <view class="menu-item" v-for="(item, i) in menu" :key="i" @click="handleClick(item)">
      <OpenType :open-type="item.openType">
        <view class="item-content flex items-center justify-between px-8">
          <view class="flex items-center">
            <text class="iconfont user-icon" :class="item.icon"></text>
            <text class="ml-4">
              {{ item.name }}
            </text>
          </view>
          <text class="iconfont icon-jiantou_liebiaoxiangyou arrow-icon"></text>
        </view>
      </OpenType>
    </view>
  </view>
</template>

<style scoped lang="scss">
.menu-card {
  box-shadow: 0px 3px 22px 0px rgba(0, 0, 0, 0.05);
  border-radius: 20rpx;
  z-index: 100;
  background-color: white;
  overflow: hidden;
  margin-bottom: 20rpx;

  .menu-item {
    height: 108rpx;
    line-height: 108rpx;
    color: #666666;
    font-size: 32rpx;

    .item-content {
      position: relative;
      .user-icon {
        font-size: 44rpx;
      }
      .arrow-icon {
        font-size: 44rpx;
        color: #666666;
      }
    }
  }
}
</style>
