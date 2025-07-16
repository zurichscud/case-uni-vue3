<script setup>
import { useUserStore } from '@/stores'
import * as UserAPI from '@/apis/user'
import { SOURCE } from '@/enums/source'
import { ref } from 'vue'

const router = useRouter()
const { login } = useUserStore()

const checked = ref(false)

// e的code无效
async function getPhoneNumber({ iv, encryptedData }) {
  if (!checked.value) {
    uni.showModal({
      title: '提示',
      content: '请先勾选并同意服务协议和隐私条款',
      showCancel: false,
    })
    return
  }
  const { code } = await uni.login()
  const { data: phoneData } = await UserAPI.getDecryptPhone({
    code,
    iv,
    encryptedData,
  })
  login({
    source: SOURCE.WECHAT,
    mobile: phoneData.phoneNumber,
  })
}

function toService() {
  router.push('/pages/public/agreement/serviceText')
}
function toPrivacy() {
  router.push('/pages/public/agreement/privacyText')
}
</script>

<template>
  <view class="login flex flex-col justify-between">
    <view>
      <view class="login_top">
        <image
          class="border login_icon_yipei"
          mode="widthFix"
          src="https://app.y9net.cn/data/01/33/wKgBNmNrRUaAQIbIAAEk8PcicTA220.png"
        ></image>
        <view class="subT">专业 便捷 公允 价值</view>
        <view class="login_title">欢迎来到理赔公社</view>
      </view>
      <view class="login_wx">
        <wd-button open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" block size="large">
          手机号快捷登录
        </wd-button>
        <view class="agreement flex items-center justify-center gap-1 text-xs text-gray-500 mt-6">
          <wd-checkbox v-model="checked" shape="round" size="20"></wd-checkbox>
          <text>我已认真阅读并同意</text>
          <text class="link text-blue-500 underline mx-1" @click="toService">服务协议</text>
          <text>和</text>
          <text class="link text-blue-500 underline mx-1" @click="toPrivacy">隐私条款</text>
        </view>
      </view>
    </view>

    <!-- 其他方式登录 -->
    <view class="mb-10">
      <wd-divider>其他登录方式</wd-divider>
      <view class="flex items-center justify-center flex-col gap-2">
        <view class="other-login-btn" @click="router.push('/pages/login/phoneLogin')">
          <i class="iconfont icon-duanxinshezhi text-green-500" style="font-size: 32rpx"></i>
        </view>
        <view class="text-[24rpx] text-gray-500">短信验证登录</view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.other-login-btn {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background-color: transparent;
  border: 1px solid #dcdcdc;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login {
  padding: 0 60rpx;
  height: 100vh;

  &_top {
    margin-top: 100rpx;
    text-align: center;

    .login_title {
      margin: 50rpx auto;
      margin-bottom: 80rpx;
      color: $uni-text-color-subTitle;
      font-family: '钉钉进步体 Regular';
      font-size: 52rpx;
    }

    .subT {
      color: #bbbbbb;
      margin: 30rpx 0;
    }
  }

  &_wx {
    margin-top: 32rpx;
    text-align: center;
    color: #fff;
  }
}

.login_icon_yipei {
  width: 192rpx;
  height: 192rpx;
  border-radius: 50%;
  display: block;
  margin: 0 auto;
}

.btn_phone {
  color: #3f9cff;
  text-align: center;
  margin-top: 32rpx;
  font-size: 24rpx;
}

.border {
  border: 1px solid #f5f6f9;
}
</style>

<route lang="json">
{
  "name": "login",
  "layout": "default",
  "style": {
    "navigationBarTitleText": "登录"
  }
}
</route>
