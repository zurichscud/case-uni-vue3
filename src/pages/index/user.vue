<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores'
import appConfig from '@/config/app'
import router from '@/utils/router'
import * as caseAPI from '@/apis/case'
import { REMARK } from '@/enums/remark'

const userStore = useUserStore()
const isLogin = computed(() => userStore.isLogin)
const remark = computed(() => userStore.remark)
const remarkText = computed(() => userStore.remarkText)
const expertPhone = ref(null)
const menus = ref([
  [
    {
      name: '申请成为社员',
      icon: 'icon-shenqing',
      handle: toApply,
    },
    {
      name: '联系我们',
      icon: 'icon-kefu1',
      handle: makePhone,
    },
    {
      name: '问题反馈',
      icon: 'icon-wentifankui',
      openType: 'feedback',
    },
    {
      name: '关注微信',
      icon: 'icon-weixin',
      handle: toGZH,
    },
  ],
])

function toLogin() {
  router.push('/pages/login/login')
}

function toApply() {
  if (!isLogin.value) {
    return uni.showToast({
      title: '请先登录',
      icon: 'none',
    })
  }
  if (remark.value !== REMARK.BaoMin) {
    return uni.showToast({
      title: '您已经是社员了哦～',
      icon: 'none',
    })
  }
  router.push('/pages/lpgs/apply')
}

function makePhone() {
  if (!expertPhone.value) {
    return
  }
  uni.makePhoneCall({
    phoneNumber: expertPhone.value,
  })
}

function toGZH() {
  wx.openOfficialAccountProfile({
    username: 'y919975373019',
    fail: (err) => {
      console.log(err)
    },
  })
}

async function getExpertPhoneData() {
  const { data } = await caseAPI.getExpertPhone()
  expertPhone.value = data
}

onMounted(() => {
  getExpertPhoneData()
})
</script>

<template>
  <view class="container">
    <!-- 未登录状态 -->
    <view v-if="!isLogin" class="not-login">
      <!-- 背景头部 -->
      <div class="head"></div>
      <view class="profile-header">
        <view class="login-section" @click="toLogin">
          <image class="default-avatar" :src="appConfig.defaultAvatar" />
          <view class="login-text">
            <view class="welcome-text">欢迎使用</view>
            <view class="login-tip">登录后享受更多服务</view>
          </view>
          <view class="login-btn" @click="toLogin">立即登录</view>
        </view>
      </view>

      <!-- 菜单列表 -->
      <view class="menu-list">
        <MenuCell :list="menus" />
      </view>
    </view>

    <!-- 已登录状态 -->
    <view v-else class="user-profile">
      <!-- 用户信息头部 -->
      <div class="head"></div>
      <view class="profile-header">
        <view class="user-info">
          <view class="user-title" @click="router.push('/pages/user/userInfo')">
            <image class="avatar" :src="userStore.photo || appConfig.defaultAvatar" />
            <view class="nickname">
              <view>
                <text>{{ userStore.nickName }}</text>
                <text class="iconfont icon-jiantou_liebiaoxiangyou ml-2"></text>
              </view>
              <wd-tag mark>
                {{ remarkText }}
              </wd-tag>
            </view>
          </view>
          <view class="settings-btn" @click="router.push('/pages/user/userInfo')">
            <i class="iconfont icon-shezhi1"></i>
          </view>
        </view>
      </view>

      <!-- 菜单列表 -->
      <view class="menu-list">
        <MenuCell :list="menus" />
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.icon-shezhi1 {
  font-size: 50rpx;
}

.container {
  width: 100%;
  box-sizing: border-box;
}

.not-login {
  width: 100%;
  box-sizing: border-box;
}

.login-section {
  position: relative;
  padding: 24rpx 32rpx;
  box-sizing: border-box;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: 20rpx;
}

.default-avatar {
  width: 108rpx;
  height: 108rpx;
  border-radius: 50%;
  border: 2px solid white;
}

.login-text {
  flex: 1;
  margin-left: 20rpx;
  color: #fff;
}

.welcome-text {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 8rpx;
}

.login-tip {
  font-size: 28rpx;
  opacity: 0.8;
}

.login-btn {
  width: 160rpx;
  height: 68rpx;
  border-radius: 34rpx;
  background-color: rgba(255, 255, 255, 0.2);
  border: 2rpx solid rgba(255, 255, 255, 0.6);
  text-align: center;
  line-height: 68rpx;
  color: #fff;
  font-size: 28rpx;
  backdrop-filter: blur(10rpx);
}

.user-profile {
  width: 100%;
  box-sizing: border-box;
}

.profile-header {
  height: 500rpx;
  color: #fff;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;

  .user-info {
    position: relative;
    padding: 24rpx 32rpx;
    box-sizing: border-box;
    width: 100%;

    .settings-btn {
      position: absolute;
      top: 50%;
      right: 32rpx;
      transform: translateY(-50%);
    }
  }

  .user-title {
    display: flex;
    align-items: center;
    margin-left: 20rpx;
  }

  .avatar {
    width: 108rpx;
    height: 108rpx;
    border-radius: 50%;
    border: 2px solid white;
  }

  .nickname {
    margin-left: 20rpx;
    font-size: 36rpx;
  }
}

.menu-list {
  padding: 0 32rpx;
  position: relative;
  top: -60rpx;
}

.head {
  position: absolute;
  width: 100%;
  height: 500px;
  left: 0px;
  top: -100px;
  background: linear-gradient(180deg, #1c35d0 0%, rgba(196, 196, 196, 0) 100%);
}
</style>

<route lang="json">
{
  "name": "user",
  "layout": "tabbar",
  "style": {
    "navigationBarTitleText": "我的",
    "navigationStyle": "custom"
  }
}
</route>
