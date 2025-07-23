<template>
  <view class="login-container">
    <!-- 头部Logo区域 -->
    <view class="header">
      <image
        class="logo"
        mode="widthFix"
        src="https://app.y9net.cn/data/01/33/wKgBNmNrRUaAQIbIAAEk8PcicTA220.png"
      />
      <view class="subtitle">专业 便捷 公允 价值</view>
      <view class="title">欢迎来到理赔公社</view>
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
      <button
        class="login-btn"
        :class="{ disabled: !canLogin }"
        :disabled="!canLogin"
        @click="handleLogin"
        :loading="loginLoading"
      >
        {{ loginLoading ? '登录中...' : '登录' }}
      </button>
    </view>
  </view>
</template>

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
const loginLoading = ref(false)
const timer = ref(null)
const isAgree = ref(false)

const isValidMobile = computed(() => {
  const mobileReg = /^1[3-9]\d{9}$/
  return mobileReg.test(mobile.value)
})
const canLogin = computed(() => {
  return isValidMobile.value && verifyCode.value.length === 6 && !loginLoading.value
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
  } catch (error) {
    console.log('[ error ]-109', error)
    uni.showToast({
      title: '发送失败，请重试',
      icon: 'none',
    })
  }
}

//倒计时
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
  login({
    source: SOURCE.SMS,
    mobile: mobile.value,
    vcode: verifyCode.value,
  })
}
</script>

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

  .form-label {
    display: inline-block;
    width: 100rpx;
    font-size: 32rpx;
    color: #333;
    text-align: left;
    line-height: 1.2;
  }

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

.login-btn {
  width: 100%;
  height: 88rpx;
  background: $uni-text-color-inverse;
  color: #fff;
  border: none;
  border-radius: 100rpx;
  font-size: 36rpx;
  font-weight: 600;
  margin-top: 45rpx;
  line-height: 88rpx;
  text-align: center;

  &::after {
    border: none;
  }

  &.disabled {
    background: #ccc;
  }
}

.other-login {
  margin-top: 80rpx;

  .divider {
    position: relative;
    text-align: center;
    margin-bottom: 40rpx;
    height: 28rpx;
    line-height: 28rpx;

    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: #e1e1e1;
      z-index: 1;
    }

    text {
      background: #fff;
      padding: 0 30rpx;
      font-size: 28rpx;
      color: #999;
      position: relative;
      z-index: 2;
    }
  }
}

.wx-login-btn {
  width: 100%;
  height: 88rpx;
  background: #07c160;
  color: #fff;
  border: none;
  border-radius: 44rpx;
  font-size: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;

  &::after {
    border: none;
  }

  .wx-icon {
    width: 48rpx;
    height: 48rpx;
    margin-right: 20rpx;
  }
}

.agreement {
  margin-top: 50rpx;

  .inputItems_item_label {
    font-size: 24rpx;
    color: $uni-text-color-grey;
  }

  .inputItems_item_checkbox {
    margin-right: 8rpx;
  }

  .inputItems_item_btn {
    font-size: 24rpx;
    color: #418acf;
  }
}

/* 复选框样式优化 */
/* #ifndef APP-NVUE */
checkbox .uni-checkbox-input {
  width: 32rpx !important;
  height: 32rpx !important;
  border-radius: 4rpx !important;
  border: 1px solid #ddd !important;
  background: #fff !important;
}

checkbox .uni-checkbox-input.uni-checkbox-input-checked {
  background: $uni-text-color-inverse !important;
  border-color: $uni-text-color-inverse !important;
}

checkbox .uni-checkbox-input.uni-checkbox-input-checked::before {
  font-size: 20rpx !important;
  color: #fff !important;
}
/* #endif */

/* 微信小程序复选框样式 */
/* #ifdef MP-WEIXIN */
checkbox .wx-checkbox-input {
  width: 32rpx !important;
  height: 32rpx !important;
  border-radius: 4rpx !important;
  border: 1px solid #ddd !important;
  background: #fff !important;
}

checkbox .wx-checkbox-input.wx-checkbox-input-checked {
  background: $uni-text-color-inverse !important;
  border-color: $uni-text-color-inverse !important;
}

checkbox .wx-checkbox-input.wx-checkbox-input-checked::before {
  font-size: 20rpx !important;
  color: #fff !important;
}
/* #endif */

/* H5 样式优化 */
/* #ifdef H5 */
.form-input {
  -webkit-appearance: none;
  appearance: none;
}

.login-btn,
.code-btn {
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    transform: scale(0.98);
  }
}

.disabled {
  cursor: not-allowed !important;

  &:hover {
    opacity: 1 !important;
  }

  &:active {
    transform: none !important;
  }
}
/* #endif */

/* App 样式优化 */
/* #ifdef APP-PLUS */
.login-container {
  padding-top: calc(60rpx + var(--status-bar-height));
}
/* #endif */

/* 小程序样式优化 */
/* #ifdef MP */
button {
  font-size: inherit;
  line-height: inherit;
}

button::after {
  border: none;
}
/* #endif */

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

  .form-input,
  .login-btn {
    height: 80rpx;
    line-height: 80rpx;
  }
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
