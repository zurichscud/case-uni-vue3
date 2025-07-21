<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import uQrcode from '@/uni_modules/Sansnn-uQRCode/components/u-qrcode/u-qrcode.vue'

// 定义组件 props
const props = defineProps({
  qrCodeUrl: {
    type: String,
    required: true,
  },
})
const visible = defineModel('visible', {
  type: Boolean,
  default: false,
})

// 定义组件事件
const emit = defineEmits(['close'])

// 组件内部状态
const qrcode = ref(null)

// 生成二维码
function generateQRCode() {
  return new Promise((resolve) => {
    if (qrcode.value) {
      qrcode.value.make({
        success: () => {
          console.log('二维码生成成功')
          resolve()
        },
        fail: (err) => {
          console.error('二维码生成失败', err)
          resolve()
        },
      })
    }
    else {
      resolve()
    }
  })
}

// 二维码生成完成回调
function onQRCodeComplete() {
  console.log('二维码组件完成')
}

// 关闭海报预览
function handleClose() {
  emit('close')
}

// 生成海报时等待二维码准备就绪
async function handleShow() {
  if (props.visible) {
    // 等待DOM更新后生成二维码
    await nextTick()
    await generateQRCode()
  }
}

// 监听 visible 变化
watch(() => props.visible, handleShow)

// 保存海报到相册
async function savePosterToAlbum() {
  try {
    uni.showLoading({
      title: '生成中...',
    })

    // 生成海报图片
    const posterImage = await generatePosterImage()

    if (posterImage) {
      // 保存到相册
      uni.saveImageToPhotosAlbum({
        filePath: posterImage,
        success: () => {
          uni.hideLoading()
          uni.showToast({
            title: '保存成功',
            icon: 'success',
          })
          handleClose()
        },
        fail: (err) => {
          uni.hideLoading()
          console.error('保存失败', err)
          uni.showToast({
            title: '保存失败',
            icon: 'none',
          })
        },
      })
    }
  }
  catch (error) {
    uni.hideLoading()
    console.error('生成海报失败', error)
    uni.showToast({
      title: '生成失败',
      icon: 'none',
    })
  }
}

function generatePosterImage() {

}
</script>

<template>
  <!-- 海报预览弹窗 -->
  <wd-popup
    v-model="visible"
    position="center"
    closable
    custom-style="border-radius: 20rpx; background: transparent;"
    @close="handleClose"
  >
    <view class="poster-preview">
      <view class="poster-container">
        <!-- 海报内容 -->
        <view class="poster-content" id="poster-content">
          <!-- 背景 -->
          <view class="poster-bg">
            <!-- 头部logo和标题 -->
            <view class="poster-header">
              <view class="poster-logo">
                <text class="poster-title">
                  理赔公社
                </text>
                <text class="poster-subtitle">
                  专业理赔服务平台
                </text>
              </view>
            </view>

            <!-- 邀请文案 -->
            <view class="poster-invite">
              <text class="invite-main">
                邀请您加入理赔公社
              </text>
              <text class="invite-sub">
                汇集行业保险理赔实战专家
              </text>
              <text class="invite-desc">
                专业团队为您提供理赔咨询服务
              </text>
            </view>

            <!-- 二维码区域 -->
            <view class="poster-qr-section">
              <view class="qr-container">
                <uQrcode
                  ref="qrcode"
                  canvas-id="qrcode-canvas"
                  :value="qrCodeUrl"
                  :size="100"
                  @complete="onQRCodeComplete"
                />
                <canvas
                  canvas-id="poster-canvas"
                  id="poster-canvas"
                  :style="{ width: '600rpx', height: '800rpx' }"
                  v-show="false"
                />
              </view>
              <text class="qr-tip">
                长按识别二维码加入我们
              </text>
            </view>
          </view>
        </view>
      </view>

      <!-- 操作按钮 -->
      <view class="poster-actions">
        <view class="poster-btn save-btn" @tap="savePosterToAlbum">
          <text>💾</text>
          <text>保存到相册</text>
        </view>
      </view>
    </view>
  </wd-popup>
</template>

<style scoped lang="scss">
/* 海报预览样式 */
.poster-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.poster-container {
  background: #ffffff;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 10rpx 40rpx rgba(0, 0, 0, 0.1);
  margin-bottom: 40rpx;
}

.poster-content {
  width: 600rpx;
  height: 800rpx;
  position: relative;
  overflow: hidden;
}

.poster-bg {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #4285f4 0%, #1c35d0 50%, #0d1a6b 100%);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60rpx 40rpx;
  box-sizing: border-box;
}

.poster-header {
  text-align: center;
  margin-bottom: 80rpx;
}

.poster-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.poster-title {
  font-size: 48rpx;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 16rpx;
}

.poster-subtitle {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
}

.poster-invite {
  text-align: center;
  margin-bottom: 80rpx;
}

.invite-main {
  font-size: 32rpx;
  font-weight: bold;
  color: #ffffff;
  display: block;
  margin-bottom: 20rpx;
}

.invite-sub {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.9);
  display: block;
  margin-bottom: 12rpx;
}

.invite-desc {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
  display: block;
}

.poster-qr-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.qr-container {
  background: #ffffff;
  border-radius: 20rpx;
  padding: 20rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.qr-tip {
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
}

.poster-actions {
  display: flex;
  gap: 30rpx;
}

.poster-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  padding: 24rpx 40rpx;
  border-radius: 50rpx;
  font-size: 28rpx;
  cursor: pointer;
  transition: all 0.3s ease;
}

.save-btn {
  background: linear-gradient(135deg, #4285f4, #1c35d0);
  color: #ffffff;

  &:active {
    transform: scale(0.95);
  }
}
</style>
