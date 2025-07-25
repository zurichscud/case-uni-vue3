<script setup lang="ts">
import { ref, onMounted } from 'vue'
// @ts-expect-error - uni_modules 组件缺少类型声明
import uQrcode from '@/uni_modules/Sansnn-uQRCode/components/u-qrcode/u-qrcode.vue'
import { useShare } from '@/hooks/useShare'

const uqrcodeRef = ref()
const { shareOptions } = useShare()

// 用户信息
const userInfo = ref({
  name: 'Rizky Sentro Mahardy',
  id: '8273 8293 37292',
  avatar: '/static/user.png',
})

// 二维码配置
const qrOptions = ref({
  sizeUnit: 'px',
  size: 256,
  margin: 16,
  backgroundColor: '#FFFFFF',
  foregroundColor: '#05BE71',
  logoImage: '',
  logoSize: 0.2,
  logoBackgroundColor: 'transparent',
  logoCornerRadius: 8,
  correctLevel: 'M',
  auto: true,
})

// 生成邀请链接
const inviteUrl = ref('')

onMounted(() => {
  generateInviteUrl()
})

function generateInviteUrl() {
  // 生成邀请链接，这里使用用户ID和一些参数
  const baseUrl = 'https://your-app.com/invite'
  inviteUrl.value = `${baseUrl}?userId=${userInfo.value.id}&ref=qrcode`
}

// 复制号码
async function copyId() {
  try {
    await uni.setClipboardData({
      data: userInfo.value.id,
    })
    uni.showToast({
      title: '已复制到剪贴板',
      icon: 'success',
    })
  } catch {
    uni.showToast({
      title: '复制失败',
      icon: 'error',
    })
  }
}

// 分享功能
function handleShare() {
  uni.showActionSheet({
    itemList: ['分享到微信好友', '分享到朋友圈', '保存图片'],
    success: (res) => {
      switch (res.tapIndex) {
        case 0:
          shareToFriend()
          break
        case 1:
          shareToTimeline()
          break
        case 2:
          saveQRCode()
          break
      }
    },
  })
}

// 分享到好友
function shareToFriend() {
  uni.share({
    provider: 'weixin',
    scene: 'WXSceneSession',
    type: 0,
    href: inviteUrl.value,
    title: shareOptions.title,
    summary: '快来加入我们吧！',
    imageUrl: shareOptions.imageUrl,
    success: () => {
      uni.showToast({
        title: '分享成功',
        icon: 'success',
      })
    },
  })
}

// 分享到朋友圈
function shareToTimeline() {
  uni.share({
    provider: 'weixin',
    scene: 'WXSceneTimeline',
    type: 0,
    href: inviteUrl.value,
    title: shareOptions.title,
    summary: '快来加入我们吧！',
    imageUrl: shareOptions.imageUrl,
    success: () => {
      uni.showToast({
        title: '分享成功',
        icon: 'success',
      })
    },
  })
}

// 下载/保存二维码
function saveQRCode() {
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

// 返回
function goBack() {
  uni.navigateBack()
}
</script>

<template>
  <view class="min-h-screen bg-white flex flex-col">
    <!-- 顶部导航 -->
    <view class="flex justify-between items-center px-4 h-17">
      <view class="w-6 h-6 flex items-center justify-center" @tap="goBack">
        <wd-icon name="arrow-left" size="24px" color="#2D2D2D"></wd-icon>
      </view>
      <text class="font-medium text-base leading-6 text-[#2D2D2D]">Request</text>
      <view class="w-6 h-6"></view>
    </view>

    <!-- 主要内容 -->
    <view class="flex-1 flex flex-col items-center pt-12.5 px-15 gap-8">

      <!-- 二维码容器 -->
      <view class="w-64 h-64 bg-white rounded-4 flex items-center justify-center shadow-sm">
        <uQrcode
          ref="uqrcodeRef"
          canvas-id="invite-qrcode"
          :value="inviteUrl"
          :options="qrOptions"
          class="w-64 h-64"
        />
      </view>

      <!-- 用户信息 -->
      <view class="flex flex-col items-center gap-4">
        <text class="font-medium text-5 leading-7.5 text-[#2D2D2D] text-center">
          {{ userInfo.name }}
        </text>
        <view class="flex items-center gap-3">
          <text class="font-normal text-3.5 leading-5.25 text-[#606060]">
            {{ userInfo.id }}
          </text>
          <view class="w-5 h-5 flex items-center justify-center active:opacity-70" @tap="copyId">
            <wd-icon name="copy" size="16px" color="#05BE71"></wd-icon>
          </view>
        </view>
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
        Share
      </wd-button>

      <wd-button type="primary" size="large" custom-class="download-btn" @click="saveQRCode">
        <wd-icon
          name="download"
          size="16px"
          color="#05BE71"
          custom-style="margin-right: 8px;"
        ></wd-icon>
        Download
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
  "style": {
    "navigationBarTitleText": "邀请二维码",
    "navigationStyle": "custom"
  }
}
</route>
