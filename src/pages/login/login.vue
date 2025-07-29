<script setup>
import { useUserStore } from '@/stores'
import * as UserAPI from '@/apis/user'
import { SOURCE } from '@/enums/source'
import Agreement from './components/Agreement.vue'
import router from '@/utils/router'

const { login } = useUserStore()
const isAgree = ref(false)
const loading = ref(false)

// e的code无效
async function getPhoneNumber(res) {
  const { code, errMsg } = res
  // 用户取消授权
  if (errMsg !== 'getPhoneNumber:ok') {
    return uni.showToast({
      title: '用户取消授权',
      icon: 'none',
    })
  }
  // 未同意协议
  if (!isAgree.value) {
    return uni.showModal({
      title: '提示',
      content: '请先同意服务协议和隐私条款',
      confirmText: '同意',
      success: ({ confirm }) => {
        if (confirm) {
          isAgree.value = true
        }
      },
    })
  }
  try {
    loading.value = true
    const { data } = await UserAPI.getDecryptPhone({
      code,
    })
    await login({
      source: SOURCE.WECHAT,
      mobile: data,
    })
  }
  catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
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
        <view class="subT">
          专业 便捷 公允 价值
        </view>
        <view class="login_title">
          欢迎来到理赔公社
        </view>
      </view>
      <view class="login_wx">
        <wd-button
          open-type="getPhoneNumber"
          :loading="loading"
          @getphonenumber="getPhoneNumber"
          block
          size="large"
        >
          手机号快捷登录
        </wd-button>
        <Agreement v-model="isAgree" />
      </view>
    </view>

    <!-- 其他方式登录 -->
    <view class="mb-10">
      <wd-divider>
        <text class="text-[24rpx]">
          其他登录方式
        </text>
      </wd-divider>
      <!-- 方式 -->
      <view class="flex items-center justify-center flex-col gap-2">
        <view class="other-login-btn" @click="router.push('/pages/login/phoneLogin')">
          <i class="iconfont icon-duanxinshezhi text-green-500" style="font-size: 32rpx"></i>
        </view>
        <view class="text-[24rpx] text-gray-500">
          短信验证登录
        </view>
      </view>
      <view class="text-[22rpx] text-gray-400 mt-4 text-center">
        未注册的用户将直接为您创建理赔公社账号
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
      font-weight: 500;
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
