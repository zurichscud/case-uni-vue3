<template>
  <view>
    <view class="list_block" @click="navInfo">
      <view class="list_block_left">
        <view class="list_block_title">
          {{ item.title }}
        </view>
        <view class="list_block_time">
          {{ item.updateTime }}
        </view>
      </view>
      <view class="list_block_right">
        <view class="image_container">
          <image :src="item.coverUrl" mode="aspectFill" lazy-load="true" class="list_img"></image>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {}
    },
    props: ['item'],
    methods: {
      navInfo() {
        const id = this.item.id
        uni.navigateTo({
          url: `/pages/case/classiccase?id=${id}`
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .list_block {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 24rpx;
    background: #ffffff;
    border-radius: 16rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
    margin-bottom: 24rpx;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;

    &:active {
      transform: translateY(0);
      box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
    }

    .list_block_left {
      flex: 1;
      padding-right: 24rpx;
      min-height: 132rpx;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .list_block_title {
        font-size: 32rpx;
        color: #1a1a1a;
        line-height: 1.4;
        font-weight: 600;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        margin-bottom: 16rpx;
        word-break: break-word;
      }

      .list_block_time {
        font-size: 24rpx;
        color: #888888;
        font-weight: 400;
        margin-top: auto;
        display: flex;
        align-items: center;

        &::before {
          content: '';
          width: 8rpx;
          height: 8rpx;
          background: #e0e0e0;
          border-radius: 50%;
          margin-right: 12rpx;
        }
      }
    }

    .list_block_right {
      flex-shrink: 0;

      .image_container {
        width: 200rpx;
        height: 132rpx;
        border-radius: 12rpx;
        overflow: hidden;
        box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
        background: #f5f5f5;
        position: relative;

        .list_img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        &::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.1) 100%);
          pointer-events: none;
        }
      }
    }
  }
</style>
