<!-- 首页组件 - 理赔公社应用主页面 -->
<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { onLoad, onShareAppMessage, onShow } from '@dcloudio/uni-app'
import typicalCase from './components/TypicalCase.vue'
import SharePoster from './components/SharePoster.vue'
import * as ArticleAPI from '@/apis/article'
import img from '@/static/home/弈寻.png'
import { useUserStore } from '@/stores'
import router from '@/utils/router'
import appConfig from '@/config/app'
import TnSwiper from '@tuniao/tnui-vue3-uniapp/components/swiper/src/swiper.vue'

const currentSwiperIndex = ref(0)
const swiperData = [img]
const slogans = appConfig.slogans
const sloganDuration = appConfig.sloganDuration
const shareVisible = ref(false)
const posterVisible = ref(false)
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
const { getOpenid } = userStore
let scrollTimer = null

// 海报相关数据
const qrCodeUrl = computed(() => {
  return String(userStore.id)
})

// 处理分享功能
function handleShare() {
  if (!isLogin.value) {
    router.push('/pages/login/login')
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
function handleGeneratePoster() {
  if (!isLogin.value) {
    router.push('/pages/login/login')
    return
  }

  shareVisible.value = false
  posterVisible.value = true
}

// 关闭海报预览
function handleClosePoster() {
  posterVisible.value = false
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

onShareAppMessage(() => {
  return {
    title: '快来和我一起加入理赔公社吧',
    path: `/pages/invite/inviteYou?pid=${userStore.id}`,
    imageUrl: 'https://app.y9net.cn/data/01/33/wKgBNmNrSeSAbR2TAAEp5UKyBy8155.png',
  }
})

onShow(() => {})

onMounted(() => {
  getArticleListData()
  startScrollText()
  //旧用户完善openId
  if (isLogin.value) {
    getOpenid()
  }
})

onUnmounted(() => {
  stopScrollText()
})
</script>

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
        <view class="icon-btn" @click="router.push('/pages/chat/chatroom')">
          <text class="iconfont icon-renwujihua icon-white" />
          <text class="btn-text">提交案件</text>
        </view>

        <view class="icon-btn" @click="router.push('/pages/AI/chat')">
          <text class="iconfont icon-mind2-full icon-white" />
          <text class="btn-text">弈寻AI</text>
        </view>

        <view class="icon-btn" @click="handleShare">
          <text class="iconfont icon-fenxiang icon-white" />
          <text class="btn-text">邀请好友</text>
        </view>
      </view>
    </view>

    <!-- 主要内容区域 -->
    <view class="index_box">
      <TnSwiper
        v-model="currentSwiperIndex"
        :data="swiperData"
        width="100%"
        height="200"
        @item-click="router.push('/pages/AI/chat')"
      >
        <template #default="{ data }">
          <view class="swiper-data">
            <image class="image" :src="data" mode="aspectFill" />
          </view>
        </template>
      </TnSwiper>

      <!-- 典型案例区域 -->
      <view class="" style="margin-top: 30rpx">
        <!-- 标题栏 -->
        <view class="view_title">
          <view class="view_title_left">
            <!-- 蓝色装饰条 -->
            <view class="view_title_left_block" />
            <view class="title_text">典型案例</view>
          </view>
          <!-- 更多案例链接 -->
          <view class="view_title_right" @click="router.push('/pages/index/article/more')">
            <text>更多案例</text>
            <text class="iconfont icon-jiantou_liebiaoxiangyou" />
          </view>
        </view>

        <!-- 案例列表 -->
        <view class="box_page">
          <view v-for="(item, index) in articleList" :key="index">
            <!-- 典型案例组件 -->
            <typical-case :item="item" />
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
      :z-index="600"
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
              <i class="iconfont icon-weixin" style="color: #1aad19" />
            </view>
            <text class="share-text">分享好友</text>
          </button>

          <!-- 生成海报 -->
          <button class="share-option" hover-class="share-option-hover" @tap="handleGeneratePoster">
            <view class="share-icon">
              <i class="iconfont icon-weihaibao" style="color: #ff6b35" />
            </view>
            <text class="share-text">生成海报</text>
          </button>
        </view>
      </view>
    </wd-popup>

    <!-- 海报组件 -->
    <SharePoster
      v-model:visible="posterVisible"
      :qr-code-url="qrCodeUrl"
      @close="handleClosePoster"
    />
  </view>
</template>

<!-- 全局页面样式 -->
<style>
page {
  overflow: hidden;
  background-color: white;
}
</style>

<!-- 组件样式 -->
<style lang="scss" scoped>
.swiper-data {
  width: 100%;
  height: 100%;
  border-radius: 30rpx;

  .image {
    width: 100%;
    border-radius: inherit;
  }
}
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
  padding: 40rpx 40rpx ;
  border-top-left-radius: 40rpx;
  border-top-right-radius: 40rpx;
  background-color: white;
  border: 1px solid transparent;
  margin-top: -40rpx;
  /* 增加负边距，确保白色区域完全覆盖，消除圆角处的白色 */
  z-index: 2;
  /* 确保白色区域在头部之上 */
}

/* 页面主容器样式 */
.content {
  background: #ffffff;
  height: 100vh;
  overflow: auto;
  padding-top: 0; // 移除之前的padding-top，因为现在有头部了

  /* 头部区域样式 */
  .header-section {
    background: linear-gradient(135deg, #4285f4 0%, #1c35d0 50%, #0d1a6b 100%);
    /*1a31cc */
    padding: 0 40rpx 100rpx;
    /* 进一步增加底部间距，确保完全覆盖圆角区域 */
    position: relative;
    overflow: hidden;
    /* 确保极光效果不会溢出 */

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
      pointer-events: none;
      /* 确保不会阻挡点击事件 */
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
          height: 48rpx;
          /* 固定高度防止布局抖动 */
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
</style>

<route lang="json">
{
  "name": "index",
  "layout": "tabbar",
  "style": {
    "navigationBarTitleText": "理赔公社",
    "navigationStyle": "custom",
    "navigationBarTextStyle": "white",
    "backgroundColor": "#FFFFFF"
  }
}
</route>
