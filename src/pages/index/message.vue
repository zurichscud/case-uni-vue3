<template>
  <view class="message-container">
    <!-- 消息列表容器 -->
    <scroll-view
      class="message-scroll"
      scroll-y
      refresher-enabled
      :refresher-triggered="refreshing"
      @refresherrefresh="onRefresh"
      @scrolltolower="onScrollToLower"
    >
      <!-- 空状态 -->
      <view
        v-if="msgList?.length === 0 && !loading"
        class="empty-state"
        :class="{ 'empty-enter': showEmptyAnimation }"
      >
        <view class="empty-icon">
          <text class="empty-icon-text">📫</text>
        </view>
        <text class="empty-text">暂无消息</text>
        <text class="empty-desc">消息通知将在这里显示</text>
      </view>
      <!-- 消息列表 -->
      <view v-else class="message-list">
        <view
          v-for="(item, index) in msgList"
          :key="index"
          class="message-card"
          :class="{ 'card-enter': animatedCards.includes(index) }"
          :style="{ 'animation-delay': `${index * 100}ms` }"
        >
          <!-- 消息图标 -->
          <view class="message-icon">
            <view class="icon-container icon-default">
              <uni-icons type="email" size="24" color="#ffffff"></uni-icons>
            </view>
          </view>

          <!-- 消息内容 -->
          <view class="message-content">
            <view class="message-header">
              <text class="message-title">
                {{ item.title }}
              </text>
              <view v-if="!item.flag" class="unread-dot"></view>
            </view>

            <!-- 完整消息内容 -->
            <view class="message-body">
              <text class="message-text">{{ item.content }}</text>
            </view>

            <view class="message-footer">
              <text class="message-time">{{ formatTime(item.gmtCreate) }}</text>
            </view>
          </view>
        </view>
      </view>

      <uni-load-more :status="moreStatus" />
    </scroll-view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow, onLoad } from '@dcloudio/uni-app'
import * as MessageAPI from '@/apis/message'
import { useUserStore } from '@/stores'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

// 初始化dayjs相对时间插件
dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

const msgList = ref([])
const refreshing = ref(false)
const animatedCards = ref([])
const showEmptyAnimation = ref(false)
const isFirstLoad = ref(true) // 标记是否是首次加载
const moreStatus = ref('more')
const userStore = useUserStore()
const isFinished = ref(false)
const pageParams = ref({
  userId: userStore.id,
  category: 0,
  pageNum: 1,
  pageSize: 5,
})

// 获取消息列表
async function getMessageListData(triggerAnimation = false) {
  try {
    moreStatus.value = 'loading'
    // 只有需要触发动画时才重置动画状态
    if (triggerAnimation) {
      animatedCards.value = []
      showEmptyAnimation.value = false
    }
    const { rows, total } = await MessageAPI.getMessageList(pageParams.value)
    

    // 只有在需要触发动画时才调用动画函数
    if (triggerAnimation) {
      triggerEnterAnimation()
    }
  } catch (error) {
    console.error('获取消息列表失败:', error)
    uni.showToast({
      title: '获取消息失败',
      icon: 'none',
    })
  } finally {
  }
}

// 触发进入动画
function triggerEnterAnimation() {
  // 延迟一帧确保DOM已更新
  setTimeout(() => {
    if (msgList.value.length === 0) {
      // 空状态动画
      showEmptyAnimation.value = true
    } else {
      // 消息卡片依次进入动画
      msgList.value.forEach((_, index) => {
        setTimeout(() => {
          animatedCards.value.push(index)
        }, index * 100)
      })
    }
  }, 50)
}

function onScrollToLower() {
  if (moreStatus.value === 'more') {
    getMessageListData(false)
  }
}

// 下拉刷新
async function onRefresh() {
  refreshing.value = true
  await getMessageListData(false) // 下拉刷新时不触发动画
  refreshing.value = false
}

// 格式化时间
function formatTime(timeStr) {
  if (!timeStr) {
    return ''
  }
  const now = dayjs()
  const msgTime = dayjs(timeStr)
  const diffInMinutes = now.diff(msgTime, 'minute')
  const diffInHours = now.diff(msgTime, 'hour')
  const diffInDays = now.diff(msgTime, 'day')

  if (diffInMinutes < 1) {
    return '刚刚'
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}分钟前`
  } else if (diffInHours < 24) {
    return `${diffInHours}小时前`
  } else if (diffInDays < 7) {
    return `${diffInDays}天前`
  } else {
    return msgTime.format('YYYY-MM-DD')
  }
}

onLoad(() => {
  // 页面首次加载时触发动画
  getMessageListData(true)
  isFirstLoad.value = false
})

onShow(() => {
  // 只有非首次加载时才刷新数据（不触发动画）
  if (!isFirstLoad.value) {
    getMessageListData(false)
  }
})
</script>

<style scoped lang="scss">
.message-container {
  height: 100vh;
  background-color: #f5f6fa;
}

.message-scroll {
  height: 100vh;
  box-sizing: border-box;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 60rpx;

  /* 初始状态 - 淡入动画 */
  opacity: 0;
  transform: scale(0.9);
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);

  /* 进入动画状态 */
  &.empty-enter {
    opacity: 1;
    transform: scale(1);
  }

  .empty-icon {
    width: 200rpx;
    height: 200rpx;
    margin-bottom: 40rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    .empty-icon-text {
      font-size: 120rpx;
      opacity: 0.6;
    }
  }

  .empty-text {
    font-size: 32rpx;
    color: #666;
    margin-bottom: 16rpx;
  }

  .empty-desc {
    font-size: 28rpx;
    color: #999;
  }
}

.message-list {
  padding: 20rpx 30rpx;

  .message-card {
    display: flex;
    background-color: white;
    border-radius: 24rpx;
    padding: 32rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);

    /* 初始状态 - 隐藏在下方 */
    opacity: 0;
    transform: translateY(60rpx);
    transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);

    /* 进入动画状态 */
    &.card-enter {
      opacity: 1;
      transform: translateY(0);
    }

    .message-icon {
      margin-right: 24rpx;
      flex-shrink: 0;

      .icon-container {
        width: 88rpx;
        height: 88rpx;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;

        &.icon-insurance {
          background: linear-gradient(135deg, #1890ff, #40a9ff);
        }

        &.icon-system {
          background: linear-gradient(135deg, #52c41a, #73d13d);
        }

        &.icon-notification {
          background: linear-gradient(135deg, #fa8c16, #ffa940);
        }

        &.icon-default {
          background: linear-gradient(135deg, #722ed1, #9254de);
        }
      }
    }

    .message-content {
      flex: 1;

      .message-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16rpx;

        .message-title {
          font-size: 32rpx;
          color: #222;
          font-weight: 400;
          flex: 1;
        }

        .unread-dot {
          width: 16rpx;
          height: 16rpx;
          background-color: #ff4d4f;
          border-radius: 50%;
          flex-shrink: 0;
        }
      }

      .message-body {
        margin-bottom: 16rpx;

        .message-text {
          display: block;
          font-size: 28rpx;
          color: #666;
          line-height: 1.6;
          word-break: break-all;
        }
      }

      .message-footer {
        .message-time {
          font-size: 24rpx;
          color: #999;
        }
      }
    }
  }
}

.loading-state {
  display: flex;
  justify-content: center;
  padding: 40rpx;

  /* 加载状态脉动动画 */
  animation: pulse 2s infinite;

  .loading-text {
    font-size: 28rpx;
    color: #999;
  }
}

/* 脉动动画 */
@keyframes pulse {
  0%,
  100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

/* 下拉刷新自定义样式 */
:deep(.uni-scroll-view-refresher) {
  background-color: #f5f6fa;
}
</style>
