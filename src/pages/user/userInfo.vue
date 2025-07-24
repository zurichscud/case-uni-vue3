<!-- 个人资料编辑 -->
<template>
  <view class="editPersonal">
    <view class="content">
      <view class="list">
        <view class="li flex_between_x" @click="changeUserImg">
          <text class="title_size">头像</text>
          <view class="right">
            <image class="userImg" :src="userStore.photo" mode="aspectFill"></image>
            <image
              src="https://app.y9net.cn/images/imgs/project_iclaim/index/img_go.png"
              style="vertical-align: middle"
              mode=""
            ></image>
          </view>
        </view>
        <view class="li flex_between_x" @click="handleInput">
          <text class="title_size">昵称</text>
          <view class="right">
            <text style="font-size: 36rpx; white-space: nowrap">{{ userStore.nickName }}</text>
            <image
              src="https://app.y9net.cn/images/imgs/project_iclaim/index/img_go.png"
              mode=""
            ></image>
          </view>
        </view>
        <view class="li flex_between_x">
          <text class="title_size">手机号</text>
          <text style="font-size: 36rpx">{{ userStore.mobile }}</text>
        </view>
      </view>
      <view class="btn_style" @click="handleLogout">
        <image src="../../static/img36.png" class="img_size" mode=""></image>
        退出登录
      </view>
      <view v-if="IS_DEV" class="btn_style" @click="handleRedirect">
        <image src="../../static/img36.png" class="img_size" mode=""></image>
        定向
      </view>
    </view>
    <wd-message-box />
  </view>
</template>

<script setup>
import { useUserStore } from '@/stores'
import { useMessage } from 'wot-design-uni'
import { IS_DEV } from '@/utils/env'
import * as UserAPI from '@/apis/user'

const message = useMessage()
const userStore = useUserStore()
const { logout, getUserInfo } = userStore

async function handleInput() {
  const { value: input } = await message.prompt({
    title: '请输入新昵称',
    inputValue: '',
  })
  if (input === '') {
    return uni.showToast({
      title: '昵称不能为空',
      icon: 'error',
    })
  }
  await UserAPI.updateUserInfo({
    id: userStore.id,
    nickName: input,
  })
  getUserInfo()
}

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

function handleRedirect() {
  uni.navigateTo({
    url: '/pages/abcd/qrcode',
  })
}

function changeUserImg() {
  uni.showToast({
    title: '更换头像功能暂未开放',
    icon: 'none',
  })
}
</script>

<style lang="scss" scoped>
page {
  background-color: #f4f4f4;
}
.btn_flex {
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-top: 40rpx;
  font-size: 28rpx;
}
.btnName {
  border-radius: 20rpx;
  width: 244rpx;
  height: 78rpx;
  line-height: 78rpx;
}
.btnName1 {
  background-image: linear-gradient(to right, #1174fe, #74caff);
  color: white;
}
.btnName2 {
  border: 1px solid #3f9cff;
  color: #3f9cff;
  background-color: white;
}
.btn_style {
  border: none;
  box-shadow: 0px 3px 22px 0px rgba(0, 0, 0, 0.05);
  margin-top: 5vh;
  background-color: white;
  border-radius: 20rpx;
  padding: 30rpx 0;
  font-size: 36rpx;
  text-align: center;
}
.img_size {
  width: 36rpx;
  height: 36rpx;
  vertical-align: middle;
  margin-right: 30rpx;
}
.flex_between_x {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx 0;
}
.list {
  padding: 0 32rpx;
}
.title_size {
  font-size: 36rpx;
  font-weight: normal;
}
.inputN {
  text-align: left;
  background: #ffffff;
  border-radius: 60rpx;
  height: 88rpx;
  width: 600rpx;
  margin-top: 40rpx;
}
.editPersonal {
  .content {
    background: #fff;
    padding: 34rpx 32rpx;
    .top {
      padding: 40rpx 32rpx;
    }
  }
  .userImg {
    width: 108rpx !important;
    height: 108rpx !important;
    vertical-align: middle;
    border-radius: 50%;
  }
  .list {
    background: #fff;
    box-shadow: 0px 3px 22px 0px rgba(0, 0, 0, 0.05);
    border-radius: 20rpx;
    overflow: hidden;
    .li {
      height: 48rpx;
      line-height: 48rpx;
      border-bottom: 2rpx solid #eeeeee;
      image {
        width: 12rpx;
        height: 18rpx;
        margin-left: 30rpx;
      }
    }
    .li:first-child {
      height: 100rpx;
      line-height: 100rpx;
    }
    .li:last-child {
      border-bottom: none;
    }
    .right,
    .li text:last-child {
      color: #b6b6b6;
      font-size: 28rpx;
    }
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
