<script setup></script>

<template>
  <view class="section-title">案件</view>
  <wd-grid clickable :column="4">
    <wd-grid-item icon="picture" text="全部案件" use-icon-slot>
      <template #icon>
        <i class="iconfont icon-case-file"></i>
      </template>
    </wd-grid-item>
  </wd-grid>
  <view class="section-title">团队</view>
  <wd-grid clickable :column="4">
    <wd-grid-item icon="picture" text="文字" />
    <wd-grid-item icon="picture" text="文字" />
    <wd-grid-item icon="picture" text="文字" />
  </wd-grid>
  <view class="section-title">政策</view>
  <wd-grid clickable :column="4">
    <wd-grid-item icon="picture" text="文字" />
    <wd-grid-item icon="picture" text="文字" />
    <wd-grid-item icon="picture" text="文字" />
  </wd-grid>
  <view class="section-title">文章</view>
  <wd-grid clickable>
    <wd-grid-item icon="picture" text="文字" />
    <wd-grid-item icon="picture" text="文字" />
    <wd-grid-item icon="picture" text="文字" />
    <wd-grid-item icon="picture" text="文字" />
  </wd-grid>
</template>

<style scoped>
.section-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #333;
  margin: 30rpx 0 20rpx 0;
  padding: 0 30rpx;
  position: relative;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 30rpx;
  bottom: -8rpx;
  width: 40rpx;
  height: 4rpx;
  background: linear-gradient(90deg, #4a90e2 0%, #7ed321 100%);
  border-radius: 2rpx;
}
</style>
