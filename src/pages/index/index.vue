<!-- 首页组件 - 理赔公社应用主页面 -->
<template>
  <view class="content">
    <!-- 顶部头部区域 -->
    <view class="header-section">
      <!-- 标题栏 -->
      <view class="header-top">
        <view class="header-title">
          <text class="title-main">理赔公社</text>
        </view>
        <view class="header-subtitle">
          <view class="subtitle-scroll-container">
            <text
              class="subtitle-text"
              :class="{ 'fade-in': isTextVisible }"
              :key="currentSubtitleIndex"
            >
              {{ slogans[currentSubtitleIndex] }}
            </text>
          </view>
        </view>
      </view>

      <!-- 快捷功能按钮 -->
      <view class="icon-buttons">
        <view class="icon-btn" @click="router.go('/pages/index/submit/poster')">
          <text class="iconfont icon-renwujihua icon-white"></text>
          <text class="btn-text">提交案件</text>
        </view>

        <view class="icon-btn" @click="router.go('/pages/AI/chat')">
          <text class="iconfont icon-mind2-full icon-white"></text>
          <text class="btn-text">弈寻AI</text>
        </view>

        <view class="icon-btn" @click="handleShare">
          <text class="iconfont icon-fenxiang icon-white"></text>
          <text class="btn-text">邀请好友</text>
        </view>
      </view>
    </view>

    <!-- 主要内容区域 -->
    <view class="index_box">
      <swiper class="swiper" autoplay="true" circular="true" current="idindex">
        <swiper-item>
          <image
            show-menu-by-longpress="true"
            lazy-load
            mode="aspectFit"
            @click="router.go('/pages/AI/chat')"
            :src="img"
          ></image>
        </swiper-item>
      </swiper>

      <!-- <wd-swiper
        :list="swiperList"
        autoplay
        v-model:current="current"
        :indicator="{ type: 'dots-bar' }"
        @click="handleClick"
      ></wd-swiper> -->

      <!-- 典型案例区域 -->
      <view class="" style="margin-top: 30rpx">
        <!-- 标题栏 -->
        <view class="view_title">
          <view class="view_title_left">
            <!-- 蓝色装饰条 -->
            <view class="view_title_left_block"></view>
            <view class="title_text">典型案例</view>
          </view>
          <!-- 更多案例链接 -->
          <view class="view_title_right" @click="router.go('/pages/index/article/more')">
            <text>更多案例</text>
            <text class="iconfont icon-jiantou_liebiaoxiangyou"></text>
          </view>
        </view>

        <!-- 案例列表 -->
        <view class="box_page">
          <view v-for="(item, index) in articleList" :key="index" class="boxlist">
            <!-- 典型案例组件 -->
            <typical-case :item="item"></typical-case>
          </view>
        </view>
      </view>
    </view>
    <!-- 分享popup -->
    <wd-popup
      :safe-area-inset-bottom="true"
      v-model="shareVisible"
      position="bottom"
      closable
      custom-style="border-radius: 30rpx 30rpx 0 0;"
      @close="handleClose"
    >
      <view class="share-popup">
        <!-- 标题 -->
        <view class="share-title">分享到</view>

        <!-- 分享选项 -->
        <view class="share-options">
          <!-- 分享好友 -->
          <button
            class="share-option"
            open-type="share"
            hover-class="share-option-hover"
            @tap="handleShareToFriend"
          >
            <view class="share-icon">
              <i class="iconfont icon-weixin" style="color: #1aad19"></i>
            </view>
            <text class="share-text">分享好友</text>
          </button>

          <!-- 生成海报 -->
          <button class="share-option" hover-class="share-option-hover" @tap="handleGeneratePoster">
            <view class="share-icon">
              <i class="iconfont icon-weihaibao" style="color: #ff6b35"></i>
            </view>
            <text class="share-text">生成海报</text>
          </button>
        </view>
      </view>
    </wd-popup>

    <!-- 海报预览弹窗 -->
    <wd-popup
      v-model="posterVisible"
      position="center"
      closable
      custom-style="border-radius: 20rpx; background: transparent;"
      @close="handleClosePoster"
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
                  <text class="poster-title">理赔公社</text>
                  <text class="poster-subtitle">专业理赔服务平台</text>
                </view>
              </view>

              <!-- 邀请文案 -->
              <view class="poster-invite">
                <text class="invite-main">邀请您加入理赔公社</text>
                <text class="invite-sub">汇集行业保险理赔实战专家</text>
                <text class="invite-desc">专业团队为您提供理赔咨询服务</text>
              </view>

              <!-- 二维码区域 -->
              <view class="poster-qr-section">
                <view class="qr-container">
                  <uQrcode
                    ref="qrcode"
                    canvas-id="qrcode-canvas"
                    :value="qrCodeUrl"
                    :size="200"
                    :auto="false"
                    :hide="true"
                    @complete="onQRCodeComplete"
                  ></uQrcode>
                  <canvas
                    canvas-id="poster-canvas"
                    id="poster-canvas"
                    :style="{ width: '600rpx', height: '800rpx' }"
                    v-show="false"
                  ></canvas>
                </view>
                <text class="qr-tip">长按识别二维码加入我们</text>
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
  </view>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { onShow, onLoad, onShareAppMessage } from '@dcloudio/uni-app'
import * as ArticleAPI from '@/apis/article'
import typicalCase from './components/typical-case.vue'
import router from '@/utils/router'
import img from '@/static/home/弈寻.png'
import { useMessageStore, useUserStore } from '@/stores'
import { useShare } from '@/hooks/useShare'
import appConfig from '@/config/app'
import uQrcode from '@/uni_modules/Sansnn-uQRCode/components/u-qrcode/u-qrcode.vue'

const slogans = appConfig.slogans
const sloganDuration = appConfig.sloganDuration
const shareVisible = ref(false)
const posterVisible = ref(false)
const { getUnReadNumData } = useMessageStore()
const { shareOptions } = useShare()
const userStore = useUserStore()
const articleList = ref([])
const query = {
  isAsc: 'desc',
  orderByColumn: 'updateTime',
  pageSize: 3,
  pageNum: 1,
}
const isLogin = computed(() => userStore.isLogin)
const currentSubtitleIndex = ref(0)
const isTextVisible = ref(true)
let scrollTimer = null

// 海报相关数据
const qrCodeUrl = computed(() => {
  if (!isLogin.value) {
    return appConfig.share.path
  }
  return `${appConfig.share.path}?pid=${userStore.id}`
})
const qrcode = ref(null)
const posterCanvas = ref(null)

// 处理分享功能
function handleShare() {
  if (!isLogin.value) {
    router.go('/pages/login/login')
    return
  }
  // if (userStore.remark <= 5) {
  //   uni.showToast({
  //     title: '只有社员才能邀请',
  //     icon: 'none',
  //   })
  //   return
  // }
  shareVisible.value = true
}

function handleClose() {
  shareVisible.value = false
}

// 处理分享给好友
function handleShareToFriend() {
  shareVisible.value = false
  // 微信小程序会自动触发onShareAppMessage
}

// 处理生成海报
async function handleGeneratePoster() {
  if (!isLogin.value) {
    router.go('/pages/login/login')
    return
  }

  shareVisible.value = false
  posterVisible.value = true

  // 等待DOM更新后生成二维码
  await nextTick()
  await generateQRCode()
}

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
    } else {
      resolve()
    }
  })
}

// 二维码生成完成回调
function onQRCodeComplete() {
  console.log('二维码组件完成')
}

// 关闭海报预览
function handleClosePoster() {
  posterVisible.value = false
}

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
          posterVisible.value = false
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
  } catch (error) {
    uni.hideLoading()
    console.error('生成海报失败', error)
    uni.showToast({
      title: '生成失败',
      icon: 'none',
    })
  }
}

// 生成海报图片
function generatePosterImage() {
  return new Promise((resolve) => {
    // 获取二维码图片
    if (qrcode.value) {
      qrcode.value.toTempFilePath({
        success: (qrRes) => {
          // 绘制海报
          drawPoster(qrRes.tempFilePath, resolve)
        },
        fail: (err) => {
          console.error('获取二维码图片失败', err)
          resolve(null)
        },
      })
    } else {
      resolve(null)
    }
  })
}

// 绘制海报
function drawPoster(qrImagePath, callback) {
  const ctx = uni.createCanvasContext('poster-canvas')
  const canvasWidth = 600
  const canvasHeight = 800

  // 设置背景色
  ctx.setFillStyle('#4285f4')
  ctx.fillRect(0, 0, canvasWidth, canvasHeight)

  // 绘制渐变背景
  const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight)
  gradient.addColorStop(0, '#4285f4')
  gradient.addColorStop(0.5, '#1c35d0')
  gradient.addColorStop(1, '#0d1a6b')
  ctx.setFillStyle(gradient)
  ctx.fillRect(0, 0, canvasWidth, canvasHeight)

  // 绘制标题
  ctx.setFillStyle('#ffffff')
  ctx.setFontSize(48)
  ctx.setTextAlign('center')
  ctx.fillText('理赔公社', canvasWidth / 2, 120)

  ctx.setFontSize(24)
  ctx.fillText('专业理赔服务平台', canvasWidth / 2, 160)

  // 绘制邀请文案
  ctx.setFontSize(32)
  ctx.fillText('邀请您加入理赔公社', canvasWidth / 2, 250)

  ctx.setFontSize(24)
  ctx.fillText('汇集行业保险理赔实战专家', canvasWidth / 2, 290)
  ctx.fillText('专业团队为您提供理赔咨询服务', canvasWidth / 2, 320)

  // 绘制二维码背景
  ctx.setFillStyle('#ffffff')
  ctx.fillRect((canvasWidth - 240) / 2, 380, 240, 240)

  // 绘制二维码
  ctx.drawImage(qrImagePath, (canvasWidth - 200) / 2, 400, 200, 200)

  // 绘制二维码提示文字
  ctx.setFillStyle('#ffffff')
  ctx.setFontSize(20)
  ctx.fillText('长按识别二维码加入我们', canvasWidth / 2, 680)

  ctx.draw(false, () => {
    setTimeout(() => {
      uni.canvasToTempFilePath({
        canvasId: 'poster-canvas',
        success: (res) => {
          callback(res.tempFilePath)
        },
        fail: (err) => {
          console.error('生成海报图片失败', err)
          callback(null)
        },
      })
    }, 500)
  })
}

// 启动滚动文字
function startScrollText() {
  scrollTimer = setInterval(() => {
    isTextVisible.value = false
    setTimeout(() => {
      currentSubtitleIndex.value = (currentSubtitleIndex.value + 1) % slogans.length
      isTextVisible.value = true
    }, 300) // 淡出过渡时间
  }, sloganDuration) // 每3秒切换一次
}

// 停止滚动文字
function stopScrollText() {
  if (scrollTimer) {
    clearInterval(scrollTimer)
    scrollTimer = null
  }
}

async function getArticleListData() {
  const { rows } = await ArticleAPI.getArticleList(query, { isTop: 1 })
  articleList.value = rows
}

onLoad(() => {
  getArticleListData()
})

onShow(() => {
  if (isLogin.value) {
    getUnReadNumData()
  }
  startScrollText() // 页面显示时启动滚动
})

onMounted(() => {
  startScrollText()
})

onUnmounted(() => {
  stopScrollText()
})

onShareAppMessage(() => {
  return shareOptions
})
</script>

<!-- 全局页面样式 -->
<style>
page {
  overflow: hidden;
  background-color: white;
}
</style>

<!-- 组件样式 -->
<style lang="scss" scoped>
/* 标题区域样式 */
.view_title {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .title_text {
    font-size: 32rpx;
    font-weight: bold;
  }

  /* 标题左侧样式 */
  .view_title_left {
    display: flex;
    justify-content: flex-start;
    font-size: 36rpx;
    color: #111111;
    align-items: center;

    /* 蓝色装饰条 */
    .view_title_left_block {
      display: inline-block;
      width: 8rpx;
      height: 40rpx;
      border-radius: 22rpx;
      background-image: linear-gradient(#84c0ff, #3f9cff);
      margin-top: 4rpx;
      margin-right: 10rpx;
    }
  }

  /* 标题右侧样式 */
  .view_title_right {
    display: flex;
    align-items: center;
    text-align: right;
    font-size: 26rpx;
    color: #000;

    text:first-child {
      margin-right: 8rpx;
    }

    .iconfont {
      font-size: 24rpx;
      line-height: 1;
    }
  }
}

/* 案例列表容器样式 */
.box_page {
  margin-top: 24rpx;
}

/* 主要内容区域样式 */
.index_box {
  position: relative;
  box-sizing: border-box;
  padding: 0 40rpx;
  border-top-left-radius: 40rpx;
  border-top-right-radius: 40rpx;
  background-color: white;
  border: 1px solid transparent;
  margin-top: -40rpx; /* 增加负边距，确保白色区域完全覆盖，消除圆角处的白色 */
  z-index: 2; /* 确保白色区域在头部之上 */
}

/* 页面主容器样式 */
.content {
  background: #ffffff;
  height: 100vh;
  overflow: auto;
  padding-top: 0; // 移除之前的padding-top，因为现在有头部了

  /* 头部区域样式 */
  .header-section {
    background: linear-gradient(135deg, #4285f4 0%, #1c35d0 50%, #0d1a6b 100%); /*1a31cc */
    padding: 0 40rpx 100rpx; /* 进一步增加底部间距，确保完全覆盖圆角区域 */
    position: relative;
    overflow: hidden; /* 确保极光效果不会溢出 */

    /* 极光动画效果 */
    &::before {
      content: '';
      position: absolute;
      top: -100%;
      right: -100%;
      width: 300%;
      height: 300%;
      background: linear-gradient(
        45deg,
        transparent 30%,
        rgba(255, 255, 255, 0.1) 35%,
        rgba(135, 206, 250, 0.15) 40%,
        rgba(0, 191, 255, 0.2) 45%,
        rgba(255, 255, 255, 0.25) 50%,
        rgba(135, 206, 250, 0.15) 55%,
        rgba(0, 191, 255, 0.1) 60%,
        transparent 65%
      );
      animation: aurora-sweep 8s ease-in-out infinite;
      transform-origin: top right;
      pointer-events: none; /* 确保不会阻挡点击事件 */
    }

    /* 第二层极光效果，增加层次感 */
    &::after {
      content: '';
      position: absolute;
      top: -80%;
      right: -80%;
      width: 260%;
      height: 260%;
      background: linear-gradient(
        45deg,
        transparent 40%,
        rgba(255, 255, 255, 0.05) 45%,
        rgba(173, 216, 230, 0.1) 50%,
        rgba(255, 255, 255, 0.08) 55%,
        transparent 60%
      );
      animation: aurora-sweep-secondary 12s ease-in-out infinite reverse;
      transform-origin: top right;
      pointer-events: none;
    }

    /* 标题栏样式 */
    .header-top {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 140rpx 0 40rpx 0;

      .header-title {
        display: flex;
        align-items: baseline;

        .title-main {
          font-size: 44rpx;
          font-weight: bold;
          font-family: '钉钉进步体 Regular';
          color: #ffffff;
        }

        .title-location {
          font-size: 32rpx;
          color: #e8f4fd;
          margin-left: 8rpx;
        }
      }

      .header-subtitle {
        margin-top: 16rpx;

        .subtitle-scroll-container {
          text-align: center;
          height: 48rpx; /* 固定高度防止布局抖动 */
          display: flex;
          align-items: center;
          justify-content: center;

          .subtitle-text {
            font-size: 28rpx;
            color: rgba(255, 255, 255, 0.8);
            font-weight: 400;
            transition: opacity 0.3s ease-in-out;
            opacity: 0;

            &.fade-in {
              opacity: 1;
            }
          }
        }
      }
    }

    /* 图标按钮样式 */
    .icon-buttons {
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 40rpx 0;

      .icon-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;


        // 在前两个按钮后添加分割线
        &:not(:last-child)::after {
          content: '';
          position: absolute;
          right: -50%;
          top: 50%;
          transform: translateY(-50%);
          width: 2rpx;
          height: 80rpx;
          background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.8) 50%,
            rgba(255, 255, 255, 0) 100%
          );
        }

        .icon-white {
          font-size: 60rpx;
          color: #ffffff;
          margin-bottom: 16rpx;
        }

        .btn-text {
          font-size: 28rpx;
          color: #ffffff;
          font-weight: 500;
        }
      }
    }
  }

  /* 轮播图样式 */
  .swiper {
    width: 100%;
    overflow: hidden;
    image {
      width: 100%;
      height: 100%;
    }
  }
}

/* 极光动画关键帧 - 45度倾斜扫过（镜像方向：右上到左下） */
@keyframes aurora-sweep {
  0% {
    transform: translate(70%, -70%);
    opacity: 0;
  }
  10% {
    opacity: 0.3;
  }
  30% {
    transform: translate(35%, -35%);
    opacity: 0.8;
  }
  70% {
    transform: translate(-35%, 35%);
    opacity: 0.8;
  }
  90% {
    opacity: 0.3;
  }
  100% {
    transform: translate(-70%, 70%);
    opacity: 0;
  }
}

/* 第二层极光动画关键帧 - 45度倾斜扫过（镜像方向：右上到左下） */
@keyframes aurora-sweep-secondary {
  0% {
    transform: translate(90%, -90%);
    opacity: 0;
  }
  15% {
    opacity: 0.2;
  }
  40% {
    transform: translate(45%, -45%);
    opacity: 0.6;
  }
  60% {
    transform: translate(-45%, 45%);
    opacity: 0.6;
  }
  85% {
    opacity: 0.2;
  }
  100% {
    transform: translate(-90%, 90%);
    opacity: 0;
  }
}

/* 分享弹窗样式 */
.share-popup {
  padding: 40rpx 40rpx 0;
  background: #ffffff;
}

.share-title {
  text-align: center;
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
  margin-bottom: 40rpx;
}

.share-options {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 40rpx 0;
}

.share-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: transparent;
  border: none;
  padding: 20rpx;
  border-radius: 20rpx;
  transition: all 0.3s ease;
  font-size: inherit;
  line-height: inherit;
  margin: 0;

  &::after {
    border: none;
  }
}

.share-option-hover {
  background: #f5f5f5;
  transform: scale(0.95);
}

.share-icon {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16rpx;
  .iconfont {
    font-size: 80rpx;
  }
}

.share-text {
  font-size: 28rpx;
  color: #333333;
}

.share-cancel {
  text-align: center;
  font-size: 32rpx;
  color: #666666;
  padding: 30rpx 0;
  margin-top: 20rpx;
  border-top: 1rpx solid #f0f0f0;
  cursor: pointer;
}

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
