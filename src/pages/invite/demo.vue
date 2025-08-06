<!-- 引导页演示页面 -->
<script setup>
import router from '@/utils/router'

function gotoOnboarding() {
  router.push('/pages/onboarding/onboarding')
}

function gotoHome() {
  router.replace('/pages/index/index')
}
</script>

<template>
  <view class="demo-container">
    <!-- 导航栏 -->
    <view class="navbar">
      <text class="navbar-title">引导页演示</text>
    </view>

    <!-- 内容区域 -->
    <view class="content">
      <view class="demo-section">
        <text class="section-title">CoinBase 引导页设计</text>
        <text class="section-desc">基于 Figma 设计实现的移动应用引导页面</text>

        <!-- 预览图 -->
        <view class="preview-container">
          <image
            class="preview-image"
            src="/static/onboarding/mobile_payments.svg"
            mode="aspectFit"
          />
        </view>

        <!-- 功能特点 -->
        <view class="features">
          <view class="feature-item">
            <text class="feature-icon">🎨</text>
            <text class="feature-text">高度还原 Figma 设计</text>
          </view>
          <view class="feature-item">
            <text class="feature-icon">📱</text>
            <text class="feature-text">完整状态栏样式</text>
          </view>
          <view class="feature-item">
            <text class="feature-icon">✨</text>
            <text class="feature-text">渐变文字和按钮效果</text>
          </view>
          <view class="feature-item">
            <text class="feature-icon">🔄</text>
            <text class="feature-text">分页指示器动画</text>
          </view>
        </view>

        <!-- 操作按钮 -->
        <view class="actions">
          <view class="btn primary" @click="gotoOnboarding">
            <text class="btn-text">查看引导页</text>
          </view>
          <view class="btn secondary" @click="gotoHome">
            <text class="btn-text">返回首页</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.demo-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding-bottom: 40px;
}

.navbar {
  height: 88px;
  background: #FFFFFF;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  .navbar-title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }
}

.content {
  padding: 40px 30px;
}

.demo-section {
  background: #FFFFFF;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);

  .section-title {
    font-size: 24px;
    font-weight: 700;
    color: #333;
    margin-bottom: 8px;
    display: block;
    text-align: center;
  }

  .section-desc {
    font-size: 16px;
    color: #666;
    text-align: center;
    margin-bottom: 30px;
    display: block;
  }
}

.preview-container {
  display: flex;
  justify-content: center;
  margin: 30px 0;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;

  .preview-image {
    width: 150px;
    height: 118px;
    opacity: 0.8;
  }
}

.features {
  margin: 30px 0;

  .feature-item {
    display: flex;
    align-items: center;
    margin-bottom: 16px;

    .feature-icon {
      font-size: 20px;
      margin-right: 12px;
      width: 30px;
    }

    .feature-text {
      font-size: 16px;
      color: #555;
    }
  }
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 40px;

  .btn {
    height: 50px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;

    &.primary {
      background: linear-gradient(135deg, #FD749B 0%, #281AC8 100%);
      box-shadow: 0 4px 15px rgba(253, 116, 155, 0.3);

      &:active {
        transform: translateY(1px);
        box-shadow: 0 2px 10px rgba(253, 116, 155, 0.3);
      }

      .btn-text {
        color: #FFFFFF;
        font-weight: 600;
      }
    }

    &.secondary {
      background: #f8f9fa;
      border: 2px solid #e9ecef;

      &:active {
        background: #e9ecef;
      }

      .btn-text {
        color: #495057;
        font-weight: 500;
      }
    }

    .btn-text {
      font-size: 16px;
    }
  }
}
</style>
