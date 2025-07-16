<script setup>
import { ref } from 'vue'
import { formatTime } from '@/utils/date'
// 假设有API，后续可替换
// import * as InviteAPI from '@/apis/invite'

const ypScrollViewRef = ref(null)
const pageParams = ref({
  page: 1,
  pageSize: 4,
})

// 示例数据，后续用API替换
async function getInviteListData() {
  return {
    rows: [
      {
        id: 1,
        joinTime: '2024-06-01T10:00:00',
        name: '张三',
        role: '社员',
        phone: '138****8888',
        requiredMembers: 3,
      },
      {
        id: 2,
        joinTime: '2024-06-02T11:30:00',
        name: '李四',
        role: '分社社长',
        phone: '139****9999',
        requiredMembers: 2,
      },
    ],
    total: 2,
  }
}

function handleUpgrade(member) {
  // 升级逻辑，后续可接API
  uni.showToast({ title: `已请求升级：${member.name}`, icon: 'success' })
}
//使用onMounted代替onLoad
onMounted(() => {
  ypScrollViewRef.value?.getData()
})
</script>

<template>
  <view class="invite-list">
    <YpScrollView :query="getInviteListData" ref="ypScrollViewRef" v-model:page="pageParams">
      <template #default="{ list }">
        <view class="invite-card-list">
          <view v-for="(item, index) in list" :key="item.id || index" class="invite-card">
            <!-- 序号 -->
            <view class="invite-index">
              {{ index + 1 }}
            </view>
            <!-- 姓名 -->
            <view class="flex items-center gap-2 mb-2">
              <text class="text-[32rpx] text-[#333] font-bold">
                {{ item.name }}
              </text>
              <yp-tag :status="4" :text="item.role" />
            </view>
            <!-- 手机号码 -->
            <view class="mb-2">
              <text class="text-[24rpx] text-[#999] mr-2">手机号码</text>
              <text class="text-[28rpx] text-[#333]">
                {{ item.phone }}
              </text>
            </view>
            <!-- 登记时间 -->
            <view class="mb-2">
              <text class="text-[24rpx] text-[#999] mr-2">登记时间</text>
              <text class="text-[28rpx] text-[#333]">
                {{ formatTime(item.joinTime, 'YYYY-MM-DD HH:mm') }}
              </text>
            </view>
            <!-- 邀请成员数量 -->
            <view class="mb-2">
              <text class="text-[24rpx] text-[#999] mr-2">邀请成员数量</text>
              <text class="text-[28rpx] text-[#333]">
                {{ item.requiredMembers }}
              </text>
            </view>
            <!-- 操作按钮 -->
            <view class="invite-actions">
              <wd-button type="primary" size="small" plain @click.stop="handleUpgrade(item)">
                查看邀请成员
              </wd-button>
              <wd-button type="success" size="small" plain @click.stop="handleUpgrade(item)">
                升级成为社员
              </wd-button>
            </view>
          </view>
        </view>
      </template>
    </YpScrollView>
  </view>
</template>

<style scoped lang="scss">
.invite-list {
  height: 100vh;
}

.invite-card-list {
  padding: 0 30rpx;
}

.invite-card {
  background: #fff;
  border-radius: 16rpx;
  margin: 20rpx 0;
  padding: 30rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 140rpx;
    height: 140rpx;
    background: linear-gradient(
      135deg,
      rgba(63, 156, 255, 0.15) 0%,
      rgba(82, 196, 26, 0.12) 30%,
      rgba(255, 193, 7, 0.1) 60%,
      rgba(220, 53, 69, 0.08) 100%
    );
    border-radius: 0 16rpx 0 140rpx;
    z-index: 1;
    box-shadow: inset 0 0 20rpx rgba(255, 255, 255, 0.3);
  }

  &::after {
    content: '';
    position: absolute;
    top: 8rpx;
    right: 8rpx;
    width: 60rpx;
    height: 60rpx;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.8) 0%,
      rgba(255, 255, 255, 0.4) 50%,
      transparent 100%
    );
    border-radius: 50%;
    z-index: 2;
    animation: shimmer 3s ease-in-out infinite;
  }

  &:active {
    transform: scale(0.98);
    background: #f8f9fa;
  }
}

.invite-index {
  position: absolute;
  top: 40rpx;
  right: 40rpx;
  font-size: 32rpx;
  color: #a1a0a0;
  font-weight: 600;
  z-index: 3;
  line-height: 1;
}

.invite-actions {
  display: flex;
  justify-content: flex-end;
  gap: 20rpx;
  padding-top: 20rpx;
  border-top: 1rpx solid #f0f0f0;
}

@keyframes shimmer {
  0%,
  100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

@media (max-width: 750rpx) {
  .invite-card {
    margin: 16rpx 0;
    padding: 24rpx;
  }
}
</style>

<route lang="json">
{
  "name": "inviteList",
  "layout": "default",
  "auth": true,
  "style": {
    "navigationBarTitleText": "邀请列表"
  }
}
</route>
