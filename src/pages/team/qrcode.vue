<script setup lang="ts">
import { ref, onMounted } from 'vue'
// @ts-expect-error - uni_modules 组件缺少类型声明
import uQrcode from '@/uni_modules/Sansnn-uQRCode/components/u-qrcode/u-qrcode.vue'
import { useUserStore } from '@/stores'
import logo from '@/static/读书.png'
import { subscribeTemplate, shareOptions } from '@/config/wechat'

const userStore = useUserStore()
const uqrcodeRef = ref()
// 二维码配置
const qrOptions = ref({
  margin: 16,
  foregroundImageSrc: logo,
  backgroundColor: '#FFFFFF',
  foregroundColor: '#4285f4',
  correctLevel: 'M',
  auto: true,
})

// 分享功能
function handleShare() {
  uni.showActionSheet({
    itemList: ['分享到微信好友', '分享到朋友圈'],
    success: (res) => {
      switch (res.tapIndex) {
        case 0:
          shareToFriend()
          break
        case 1:
          shareToTimeline()
          break
      }
    },
  })
}

// 分享到好友
function shareToFriend() {
  uni.requestSubscribeMessage({
    tmplIds: subscribeTemplate,
    success: (res) => {
      console.log(res)
    },
    fail: ({ errMsg, errCode }) => {
      console.log(errMsg, errCode)
      uni.showToast({
        title: '订阅失败',
        icon: 'none',
      })
    },
  })
  console.log('不支持')
}

// 分享到朋友圈
function shareToTimeline() {
  console.log('不支持')
}

// 下载/保存二维码
function handleSave() {
  if (uqrcodeRef.value) {
    uqrcodeRef.value.save({
      success: () => {
        uni.showToast({
          title: '保存成功',
          icon: 'success',
        })
      },
      fail: () => {
        uni.showToast({
          title: '保存失败',
          icon: 'error',
        })
      },
    })
  }
}
onShareAppMessage(() => shareOptions)
</script>

<template>
  <view class="min-h-screen bg-white flex flex-col">
    <!-- 主要内容 -->
    <view class="flex-1 flex flex-col items-center justify-center pt-12.5 px-15 gap-8">
      <!-- 二维码容器 -->
      <view
        class="w-[400rpx] h-[400rpx] bg-white rounded-4 flex items-center justify-center shadow-sm"
      >
        <uQrcode
          ref="uqrcodeRef"
          canvas-id="invite-qrcode"
          :value="userStore.id"
          :options="qrOptions"
          size="400"
          size-unit="rpx"
        />
      </view>

      <!-- 用户信息 -->
      <view class="flex flex-col items-center gap-4">
        <text class="font-medium text-5 leading-7.5 text-[#2D2D2D] text-center">
          {{ userStore.nickName }}
        </text>
      </view>
    </view>

    <!-- 底部按钮 -->
    <view class="p-4 flex flex-col gap-4">
      <wd-button type="primary" size="large" custom-class="share-btn" @click="handleShare">
        <wd-icon
          name="share"
          size="16px"
          color="#05BE71"
          custom-style="margin-right: 8px;"
        ></wd-icon>
        分享
      </wd-button>

      <wd-button type="primary" size="large" custom-class="download-btn" @click="handleSave">
        <wd-icon
          name="download"
          size="16px"
          color="#05BE71"
          custom-style="margin-right: 8px;"
        ></wd-icon>
        保存
      </wd-button>
    </view>
  </view>
</template>

<style scoped>
/* 自定义按钮样式 - 使用 CSS 变量覆盖组件样式 */
:deep(.share-btn),
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
}
</style>

<route lang="json">
{
  "name": "myQrcode",
  "layout": "default",
  "dev": true,
  "auth": true,
  "style": {
    "navigationBarTitleText": "邀请二维码",
    "navigationStyle": "custom"
  }
}
</route>
