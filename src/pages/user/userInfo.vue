<!-- 个人资料编辑 -->
<script setup>
import { useUserStore, useAppStore } from '@/stores'
import { useMessage } from 'wot-design-uni'
import { IS_DEV } from '@/utils/env'
import * as UserAPI from '@/apis/user'
import { uploadImage } from '@/utils/http'
import TnListItem from '@tuniao/tnui-vue3-uniapp/components/list/src/list-item.vue'
import TnAvatar from '@tuniao/tnui-vue3-uniapp/components/avatar/src/avatar.vue'
import { subscribeTemplate } from '@/config/wechat'

const message = useMessage()
const userStore = useUserStore()
const appStore = useAppStore()
const { logout, getUserInfo } = userStore

//修改昵称
async function handleInput() {
  const { value: input } = await message.prompt({
    title: '请输入新昵称',
    inputValue: userStore.nickName,
  })
  if (input === '') {
    return uni.showToast({
      title: '昵称不能为空',
      icon: 'error',
    })
  }
  if (input.length > 10) {
    return uni.showToast({
      title: '昵称不能超过10个字符',
      icon: 'error',
    })
  }
  await UserAPI.updateUserInfo({
    id: userStore.id,
    nickName: input,
  })
  uni.showToast({
    title: '昵称修改成功',
    icon: 'success',
  })
  getUserInfo()
}

//退出登录
function handleLogout() {
  uni.showModal({
    title: '提示',
    content: '确定退出登录吗？',
    success: ({ confirm }) => {
      if (confirm) {
        logout()
      }
    },
  })
}

//选择头像
async function handleChooseAvatar({ detail }) {
  const { data } = await uploadImage(detail.avatarUrl)
  await UserAPI.updateUserInfo({
    id: userStore.id,
    photo: data,
  })
  uni.showToast({
    title: '修改成功',
    icon: 'success',
  })
  getUserInfo()
}

//手机号
function handlePhone() {
  uni.showToast({
    title: '手机号暂不支持更换',
    icon: 'none',
  })
}

//打开授权设置
function handleOpenSetting() {
  uni.openSetting()
}

//清空缓存
function handleClearCache() {
  uni.showModal({
    title: '提示',
    content: '确定清空缓存吗？',
    success: ({ confirm }) => {
      if (confirm) {
        uni.clearStorageSync()
        userStore.resetInfo()
        uni.showToast({
          title: '缓存已清空',
          icon: 'success',
        })
        setTimeout(() => {
          router.push('/pages/index/user')
        }, 1000)
      }
    },
  })
}

function handleDev() {
  // uni.navigateTo({
  //   url: `/pages/invite/inviteYou?name=${userStore.nickName}`,
  // })
  router.push('/pages/invite/onboarding')
  // uni.requestSubscribeMessage({
  //   tmplIds: subscribeTemplate,
  //   success: (res) => {
  //     console.log(res)
  //   },
  //   fail: ({ errMsg, errCode }) => {
  //     console.log(errMsg, errCode)
  //     uni.showToast({
  //       title: '订阅失败',
  //       icon: 'none',
  //     })
  //   },
  // })
}

onMounted(() => {
  getUserInfo()
})
</script>

<template>
  <view class="editPersonal">
    <view class="content">
      <view class="list">
        <button
          class="button-clear-style"
          open-type="chooseAvatar"
          @chooseavatar="handleChooseAvatar"
        >
          <TnListItem bottom-border bottom-border-indent>
            <view class="flex items-center">
              <view class="flex-1">头像</view>
              <TnAvatar :url="userStore.photo" />
              <text class="iconfont icon-jiantou_liebiaoxiangyou"></text>
            </view>
          </TnListItem>
        </button>
        <!-- 昵称 -->
        <TnListItem bottom-border bottom-border-indent @click="handleInput">
          <view class="flex items-center">
            <text class="flex-1">昵称</text>
            <text>{{ userStore.nickName }}</text>
            <text class="iconfont icon-jiantou_liebiaoxiangyou"></text>
          </view>
        </TnListItem>
        <!-- 手机号 -->
        <TnListItem bottom-border bottom-border-indent @click="handlePhone">
          <view class="flex items-center">
            <text class="flex-1">手机号</text>
            <text>{{ userStore.mobile }}</text>
            <text class="iconfont icon-jiantou_liebiaoxiangyou"></text>
          </view>
        </TnListItem>
        <!-- 设置 -->
        <TnListItem bottom-border bottom-border-indent @click="handleOpenSetting">
          <view class="flex items-center">
            <text class="flex-1">授权设置</text>
            <text class="iconfont icon-jiantou_liebiaoxiangyou"></text>
          </view>
        </TnListItem>
        <!-- 清空缓存 -->
        <TnListItem bottom-border bottom-border-indent @click="handleClearCache">
          <view class="flex items-center">
            <text class="flex-1">清空缓存</text>
            <text class="iconfont icon-jiantou_liebiaoxiangyou"></text>
          </view>
        </TnListItem>
        <!-- 服务条款 -->
        <TnListItem
          bottom-border
          bottom-border-indent
          @click="router.push('/pages/public/agreement/serviceText')"
        >
          <view class="flex items-center">
            <text class="flex-1">服务条款</text>
            <text class="iconfont icon-jiantou_liebiaoxiangyou"></text>
          </view>
        </TnListItem>
        <!-- 隐私政策 -->
        <TnListItem
          bottom-border
          bottom-border-indent
          @click="router.push('/pages/public/agreement/privacyText')"
        >
          <view class="flex items-center">
            <text class="flex-1">隐私政策</text>
            <text class="iconfont icon-jiantou_liebiaoxiangyou"></text>
          </view>
        </TnListItem>
        <!-- 版本号 -->
        <TnListItem bottom-border bottom-border-indent>
          <view class="flex items-center">
            <text class="flex-1">版本号</text>
            <text>{{ appStore.env + appStore.wxVersion }}</text>
            <text class="iconfont icon-jiantou_liebiaoxiangyou"></text>
          </view>
        </TnListItem>
        <!-- 退出登录 -->
        <view class="px-2 mt-4 mb-4">
          <wd-button block type="error" size="large" icon="logout" @click="handleLogout">
            退出登录
          </wd-button>
        </view>
      </view>
      <wd-button v-if="IS_DEV" block type="primary" size="large" @click="handleDev">定向</wd-button>
      <!-- 修改昵称弹窗 -->
      <wd-message-box />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.icon-jiantou_liebiaoxiangyou {
  font-size: 44rpx;
  color: #666666;
}

.editPersonal {
  .content {
    background: #f4f4f4;
    height: 100vh;
    padding: 34rpx 32rpx;
    .top {
      padding: 40rpx 32rpx;
    }
  }
  .list {
    background: #fff;
    box-shadow: 0px 3px 22px 0px rgba(0, 0, 0, 0.05);
    border-radius: 20rpx;
    overflow: hidden;
  }
}
</style>

<route lang="json">
{
  "name": "userInfo",
  "auth": true,
  "style": {
    "navigationBarTitleText": "个人信息"
  }
}
</route>
