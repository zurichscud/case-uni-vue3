<script setup lang="ts">
import router from '@/utils/router'
import { useUserStore } from '@/stores'
import { REMARK } from '@/enums/remark'
import { subscribeTemplate } from '@/config/wechat'
import MenuItem from './components/MenuItem.vue'
import * as LPGSAPI from '@/apis/lpgs'

const userStore = useUserStore()
const isLogin = computed(() => userStore.isLogin)
const remark = computed(() => userStore.remark)



// 全部案件
function handleCase() {
  router.push('/pages/case/list')
}

//我的团队
function handleTeam() {
  router.push('/pages/team/list')
}

//邀请记录
function handleInvite() {
  if (remark.value === REMARK.BaoMin) {
    return uni.showToast({
      title: '请先成为社员',
      icon: 'none',
    })
  }
  router.push('/pages/invite/list')
}

// 邀请二维码
function handleQRcode() {
  if (remark.value === REMARK.BaoMin) {
    return uni.showToast({
      title: '请先成为社员',
      icon: 'none',
    })
  }
  router.push('/pages/team/qrcode')
}

// 社员政策
function handleSheyuan() {
  router.push('/pages/policy/sheyuan')
}

// 分社社长政策
function handleFenshe() {
  if (remark.value === REMARK.BaoMin) {
    uni.showModal({
      title: '提示',
      content: '升级成为社员即可查看',
      showCancel: false,
    })
  } else {
    router.push('/pages/policy/fenshe')
  }
}

// 联社社长政策
function handleLianshe() {
  if (remark.value === REMARK.BaoMin || remark.value === REMARK.SheYuan) {
    uni.showModal({
      title: '提示',
      content: '升级成为分社社长即可查看',
      showCancel: false,
    })
  } else {
    router.push('/pages/policy/lianshe')
  }
}
// 赔案快报
function handleQuickNews() {
  if (remark.value === REMARK.BaoMin) {
    return uni.showToast({
      title: '请先成为社员',
      icon: 'none',
    })
  }
  router.push('/pages/news/list')
}
</script>

<template>
  <view>
    <NoLogin text="登录后可查看您的工作室" v-if="!isLogin" />
    <view v-else>
      <!-- 案件 -->
      <view class="section-title">案件</view>
      <wd-grid clickable :column="4">
        <MenuItem icon="/static/workplace/case.png" text="全部案件" @itemclick="handleCase()" />
      </wd-grid>

      <!-- 团队 -->
      <view class="section-title">团队</view>
      <wd-grid clickable :column="4">
        <MenuItem icon="/static/workplace/team.png" text="我的团队" @itemclick="handleTeam()" />
        <MenuItem icon="/static/workplace/invite.png" text="邀请记录" @itemclick="handleInvite()" />
        <MenuItem
          icon="/static/workplace/qrcode.png"
          text="邀请二维码"
          @itemclick="handleQRcode()"
        />
      </wd-grid>

      <!-- 奖励与晋升 -->
      <view class="section-title">奖励与晋升</view>
      <wd-grid clickable :column="4">
        <MenuItem
          icon="/static/workplace/sheyuan.png"
          text="社员政策"
          @itemclick="handleSheyuan()"
        />
        <MenuItem
          icon="/static/workplace/fenshe.png"
          text="分社社长政策"
          @itemclick="handleFenshe()"
        />
        <MenuItem
          icon="/static/workplace/lianshe.png"
          text="联社社长政策"
          @itemclick="handleLianshe()"
        />
      </wd-grid>

      <!-- 文章 -->
      <view class="section-title">文章</view>
      <wd-grid clickable :column="4">
        <MenuItem
          icon="/static/workplace/news.png"
          text="赔案快报"
          @itemclick="handleQuickNews()"
        />
      </wd-grid>
    </view>
  </view>
</template>

<style scoped lang="scss">
.container {
  overflow: hidden; /* 解决margin collapse问题 */
}

.iconfont {
  font-size: 50rpx;
}

.section-title {
  font-size: 36rpx;
  font-weight: bold;
  font-family: '钉钉进步体 Regular';
  color: #333;
  margin: 30rpx 0 20rpx 0;
  padding: 0 30rpx;
  position: relative;
}

.section-title::before {
  content: '';
  position: absolute;
  font-family: '钉钉进步体 Regular';
  left: 30rpx;
  bottom: -8rpx;
  width: 40rpx;
  height: 4rpx;
  background: linear-gradient(90deg, #4a90e2 0%, #7ed321 100%);
  border-radius: 2rpx;
}
</style>

<route lang="json">
{
  "name": "workplace",
  "layout": "tabbar",
  "style": {
    "navigationBarTitleText": "工作室"
  }
}
</route>
