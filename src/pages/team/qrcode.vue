<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores'
import { subscribeTemplate, shareOptions } from '@/config/wechat'
import * as TeamAPI from '@/apis/team'
import { base64ToPath } from '@/utils/image'

const img = ref<string>('')
const userStore = useUserStore()
const loading = ref(false)
const saveLoading = ref(false)

// 分享到好友
function shareToFriend() {}

// 下载/保存二维码
async function handleSave() {
  if (!img.value) {
    uni.showToast({ title: '二维码生成中...' })
    return
  }
  try {
    saveLoading.value = true
    const tempPath = await base64ToPath(img.value)
    await uni.saveImageToPhotosAlbum({ filePath: tempPath })
    uni.showToast({ title: '保存成功' })
  } catch (error) {
    console.log(error)
    uni.showToast({ title: '保存失败', icon: 'none' })
  } finally {
    saveLoading.value = false
  }
}

async function getMyQrcodeData() {
  loading.value = true
  const { data } = await TeamAPI.getMyQrcode()
  img.value = data.qrcode
  loading.value = false
}

onShareAppMessage(() => shareOptions)

onLoad(() => {
  getMyQrcodeData()
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
        <image v-else :src="img" width="400rpx" mode="scaleToFill" />
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
        block
        size="large"
        custom-class="download-btn"
        :loading="saveLoading"
        @click="handleSave"
      >
        <wd-icon name="download" size="20px" custom-style="margin-right: 8px;"></wd-icon>
        <text class="text-xl">保存</text>
      </wd-button>
    </view>
  </view>
</template>

<style scoped>
/* 自定义按钮样式 - 使用 CSS 变量覆盖组件样式 */
/* :deep(.share-btn),
:deep(.download-btn) {
  width: 100% !important;
  height: 56px !important;
  border-radius: 8px !important;
  background-color: #ffffff !important;
  border: 1px solid #ececec !important;
  color: #2d2d2d !important;
  font-family: 'Montserrat', sans-serif !important;
  font-weight: 500 !important;
  font-size: 14px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

:deep(.share-btn:active),
:deep(.download-btn:active) {
  opacity: 0.8;
} */
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
