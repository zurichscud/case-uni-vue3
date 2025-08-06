<!-- CoinBase引导页 - Onboarding 4 -->
<script setup>
import { ref } from 'vue'
import router from '@/utils/router'

// 分页指示器状态
const currentStep = ref(3) // 第4步 (0-based)
const totalSteps = 4

// 继续按钮点击事件
function handleContinue() {
  if (currentStep.value < totalSteps - 1) {
    // 如果不是最后一步，可以跳转到下一步
    currentStep.value++
  }
  else {
    // 最后一步，跳转到主页或登录页
    router.replace('/pages/index/index')
  }
}

// 跳过引导
function handleSkip() {
  router.replace('/pages/index/index')
}
</script>

<template>
  <view class="onboarding-container">
    <!-- 状态栏 -->
    <view class="status-bar">
      <view class="status-left">
        <text class="time">
          9:41
        </text>
      </view>
      <view class="status-right">
        <view class="signal-icon"></view>
        <view class="wifi-icon"></view>
        <view class="battery-icon">
          <view class="battery-level"></view>
        </view>
      </view>
    </view>

    <!-- 主体内容 -->
    <view class="main-content">
      <!-- 顶部跳过按钮 -->
      <view class="skip-section">
        <text class="skip-btn" @click="handleSkip">
          跳过
        </text>
      </view>

      <!-- 插画区域 -->
      <view class="illustration-section">
        <image
          class="illustration"
          src="/static/onboarding/mobile_payments.svg"
          mode="aspectFit"
        />
      </view>

      <!-- 文案区域 -->
      <view class="content-section">
        <view class="title-wrapper">
          <text class="main-title">
            You're One Step Closer to Cashing Out Your Exchange
          </text>
        </view>

        <view class="subtitle-wrapper">
          <text class="subtitle">
            Our pay out process is the one of the fatest and guaranteed trusted
          </text>
        </view>
      </view>

      <!-- 分页指示器 -->
      <view class="pagination-section">
        <view class="pagination-dots">
          <view
            v-for="(item, index) in totalSteps"
            :key="index"
            class="dot"
            :class="{ active: index === currentStep, filled: index <= currentStep }"
          ></view>
        </view>
      </view>

      <!-- 继续按钮 -->
      <view class="action-section">
        <view class="continue-btn" @click="handleContinue">
          <text class="continue-text">
            CONTINUE
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.onboarding-container {
  width: 100vw;
  height: 100vh;
  background: #FFFBF7;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 状态栏样式 */
.status-bar {
  width: 100%;
  height: 44px;
  background: #262628;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 21px;

  .status-left {
    .time {
      color: #FFFFFF;
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Roboto', sans-serif;
      font-weight: 900;
      font-size: 15px;
      line-height: 18px;
      letter-spacing: -0.3px;
    }
  }

  .status-right {
    display: flex;
    align-items: center;
    gap: 5px;

    .signal-icon {
      width: 17px;
      height: 11px;
      display: flex;
      align-items: flex-end;
      gap: 2px;

      &::before,
      &::after {
        content: '';
        background: #FFFFFF;
        width: 3px;
        border-radius: 1px;
      }

      &::before {
        height: 4px;
      }

      &::after {
        height: 6px;
      }
    }

    .wifi-icon {
      width: 15px;
      height: 11px;
      position: relative;

      &::before {
        content: '';
        position: absolute;
        width: 15px;
        height: 11px;
        border: 2px solid #FFFFFF;
        border-bottom: none;
        border-radius: 15px 15px 0 0;
        top: 0;
        left: 0;
      }

      &::after {
        content: '';
        position: absolute;
        width: 9px;
        height: 7px;
        border: 2px solid #FFFFFF;
        border-bottom: none;
        border-radius: 9px 9px 0 0;
        top: 2px;
        left: 3px;
      }
    }

    .battery-icon {
      width: 24px;
      height: 11px;
      border: 1px solid rgba(255, 255, 255, 0.35);
      border-radius: 3px;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        width: 1px;
        height: 4px;
        background: rgba(255, 255, 255, 0.4);
        right: -2px;
        top: 50%;
        transform: translateY(-50%);
        border-radius: 0 1px 1px 0;
      }

      .battery-level {
        width: 75%;
        height: 65%;
        background: #FFFFFF;
        border-radius: 1px;
        margin: 2px;
      }
    }
  }
}

/* 主体内容 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 0 66px 0;
  position: relative;
}

.skip-section {
  padding: 20px 30px 0;
  display: flex;
  justify-content: flex-end;

  .skip-btn {
    color: #666;
    font-size: 16px;
    opacity: 0.8;
  }
}

/* 插画区域 */
.illustration-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 52px 20px;

  .illustration {
    width: 271px;
    height: 213px;
    max-width: 100%;
    max-height: 100%;
  }
}

/* 文案区域 */
.content-section {
  padding: 0 52px 40px;

  .title-wrapper {
    margin-bottom: 30px;

    .main-title {
      display: block;
      width: 271px;
      font-family: 'Poppins', sans-serif;
      font-weight: 700;
      font-size: 24px;
      line-height: 36px;
      text-align: center;
      /* 渐变文字效果兼容性处理 */
      background: linear-gradient(135deg, #FD749B 0%, #281AC8 100%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      color: transparent;
      /* 降级处理 */
      @supports not (background-clip: text) {
        color: #281AC8;
      }
    }
  }

  .subtitle-wrapper {
    .subtitle {
      display: block;
      width: 283px;
      font-family: 'Poppins', sans-serif;
      font-weight: 400;
      font-size: 15px;
      line-height: 22px;
      text-align: center;
      color: #333333;
    }
  }
}

/* 分页指示器 */
.pagination-section {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;

  .pagination-dots {
    display: flex;
    gap: 16px;

    .dot {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      transition: all 0.3s ease;
      position: relative;

      &.filled {
        background: linear-gradient(135deg, #FD749B 0%, #281AC8 100%);
        border: none;
      }

      &:not(.filled) {
        background: #FFFBF7;
        border: 2px solid;
        border-image: linear-gradient(135deg, #FD749B 0%, #281AC8 100%) 1;
        border-radius: 50%;

        /* 兼容性处理 */
        &::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(135deg, #FD749B 0%, #281AC8 100%);
          border-radius: 50%;
          z-index: -1;
        }
      }

      &.active {
        transform: scale(1.1);
        box-shadow: 0 2px 8px rgba(253, 116, 155, 0.4);
      }
    }
  }
}

/* 继续按钮 */
.action-section {
  display: flex;
  justify-content: center;
  padding: 0 91px;

  .continue-btn {
    width: 193px;
    height: 43px;
    background: linear-gradient(135deg, #FD749B 0%, #281AC8 100%);
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 4px 15px rgba(253, 116, 155, 0.3);
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(253, 116, 155, 0.4);
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 10px rgba(253, 116, 155, 0.3);
    }

    /* 按钮波纹效果 */
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      transition: width 0.6s, height 0.6s;
    }

    &:active::before {
      width: 300px;
      height: 300px;
    }

    .continue-text {
      font-family: 'Poppins', sans-serif;
      font-weight: 700;
      font-size: 15px;
      line-height: 23px;
      color: #FFFBF7;
      letter-spacing: 1px;
      position: relative;
      z-index: 1;
    }
  }
}

/* 响应式适配 */
@media (max-width: 400px) {
  .content-section {
    padding: 0 30px 40px;

    .title-wrapper .main-title {
      width: 100%;
      font-size: 22px;
      line-height: 32px;
    }

    .subtitle-wrapper .subtitle {
      width: 100%;
      font-size: 14px;
      line-height: 20px;
    }
  }

  .action-section {
    padding: 0 50px;

    .continue-btn {
      width: 100%;
      max-width: 280px;
    }
  }
}
</style>
