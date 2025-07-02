<template>
  <view class="container">
    <!-- 未登录状态 -->
    <view v-if="!isLogin">
      <none name="请登录账号后查看~"></none>
      <view class="login-btn" @click="toLogin">立即登录</view>
    </view>

    <!-- 已登录状态 -->
    <view class="user-profile" v-else>
      <!-- 用户信息头部 -->
      <view class="profile-header centerBox">
        <view class="user-info">
          <view class="user-title">
            <image class="avatar" :src="userStore.photo" />
            <view class="nickname">
              <view>{{ userStore.nickName }}</view>
              <wd-tag mark>{{ remarkText }}</wd-tag>
            </view>
          </view>
          <view class="settings-btn" @click="router.go('/pages/user/userInfo')">
            <i class="iconfont icon-shezhi1"></i>
          </view>
        </view>
      </view>

      <!-- 菜单列表 -->
      <view class="menu-list">
        <view v-for="(group, index) in menuGroups" :key="index">
          <view class="menu-card">
            <view class="menu-item" v-for="(item, i) in group" :key="i" @click="redirect(item.url)">
              <view class="item-content">
                <image
                  class="menu-icon"
                  :style="{
                    width: i === 0 ? '42rpx' : '44rpx',
                    height: '44rpx',
                  }"
                  :src="item.img"
                />
                <text>{{ item.name }}</text>
                <image src="../../static/right.png" class="arrow-icon" />
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores'
import router from '@/utils/router'

const userStore = useUserStore()
const isLogin = computed(() => userStore.isLogin)
const remarkText = computed(() => userStore.remarkText)

const menuGroups = ref([
  [
    {
      name: '邀请好友',
      url: '/pages/invite/fuli',
      img: '../../static/my/img12.png',
    },
  ],
])

function redirect(url) {
  router.go(url)
}

function toLogin() {
  router.go('/pages/login/login')
}
</script>

<style lang="scss" scoped>
.icon-shezhi1 {
  font-size: 50rpx;
}

.container {
  width: 100%;
  box-sizing: border-box;
}

.login-btn {
  width: 544rpx;
  height: 88rpx;
  border-radius: 120rpx;
  background-color: #3f9cff;
  text-align: center;
  line-height: 88rpx;
  color: #fff;
  font-size: 32rpx;
  margin: 30rpx auto;
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
  background-image: url('https://app.y9net.cn/data/01/31/wKgBNmNYnZuAUfn1AADiYPNcOwQ092.png');

  .user-info {
    position: relative;
    padding: 24rpx 32rpx;
    box-sizing: border-box;
    width: 100%;

    .settings-btn {
      position: absolute;
      top: 32%;
      right: 80rpx;
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

  .menu-item {
    height: 108rpx;
    line-height: 108rpx;
    color: #666666;
    font-size: 32rpx;
  }
}

.menu-card {
  box-shadow: 0px 3px 22px 0px rgba(0, 0, 0, 0.05);
  border-radius: 20rpx;
  z-index: 100;
  background-color: white;
  overflow: hidden;
  margin-bottom: 20rpx;

  .menu-item {
    padding: 0 20rpx;
    position: relative;

    .item-content {
      position: relative;

      .menu-icon {
        width: 44rpx;
        height: 44rpx;
        vertical-align: middle;
        margin-right: 32rpx;
        margin-left: 48rpx;
        margin-bottom: 6rpx;
      }

      .arrow-icon {
        width: 12rpx;
        height: 24rpx;
        position: absolute;
        right: 38rpx;
        top: 44rpx;
      }
    }
  }

  .menu-item:not(:last-child) {
    .item-content {
      border-bottom: 1px solid #eeeeee;
    }
  }
}
</style>
