<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores'
import { subscribeTemplate, shareOptions } from '@/config/wechat'
import * as TeamAPI from '@/apis/team'
import { base64ToPath } from '@/utils/image'

const img = ref<string>('')
const loading = ref(false)
const saveLoading = ref(false)


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

function handlePreview() {
  uni.previewImage({
    urls: [img.value],
  })
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
        <image v-else :src="img" width="400rpx" mode="scaleToFill" @click="handlePreview" />
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
