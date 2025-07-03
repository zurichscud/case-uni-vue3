<template>
  <view class="message-container">
    <!-- 消息列表容器 -->
    <scroll-view
      class="message-scroll"
      scroll-y
      refresher-enabled
      :refresher-triggered="refreshing"
      @refresherrefresh="onRefresh"
      @refresherrestore="onRestore"
    >
      <!-- 空状态 -->
      <view v-if="msgList?.length === 0 && !loading" class="empty-state">
        <view class="empty-icon">
          <text class="empty-icon-text">📫</text>
        </view>
        <text class="empty-text">暂无消息</text>
        <text class="empty-desc">消息通知将在这里显示</text>
      </view>
      <!-- 消息列表 -->
      <view v-else class="message-list">
        <view v-for="(item, index) in msgList" :key="index" class="message-card">
          <!-- 消息图标 -->
          <view class="message-icon">
            <view class="icon-container" :class="getIconClass(item.type)">
              <text class="icon-text">{{ getIconText(item.type) }}</text>
            </view>
          </view>

          <!-- 消息内容 -->
          <view class="message-content">
            <view class="message-header">
              <text class="message-title" :class="{ unread: !item.isRead }">
                {{ getMessageTitle(item) }}
              </text>
              <view v-if="!item.isRead" class="unread-dot"></view>
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

      <!-- 加载状态 -->
      <view v-if="loading" class="loading-state">
        <text class="loading-text">加载中...</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onShow, onLoad } from '@dcloudio/uni-app'
import * as MessageAPI from '@/apis/message'
import { useUserStore } from '@/stores'

const msgList = ref([])
const loading = ref(false)
const refreshing = ref(false)

const userStore = useUserStore()

// 获取消息列表
async function getMessageListData() {
  try {
    loading.value = true
    const res = await MessageAPI.getMessageList({
      userId: userStore.id,
      category: 0,
      pageNum: 1,
      pageSize: 20,
    })
    msgList.value = res.rows || []
  } catch (error) {
    console.error('获取消息列表失败:', error)
    uni.showToast({
      title: '获取消息失败',
      icon: 'none',
    })
  } finally {
    loading.value = false
  }
}

// 下拉刷新
async function onRefresh() {
  refreshing.value = true
  await getMessageListData()
}

function onRestore() {
  refreshing.value = false
}

// 根据消息类型获取图标样式类
function getIconClass(type) {
  switch (type) {
    case 'insurance':
      return 'icon-insurance'
    case 'system':
      return 'icon-system'
    case 'notification':
      return 'icon-notification'
    default:
      return 'icon-default'
  }
}

// 根据消息类型获取图标文字
function getIconText(type) {
  switch (type) {
    case 'insurance':
      return '保'
    case 'system':
      return '系'
    case 'notification':
      return '通'
    default:
      return '消'
  }
}

// 获取消息标题
function getMessageTitle(item) {
  // 可以根据消息类型或内容生成标题
  if (item.title) {
    return item.title
  }

  // 根据内容生成标题
  if (item.content?.includes('理赔')) {
    return '理赔进度通知'
  } else if (item.content?.includes('系统')) {
    return '系统通知'
  } else {
    return '消息通知'
  }
}

// 格式化时间
function formatTime(timeStr) {
  if (!timeStr) {
    return ''
  }

  const now = new Date()
  const msgTime = new Date(timeStr)
  const diff = now.getTime() - msgTime.getTime()

  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 1) {
    return '刚刚'
  } else if (minutes < 60) {
    return `${minutes}分钟前`
  } else if (hours < 24) {
    return `${hours}小时前`
  } else if (days < 7) {
    return `${days}天前`
  } else {
    return msgTime.toLocaleDateString()
  }
}

onLoad(() => {
  // 设置导航栏
  uni.setNavigationBarTitle({
    title: '消息中心',
  })
})

onShow(() => {
  getMessageListData()
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

        .icon-text {
          color: white;
          font-size: 32rpx;
          font-weight: 600;
        }

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

          &.unread {
            font-weight: 600;
            color: #111;
          }
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

  .loading-text {
    font-size: 28rpx;
    color: #999;
  }
}

/* 下拉刷新自定义样式 */
:deep(.uni-scroll-view-refresher) {
  background-color: #f5f6fa;
}
</style>
