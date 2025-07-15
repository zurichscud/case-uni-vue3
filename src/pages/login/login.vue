<script setup>
import { useUserStore } from '@/stores'
import * as UserAPI from '@/apis/user'
import { SOURCE } from '@/enums/source'
import { ref } from 'vue'

const router = useRouter()
const { login } = useUserStore()

const checked = ref(false)

async function getPhoneNumber(e) {
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
    iv: e.iv,
    encryptedData: e.encryptedData,
  })
  login({
    source: SOURCE.WECHAT,
    mobile: phoneData.phoneNumber,
  })
}

function goToService() {
  router.push('/pages/public/agreement/serviceText')
}
function goToPrivacy() {
  router.push('/pages/public/agreement/privacyText')
}

</script>

<template>
  <view class="login">
    <view class="login_top">
      <image
        class="border login_icon_yipei"
        mode="widthFix"
        src="https://app.y9net.cn/data/01/33/wKgBNmNrRUaAQIbIAAEk8PcicTA220.png"
      ></image>
      <view class="login_title">
        欢迎来到理赔公社！
      </view>
      <view class="subT">
        专业 便捷 公允 价值
      </view>
    </view>
    <view class="login_wx">
      <wd-button open-type="getPhoneNumber" @getphonenumber="getPhoneNumber"  block size="large">
        手机号快捷登录
      </wd-button>
      <view class="agreement flex items-center justify-center gap-1 text-xs text-gray-500 mt-6">
        <wd-checkbox v-model="checked" shape="round" size="20">
        </wd-checkbox>
        <text>我已认真阅读并同意</text>
        <text class="link text-blue-500 underline mx-1" @click="goToService">
          服务协议
        </text>
        <text>和</text>
        <text class="link text-blue-500 underline mx-1" @click="goToPrivacy">
          隐私条款
        </text>
      </view>
    </view>
    <view class="other-login">

      <view class="btn_phone" @click="router.push('/pages/login/phoneLogin')">
        使用短信验证登录/注册
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
page,
uni-app {
  background: #fff;
}

.login {
  padding: 54rpx 60rpx 0 60rpx;

  &_top {
    text-align: center;

    .login_title {
      margin-top: 32rpx;
      margin-bottom: 16rpx;
      color: $uni-text-color-subTitle;
      font-size: 52rpx;
    }

    .subT {
      color: #bbbbbb;
      margin-bottom: 82rpx;
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
  "style": {
    "navigationBarTitleText": "登录"
  }
}
</route>
