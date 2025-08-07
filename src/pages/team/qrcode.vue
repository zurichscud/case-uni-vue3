<script setup lang="ts">
import { shareOptions } from '@/config/wechat'
import { useQRcode } from '@/hooks/useQRcode'

const { loading, QRImg, saveLoading, handleSave, getMyQRcodeData } = useQRcode()

function handlePreview() {
  uni.previewImage({
    urls: [QRImg.value],
  })
}

onShareAppMessage(() => shareOptions)

onLoad(() => {
  getMyQRcodeData()
})
</script>

<template>
  <view class="min-h-screen bg-white flex flex-col main">
    <!-- 主要内容 -->
    <view class="flex-1 flex flex-col items-center justify-center pt-12 px-15 gap-8">
      <!-- 二维码容器 -->
      <view class="w-[400rpx] h-[400rpx] rounded-4 flex items-center justify-center">
        <view class="flex flex-col items-center justify-center gap-4" v-if="loading">
          <wd-loading />
          <text>二维码生成中...</text>
        </view>
        <image v-else :src="QRImg" width="400rpx" mode="scaleToFill" @click="handlePreview" />
      </view>

      <!-- 用户信息 -->
      <view class="flex flex-col items-center gap-4">
        <text class="font-medium text-base leading-7.5 text-gray-400 text-center">
          扫描我的二维码加入我的团队
        </text>
      </view>
    </view>

    <!-- 底部按钮 -->
    <view class="px-4 pb-8 flex flex-col gap-4 ">
      <wd-button
        type="primary"
        icon="download"
        block
        size="large"
        custom-class="download-btn"
        :loading="saveLoading"
        @click="handleSave"
      >
        <view >保存</view>
      </wd-button>
    </view>
  </view>
</template>

<style scoped>
</style>

<route lang="json">
{
  "name": "myQrcode",
  "layout": "default",
  "dev": true,
  "auth": true,
  "style": {
    "navigationBarTitleText": "邀请二维码"
  }
}
</route>
