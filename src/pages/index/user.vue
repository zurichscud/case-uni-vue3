<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores'
import appConfig from '@/config/app'
import router from '@/utils/router'
import * as caseAPI from '@/apis/case'

const userStore = useUserStore()
const isLogin = computed(() => userStore.isLogin)
const remarkText = computed(() => userStore.remarkText)
const expertPhone = ref(null)

const menus = ref([
  [
    {
      name: '邀请好友',
      url: '/pages/invite/fuli',
      icon: 'icon-paper',
      handle: () => router.push('/pages/invite/fuli'),
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
  ],
])

function makePhone() {
  if (!expertPhone.value) {
    return
  }
  uni.makePhoneCall({
    phoneNumber: expertPhone.value,
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
    <view v-if="!isLogin">
      <NoLogin />
    </view>

    <!-- 已登录状态 -->
    <view class="user-profile" v-else>
      <!-- 用户信息头部 -->
      <div class="head"></div>
      <view class="profile-header">
        <view class="user-info">
          <view class="user-title">
            <image class="avatar" :src="userStore.photo || appConfig.defaultAvatar" />
            <view class="nickname">
              <view>{{ userStore.nickName }}</view>
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
  // background-image: url('https://app.y9net.cn/data/01/31/wKgBNmNYnZuAUfn1AADiYPNcOwQ092.png');
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
.head {
  position: absolute;
  width: 100%;
  height: 500px;
  left: 0px;
  top: -100px;
  // background: linear-gradient(180deg, rgba(247, 133, 69, 0.89) 0%, rgba(196, 196, 196, 0) 100%);
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
