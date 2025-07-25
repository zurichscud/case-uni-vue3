<script setup>
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import * as MessageAPI from '@/apis/message'
import { useUserStore } from '@/stores'
import { formatTime } from '@/utils/date'

const userStore = useUserStore()
const pageParams = ref({
  userId: userStore.id,
  category: 0,
  pageNum: 1,
  pageSize: 5,
})
const ypScrollViewRef = ref()
const isLogin = computed(() => userStore.isLogin)

// 获取消息列表 - 纯数据获取逻辑
async function getMessageListData() {
  return await MessageAPI.getMessageList(pageParams.value)
}

onShow(() => {
  if (!isLogin.value) {
    return
  }
  nextTick(() => {
    pageParams.value.pageNum = 1
    ypScrollViewRef.value?.getData()
  })
})
</script>

<template>
  <view class="message-container">
    <NoLogin v-if="!isLogin" />
    <!-- 消息列表容器 -->
    <view class="h-[95vh]" v-else>
      <YpScrollView :query="getMessageListData" v-model:page="pageParams" ref="ypScrollViewRef">
        <template #default="{ list }">
          <view class="message-list">
            <view v-for="(item, index) in list" :key="index" class="message-card">
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
                  <text class="message-text">
                    {{ item.content }}
                  </text>
                </view>

                <view class="message-footer">
                  <text class="message-time">
                    {{ formatTime(item.gmtCreate) }}
                  </text>
                </view>
              </view>
            </view>
          </view>
        </template>
      </YpScrollView>
    </view>
  </view>
</template>

<style scoped lang="scss">
.message-container {
  background-color: #f5f6fa;
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

<route lang="json">
{
  "name": "message",
  "layout": "tabbar",
  "style": {
    "navigationBarTitleText": "消息"
  }
}
</route>
