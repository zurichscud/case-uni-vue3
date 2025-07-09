<template>
  <!-- 历史记录抽屉 -->
  <wd-popup
    v-model="visible"
    position="left"
    :round="0"
    :safe-area-inset-top="true"
    :safe-area-inset-bottom="true"
    custom-style="width: 500rpx;"
    @close="handleClose"
  >
    <view class="drawer-container">
      <!-- 简洁标题 -->
      <view class="drawer-header" :style="{ paddingTop: `${top}px` }">
        <text class="title">对话历史</text>
        <wd-button
          type="text"
          icon="close"
          size="small"
          @click="handleClose"
          custom-style="padding: 0;"
        />
      </view>

      <!-- 历史记录列表 -->
      <scroll-view
        scroll-y
        class="history-scroll"
        :enhanced="true"
        :bounces="true"
        :show-scrollbar="false"
      >
        <view class="history-list">
          <!-- 历史记录项 -->
          <view
            v-for="item in historyList"
            :key="item.sessionId"
            class="history-item"
            :class="{ active: item.sessionId === currentSessionId }"
            @click="handleSelectHistory(item)"
          >
            <view class="item-content">{{ item.content }}</view>
            <view class="item-actions">
              <i
                class="iconfont icon-shanchu delete-btn"
                @click.stop="handleDeleteHistory(item.sessionId)"
              ></i>
            </view>
          </view>

          <!-- 空状态 -->
          <view v-if="historyList.length === 0" class="empty-state">
            <i class="iconfont icon-liebiao empty-icon"></i>
            <text class="empty-text">暂无历史对话</text>
          </view>
        </view>
      </scroll-view>

      <!-- 底部新建按钮 -->
      <view class="drawer-footer">
        <wd-button
          type="primary"
          size="small"
          icon="add"
          @click="handleNewChat"
          custom-style="width: 100%;"
        >
          新建对话
        </wd-button>
      </view>
    </view>
  </wd-popup>
</template>

<script setup>
import { computed, ref } from 'vue'
import * as AIAPI from '@/apis/ai'
import { onLoad } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores'

const userStore = useUserStore()
const historyList = ref([])
const { safeArea } = uni.getWindowInfo()

const { top } = uni.getMenuButtonBoundingClientRect() //顶部安全区
// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  currentSessionId: {
    type: String,
    default: '',
  },
})

// Emits
const emit = defineEmits(['update:modelValue', 'select-history', 'new-chat'])

// 响应式数据
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

// 方法
const handleClose = () => {
  visible.value = false
}

const handleSelectHistory = (item) => {
  emit('select-history', item)
  handleClose()
}

const handleDeleteHistory = (sessionId) => {
  uni.showModal({
    title: '确认要删除此会话吗？',
    success: async (res) => {
      if (res.confirm) {
        await AIAPI.deleteChatHistory({ sessionId })
        uni.showToast({
          title: '删除成功',
          icon: 'none',
        })
        getAllChatData()

        return
      }
      console.log('取消')
    },
  })
}

const handleNewChat = () => {
  emit('new-chat')
  handleClose()
}

async function getAllChatData() {
  try {
    const { data } = await AIAPI.getChatHistory({ userId: userStore.id })
    // 确保数据结构包含必要字段
    historyList.value = (data || []).map((item) => ({
      sessionId: item.sessionId,
      content: item.content,
      createTime: item.createTime || Date.now(), // 如果没有时间，使用当前时间
      ...item,
    }))
  } catch (error) {
    console.error('获取聊天历史失败:', error)
    historyList.value = []
  }
}

onLoad(() => {
  // 获取所有聊天数据
  getAllChatData()
})
</script>

<style lang="scss" scoped>
.drawer-container {
  height: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 防止整体滚动 */
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rpx 20rpx;
  border-bottom: 1px solid #f0f0f0;
  background: #fff;
  position: relative;
  z-index: 1;
  flex-shrink: 0; /* 防止压缩 */

  .title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
  }
}

.history-scroll {
  flex: 1;
  height: 0; /* 强制计算高度 */
  overflow-y: auto; /* 启用垂直滚动 */
}

.history-list {
  padding: 20rpx 0; /* 移动到这里 */

  .history-item {
    padding: 20rpx 30rpx;
    border-bottom: 1px solid #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: background-color 0.2s;

    &:active {
      background-color: #f8f9fa;
    }

    &.active {
      background-color: #e8f4fd;
      border-left: 4rpx solid #6190e8;
      padding-left: 26rpx;
    }

    .item-content {
      flex: 1;
      font-size: 26rpx;
      color: #333;
      line-height: 1.4;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      margin-right: 20rpx;
    }

    .item-actions {
      .delete-btn {
        font-size: 32rpx;
        color: #999;
        padding: 10rpx;

        &:active {
          color: #ff4757;
        }
      }
    }
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 80rpx 0;
    text-align: center;

    .empty-icon {
      font-size: 60rpx;
      color: #d3d3d3;
      margin-bottom: 20rpx;
    }

    .empty-text {
      font-size: 26rpx;
      color: #999;
    }
  }
}

.drawer-footer {
  padding: 20rpx 30rpx 30rpx;
  border-top: 1px solid #f0f0f0;
  background: #fff;
  flex-shrink: 0; /* 防止压缩 */
}
</style>
