<template>
  <view class="login">
    <view class="login_top">
      <image
        class="border login_icon_yipei"
        mode="widthFix"
        src="https://app.y9net.cn/data/01/33/wKgBNmNrRUaAQIbIAAEk8PcicTA220.png"
      ></image>
      <view class="login_title">欢迎来到理赔公社！</view>
      <view class="subT">专业 便捷 公允 价值</view>
    </view>
    <view class="login_wx">
      <wd-button open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" block>
        手机号快捷登录
      </wd-button>
    </view>
    <view class="btn_phone" @click="router.push('/pages/login/phoneLogin')">
      使用短信验证登录/注册
    </view>
  </view>
</template>

<script setup>
import { useUserStore } from '@/stores'
import * as UserAPI from '@/apis/user'
import { SOURCE } from '@/enums/source'

const router = useRouter()
const { login } = useUserStore()

async function getPhoneNumber(e) {
  const {code} = await uni.login()
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
</script>

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
