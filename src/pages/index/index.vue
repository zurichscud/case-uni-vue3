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
          <text class="subtitle-text">专业理赔咨询服务平台</text>
        </view>
      </view>

      <!-- 快捷功能按钮 -->
      <view class="icon-buttons">
        <view class="icon-btn" @click="router.go('/pages/index/submit/poster')">
          <text class="iconfont icon-renwujihua icon-white"></text>
          <text class="btn-text">提交案件</text>
        </view>

        <view class="icon-btn" @click="router.go('/pages/AI/AiChatDS')">
          <text class="iconfont icon-rengongzhineng1 icon-white"></text>
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
import { ref } from 'vue'
import { onShow, onLoad } from '@dcloudio/uni-app'
import * as ArticleAPI from '@/apis/article'
import typicalCase from './components/typical-case.vue'
import router from '@/utils/router'
import img from '@/static/home/弈寻.png'
import { useMessageStore } from '@/stores'

const { getUnReadNumData } = useMessageStore()
const articleList = ref([])
const query = {
  isAsc: 'desc',
  orderByColumn: 'updateTime',
  pageSize: 3,
  pageNum: 1,
}

function handleShare() {
  uni.showToast({
    title: '敬请期待!',
    icon: 'none',
  })
}

async function getArticleListData() {
  const { rows } = await ArticleAPI.getArticleList(query, { isTop: 1 })
  articleList.value = rows
}

onLoad(() => {
  getArticleListData()
})

onShow(() => {
  getUnReadNumData()
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
/* 按钮样式重置 */
button[plain] {
  border: none;
  background-color: white;
}

uni-button:after {
  border: none;
  line-height: 0;
}

.uni-button {
  line-height: 0 !important;
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

/* 弹窗内容样式 - 欢迎使用理赔公社 */
.child_box {
  text-align: center;
  width: 606rpx;
  position: relative;
  height: 370rpx;

  /* 弹窗顶部图片 */
  .child_img {
    width: 340rpx;
    height: 340rpx;
    position: absolute;
    top: -160rpx;
    left: 0;
    right: 0;
    margin: 0 auto;
  }

  /* 弹窗主要内容 */
  .child_main {
    text-align: center;
    position: relative;
    top: 150rpx;
    z-index: 100;

    .child_title {
      font-size: 36rpx;
      color: #3d3d3d;
      margin-bottom: 10rpx;
      font-weight: bold;
    }

    .child_text {
      font-size: 28rpx;
      color: #999999;
    }

    /* 按钮区域 */
    .child_flex {
      font-size: 28rpx;
      display: flex;
      justify-content: space-between;
      margin-top: 52rpx;

      /* 拒绝按钮 */
      .child_btnerr {
        box-sizing: border-box;
        width: 266rpx;
        height: 72rpx;
        line-height: 64rpx;
        border-radius: 400rpx;
        border: 2px solid #d8d8d8;
        color: #999999;
      }

      /* 确认按钮 */
      .child_btnnext {
        box-sizing: border-box;
        width: 266rpx;
        height: 72rpx;
        line-height: 72rpx;
        color: white;
        border-radius: 400rpx;
        background: linear-gradient(139deg, #6bb3ff 0%, #1486ff 100%);
        box-shadow: 0px 2px 7px 0px rgba(0, 115, 238, 0.27);
      }
    }
  }
}

/* 弹窗内容样式 - 温馨提示类 */
.child4 {
  text-align: center;

  /* 按钮组样式 */
  .font_alert_flex {
    display: flex;
    justify-content: space-between;
    margin: 40rpx 0 10rpx 0;

    /* 取消按钮 */
    .font_alert_btn1 {
      box-sizing: border-box;
      width: 280rpx;
      height: 74rpx;
      border-radius: 400rpx;
      border: 1px solid #999999;
      line-height: 70rpx;
      color: #999999;
    }

    /* 确认按钮 */
    .font_alert_btn2 {
      box-sizing: border-box;
      width: 280rpx;
      height: 74rpx;
      border-radius: 400rpx;
      line-height: 74rpx;
      background: linear-gradient(134deg, #f8faff 0%, #78b9fd 0%, #3f9cff 100%);
      color: white;
    }
  }

  /* 时间文字样式 */
  .font_alert_time {
    color: black;
    font-size: 28rpx;
    margin: 18rpx 0;
  }

  /* 状态文字样式 */
  .statu_font {
    font-size: 34rpx;
    margin-top: 30rpx;
  }

  /* 审核状态样式 */
  .font_alert_statu {
    font-size: 36rpx;
    color: #ff0000;
    margin: 20rpx 0;
    font-weight: bold;
  }

  /* 审核备注样式 */
  .font_alert_remark {
    font-size: 28rpx;
    color: red;
    margin-bottom: 10rpx;
  }
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

        .subtitle-text {
          font-size: 28rpx;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 400;
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

/* 图片右侧文字样式 */
.imgRight {
  position: relative;
  top: -6rpx;
}
</style>
