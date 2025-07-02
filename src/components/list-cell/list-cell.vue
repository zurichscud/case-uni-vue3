<template>
  <view
    class="tui-cell-class tui-list-cell"
    :class="{
      'tui-cell-arrow': arrow,
      'tui-cell-last': last,
      'tui-line-left': lineLeft,
      'tui-line-right': lineRight,
      'tui-radius': radius,
    }"
    :hover-class="hover ? 'tui-cell-hover' : ''"
    :style="{ background: bgcolor, fontSize: size + 'rpx', color: color, padding: padding }"
    :hover-stay-time="150"
    @tap="handleClick"
  >
    <slot></slot>
    <image src="/static/images/navigator-1.png" class="arrow" v-if="arrow"></image>
    <!-- <view class="iconfont iconarrow-right arrow" v-if="arrow"></view> -->
  </view>
</template>

<script lang="ts" setup>
const props = defineProps({
  arrow: {
    type: Boolean,
    default: false,
  },
  hover: {
    type: Boolean,
    default: true,
  },
  lineLeft: {
    type: Boolean,
    default: false,
  },
  lineRight: {
    type: Boolean,
    default: false,
  },
  padding: {
    type: String,
    default: '26rpx 30rpx',
  },
  last: {
    type: Boolean,
    default: false,
  },
  radius: {
    type: Boolean,
    default: false,
  },
  bgcolor: {
    type: String,
    default: '#fff',
  },
  size: {
    type: Number,
    default: 28,
  },
  color: {
    type: String,
    default: '#5A5B5C',
  },
  index: {
    type: Number,
    default: 0,
  },
})

// Define emit
const emit = defineEmits(['click'])

// Handle click
const handleClick = () => {
  emit('click', {
    index: props.index,
  })
}
</script>

<style lang="scss" scoped>
.tui-list-cell {
  position: relative;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  align-items: center;
}
.tui-radius {
  border-radius: 12rpx;
  overflow: hidden;
}

.tui-cell-hover {
  background: #f7f7f9 !important;
}

.tui-list-cell::after {
  content: '';
  position: absolute;
  border-bottom: 2rpx solid #eee;
  -webkit-transform: scaleY(0.8);
  transform: scaleY(0.8);
  bottom: 0;
  right: 0;
  left: 0;
}
.tui-line-left::after {
  left: 30rpx !important;
}

.tui-line-right::after {
  right: 30rpx !important;
}

.tui-cell-last::after {
  border-bottom: 0 !important;
}

// .arrow {
// 	font-size: 44rpx;
// 	line-height: 100%;
// 	color: $text-color-grey;
// 	position: relative;
// 	margin-right: -12rpx;
// }
.arrow {
  width: 50rpx;
  height: 50rpx;
  position: relative;
  margin-right: -10rpx;
  flex-shrink: 0;
}
</style>
