<!-- 邀请好友享两大福利 -->
<template>
  <view class="invite">
    <image
      lazy-load
      mode="widthFix"
      src="https://iclaim.oss-cn-beijing.aliyuncs.com/2025/01/1a45d78411cd4eca8f7b59735996f212.png"
    ></image>
    <button class="wx_code" @click="visible = true">申请成为分社社长</button>

    <wd-popup v-model="visible" closable>
      <view class="popup-content" @click="handlePreviewImg">
        <image class="popup-image" :src="app.daliuWx" mode="widthFix" />
        <image class="popup-image" :src="app.linyunWx" mode="widthFix" />
      </view>
    </wd-popup>
  </view>
</template>

<script setup>
import app from '@/config/app'

const imgs = [app.daliuWx, app.linyunWx]
const visible = ref(false)

function handlePreviewImg() {
  uni.previewImage({
    current: 0,
    urls: imgs,
  })
}
</script>

<style lang="scss">
.invite {
  position: relative;

  image {
    width: 100%;
    vertical-align: middle;
  }
}

.popup_box {
  width: 70%;
  height: 500rpx;
}

.wx_code {
  position: absolute;
  width: 381rpx;
  height: 125rpx;
  opacity: 0;
  background-color: red;
  bottom: 118rpx;
  left: 178rpx;
}

.popup-content {
  width: 400rpx;
  border-radius: 20rpx;
  overflow: hidden;
}
</style>

<route lang="json">
{
  "name": "fengshePolicy",
  "layout": "default",
  "style": {
    "navigationBarTitleText": "分社社长福利"
  }
}
</route>
