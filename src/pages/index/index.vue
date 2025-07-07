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

        <view class="icon-btn" @click="router.go('/pages/AI/AiChatDS')">
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
            @click="router.go('/pages/AI/AiChatDS')"
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
  </view>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { onShow, onLoad, onShareAppMessage } from '@dcloudio/uni-app'
import * as ArticleAPI from '@/apis/article'
import typicalCase from './components/typical-case.vue'
import router from '@/utils/router'
import img from '@/static/home/弈寻.png'
import { useMessageStore, useUserStore } from '@/stores'
import { useShare } from '@/hooks/useShare'
import appConfig from '@/config/app'

const slogans = appConfig.slogans
const sloganDuration = appConfig.sloganDuration
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

// 处理分享功能
function handleShare() {
  uni.share({
    provider: 'weixin',
    scene: 'WXSceneSession',
    type: 0,
    href: 'https://your-app-link.com',
    title: '理赔公社',
    summary: '专业理赔咨询服务平台',
    imageUrl: 'https://your-app-icon.png',
    success: function (res) {
      console.log('分享成功:' + JSON.stringify(res))
    },
    fail: function (err) {
      console.log('分享失败:' + JSON.stringify(err))
    },
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
</style>
