<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores'
import * as UserAPI from '@/apis/user'
import { SOURCE } from '@/enums/source'
import Agreement from './components/Agreement.vue'

const userStore = useUserStore()
const { login } = userStore
const mobile = ref('')
const verifyCode = ref('')
const codeCountdown = ref(0)
const loading = ref(false)
const timer = ref(null)
const isAgree = ref(false)
const redirect = ref('')

const isValidMobile = computed(() => {
  const mobileReg = /^1[3-9]\d{9}$/
  return mobileReg.test(mobile.value)
})
const canLogin = computed(() => {
  return isValidMobile.value && verifyCode.value.length === 6 && !loading.value
})

async function sendVerifyCode() {
  if (!isValidMobile.value) {
    return uni.showToast({
      title: '请输入正确的手机号',
      icon: 'none',
    })
  }
  if (codeCountdown.value > 0) {
    uni.showToast({
      title: `请${codeCountdown.value}秒后再试`,
      icon: 'none',
    })
    return
  }
  try {
    await UserAPI.sendSms({
      mobile: mobile.value,
    })
    uni.showToast({
      title: '验证码已发送',
      icon: 'success',
    })
    startCountdown()
  }
  catch (error) {
    console.log('[ error ]-109', error)
    uni.showToast({
      title: '发送失败，请重试',
      icon: 'none',
    })
  }
}

// 倒计时
function startCountdown() {
  codeCountdown.value = 60
  timer.value = setInterval(() => {
    codeCountdown.value--
    if (codeCountdown.value <= 0) {
      clearInterval(timer.value)
    }
  }, 1000)
}

async function handleLogin() {
  if (!isAgree.value) {
    return uni.showModal({
      title: '提示',
      content: '请先同意服务协议和隐私条款',
      confirmText: '同意',
      // eslint-disable-next-line unused-imports/no-unused-vars
      success: ({ confirm, cancel }) => {
        if (confirm) {
          isAgree.value = true
        }
      },
    })
  }
  loading.value = true
  login(
    {
      source: SOURCE.SMS,
      mobile: mobile.value,
      vcode: verifyCode.value,
    },
    redirect.value,
  )
  loading.value = false
}

onLoad((query) => {
  console.log('[ query ]-150', query)
  if (query.redirect) {
    redirect.value = query.redirect
  }
})
</script>

<template>
  <view class="login-container">
    <!-- 头部Logo区域 -->
    <view class="header">
      <image
        class="logo"
        mode="widthFix"
        src="https://app.y9net.cn/data/01/33/wKgBNmNrRUaAQIbIAAEk8PcicTA220.png"
      />
      <view class="subtitle">
        专业 便捷 公允 价值
      </view>
      <view class="title">
        欢迎来到理赔公社
      </view>
    </view>

    <!-- 登录表单 -->
    <view class="form-container">
      <view class="form-item">
        <input
          type="number"
          class="form-input"
          v-model="mobile"
          placeholder="输入手机号"
          maxlength="11"
        />
      </view>

      <view class="form-item">
        <view class="code-input-wrapper">
          <input
            type="number"
            class="form-input code-input"
            v-model="verifyCode"
            placeholder="输入验证码"
            maxlength="6"
          />
          <text
            class="code-btn"
            :class="{ disabled: codeCountdown > 0 || !isValidMobile }"
            @click="sendVerifyCode"
          >
            {{ codeCountdown > 0 ? `${codeCountdown}s` : '获取验证码' }}
          </text>
        </view>
      </view>
      <!-- 协议 -->
      <Agreement v-model="isAgree" />

      <!-- 登录按钮 -->
      <view class="my-3">
        <wd-button block size="large" :disabled="!canLogin" @click="handleLogin" :loading="loading">
          {{ loading ? '登录中...' : '登录' }}
        </wd-button>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.login-container {
  min-height: 100vh;
  background: #fff;
  padding: 60rpx 60rpx 160rpx;
  box-sizing: border-box;
}

.header {
  text-align: center;
  margin-bottom: 80rpx;

  .logo {
    width: 192rpx;
    height: 192rpx;
    border-radius: 50%;
    border: 1px solid #f5f6f9;
    display: block;
    margin: 0 auto;
  }

  .title {
    margin-top: 40rpx;
    font-size: 52rpx;
    font-family: '钉钉进步体 Regular';
    font-weight: 500;
    color: #333;
    line-height: 1.2;
  }

  .subtitle {
    margin-top: 16rpx;
    font-size: 28rpx;
    color: #bbbbbb;
    line-height: 1.4;
  }
}

.form-container {
  margin-bottom: 60rpx;
}

.form-item {
  border-bottom: 1px solid #b7c4cb;
  padding: 25rpx 0;
  margin-bottom: 0;

  .form-input {
    width: 280rpx;
    height: auto;
    border: none;
    border-radius: 0;
    padding: 0 10rpx 0 26rpx;
    font-size: 32rpx;
    background: transparent;
    box-sizing: border-box;
    line-height: normal;
    display: inline-block;

    &:focus {
      outline: none;
    }

    &::placeholder {
      color: #999;
      font-size: 32rpx;
    }
  }
}

.code-input-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .code-input {
    flex: 1;
    min-width: 0;
    width: auto;
  }

  .code-btn {
    font-size: 28rpx;
    color: $uni-text-color-inverse;
    background: transparent;
    border: none;
    padding: 0;
    margin-left: 20rpx;
    line-height: normal;
    text-align: right;
    flex-shrink: 0;
    width: auto;
    height: auto;

    &::after {
      border: none;
    }

    &.disabled {
      color: #999;
    }
  }
}

/* 响应式设计 */
/* #ifdef H5 */
@media (max-width: 750px) {
  .login-container {
    padding: 40rpx 40rpx 120rpx;
  }

  .header .logo {
    width: 160rpx;
    height: 160rpx;
  }

  .header .title {
    font-size: 48rpx;
  }
}
/* #endif */

/* App 样式优化 */
/* #ifdef APP-PLUS */
.login-container {
  padding-top: calc(60rpx + var(--status-bar-height));
}
/* #endif */
</style>

<route lang="json">
{
  "name": "phoneLogin",
  "style": {
    "navigationBarTitleText": "登录"
  }
}
</route>
