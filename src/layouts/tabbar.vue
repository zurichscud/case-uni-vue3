<script lang="ts" setup>
import { useMessageStore, useUserStore } from '@/stores'
import { IS_DEV } from '@/utils/env'
import { useShare } from '@/hooks/useShare'
import router from '@/utils/router'

const userStore = useUserStore()
const { themeVars, theme } = useTheme()
const { activeTabbar, getTabbarItemValue, setTabbarItemActive, tabbarList } = useTabbar()
const { getUnReadNumData } = useMessageStore()
const { getUserInfo } = useUserStore()
const isLogin = computed(() => userStore.isLogin)
const { shareOptions } = useShare()

function handleTabbarChange({ value }: { value: string }) {
  setTabbarItemActive(value)
  if (!IS_DEV) {
    uni.vibrateShort()
  }
  if (isLogin.value) {
    getUnReadNumData()
    getUserInfo()
  }
  router.push(`/pages/index/${value}`)
}

onMounted(() => {
  // #ifdef APP-PLUS
  uni.hideTabBar()
  // #endif
  nextTick(() => {
    if (router.getCurrentRoute().name && router.getCurrentRoute().name !== activeTabbar.value.name) {
      setTabbarItemActive(router.getCurrentRoute().name)
    }
  })
})

onShareAppMessage(() => {
  return shareOptions
})
</script>

<script lang="ts">
export default {
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
}
</script>

<template>
  <wd-config-provider :theme-vars="themeVars" :custom-class="`page-wraper ${theme}`" :theme="theme">
    <!-- 剩余部分 -->
    <view class="flex-1">
      <slot />
    </view>
    <!-- 50px -->
    <wd-tabbar
      :model-value="activeTabbar.name"
      placeholder
      bordered
      safe-area-inset-bottom
      fixed
      @change="handleTabbarChange"
    >
      <wd-tabbar-item
        v-for="(item, index) in tabbarList"
        :key="index"
        :name="item.name"
        :value="getTabbarItemValue(item.name)"
        :title="item.title"
      >
        <template #icon="{ active }">
          <i
            class="iconfont"
            :class="[
              active ? item.activeIcon : item.icon,
              active ? 'tabbar-icon-active' : 'tabbar-icon-normal',
            ]"
          />
        </template>
      </wd-tabbar-item>
    </wd-tabbar>
    <!-- #ifdef MP-WEIXIN -->
    <privacy-popup />
    <!-- #endif -->
    <wd-notify />
    <wd-message-box />
    <wd-toast />
    <global-loading />
    <global-toast />
    <global-message />
  </wd-config-provider>
</template>

<style lang="scss">
.page-wraper {
  height: calc(100vh - var(--window-top));
  // 解决margin塌陷的问题
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background: #ffffff;
}

.wot-theme-dark.page-wraper {
  background: #222;
}

// Tabbar 图标样式
.tabbar-icon-normal,
.tabbar-icon-active {
  font-size: 44rpx;
  transition: all 0.3s ease-in-out;
  transform-origin: center;
}

// 普通状态图标
.tabbar-icon-normal {
  color: #999999;
  opacity: 0.7;
  transform: scale(1);
}

// 激活状态图标
.tabbar-icon-active {
  color: var(--wot-color-theme, #4d7fff);
  opacity: 1;
  transform: scale(1.1);
  // 添加发光效果
  filter: drop-shadow(0 0 8rpx rgba(77, 127, 255, 0.3));

  // 脉冲动画
  animation: tabbar-pulse 0.6s ease-out;
}

// 暗黑模式下的图标样式
.wot-theme-dark {
  .tabbar-icon-normal {
    color: #666666;
  }

  .tabbar-icon-active {
    color: var(--wot-color-theme, #4d7fff);
    filter: drop-shadow(0 0 12rpx rgba(77, 127, 255, 0.4));
  }
}

// Tabbar 切换动画
:deep(.wd-tabbar) {
  backdrop-filter: blur(20rpx);
  -webkit-backdrop-filter: blur(20rpx);
  border-top: 1rpx solid rgba(0, 0, 0, 0.1);

  .wd-tabbar-item {
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    position: relative;
    overflow: hidden;

    // 激活状态的背景效果
    &.is-active {
      background: linear-gradient(
        135deg,
        rgba(77, 127, 255, 0.08) 0%,
        rgba(77, 127, 255, 0.02) 100%
      );

      // 顶部指示条
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 50%;
        width: 60rpx;
        height: 6rpx;
        background: var(--wot-color-theme, #4d7fff);
        border-radius: 0 0 6rpx 6rpx;
        transform: translateX(-50%);
        animation: indicator-slide-in 0.3s ease-out;
      }
    }

    // 文字样式
    .wd-tabbar-item__text {
      transition: all 0.3s ease;
      font-weight: 400;
    }

    &.is-active .wd-tabbar-item__text {
      color: var(--wot-color-theme, #4d7fff);
      font-weight: 600;
      transform: translateY(-2rpx);
    }
  }
}

// 暗黑模式下的 tabbar 样式
.wot-theme-dark :deep(.wd-tabbar) {
  background: rgba(34, 34, 34, 0.95);
  border-top: 1rpx solid rgba(255, 255, 255, 0.1);

  .wd-tabbar-item {
    &.is-active {
      background: linear-gradient(
        135deg,
        rgba(77, 127, 255, 0.12) 0%,
        rgba(77, 127, 255, 0.04) 100%
      );
    }

    .wd-tabbar-item__text {
      color: #e0e0e0;
    }

    &.is-active .wd-tabbar-item__text {
      color: var(--wot-color-theme, #4d7fff);
    }
  }
}

// 动画定义
@keyframes tabbar-pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.15);
  }

  100% {
    transform: scale(1.1);
  }
}

@keyframes indicator-slide-in {
  0% {
    width: 0;
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  100% {
    width: 60rpx;
    opacity: 1;
  }
}

// 主题色变化动画
:deep(.wd-tabbar-item) {
  .tabbar-icon-active,
  .wd-tabbar-item__text {
    transition: color 0.3s ease, filter 0.3s ease, transform 0.3s ease;
  }
}

// 响应式适配
@media (max-width: 375px) {
  .tabbar-icon-normal,
  .tabbar-icon-active {
    font-size: 40rpx;
  }
}
</style>
