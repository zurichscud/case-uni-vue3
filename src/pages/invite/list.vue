<script setup>
import { ref, onMounted } from 'vue'
import { formatTime } from '@/utils/date'
import { useUserStore } from '@/stores'
import * as InviteAPI from '@/apis/invite'

const ypScrollViewRef = ref(null)
const userStore = useUserStore()
const pageParams = ref({
  page: 1,
  pageSize: 4,
})
const memberCount = ref(3)
const baominCount = ref(1)
const needInviteCount = ref(16)

async function getInviteListData() {
  return InviteAPI.getInviteListById({ ...pageParams.value, userId: userStore.id })
}

function handleUpgrade(member) {
  uni.showToast({ title: `已请求升级：${member.name}`, icon: 'success' })
}

// 使用onMounted代替onLoad
onMounted(() => {
  ypScrollViewRef.value?.getData()
})
</script>

<template>
  <view class="invite-list">
    <YpScrollView :query="getInviteListData" ref="ypScrollViewRef" v-model:page="pageParams">
      <template #default="{ list }">
        <view class="invite-card-list">
          <!-- 统计提示区域 -->
          <view class="invite-summary" v-if="true">
            <text>您目前社员数量：</text>
            <text class="summary-num">
              {{ memberCount }}位
            </text>
            ，保民
            <text class="summary-num">
              {{ baominCount }}位
            </text>
            ，再邀请
            <text class="summary-highlight">
              {{ needInviteCount }}位社员
            </text>
            就可以成为分社社长
          </view>
          <BaseCard v-for="(item, index) in list" :key="item.id || index">
            <template #index>
              {{ index + 1 }}
            </template>
            <template #header>
              <view class="flex items-center gap-2 mb-2">
                <text class="text-[32rpx] text-[#333] font-bold">
                  {{ item.nickName }}
                </text>
                <yp-tag :status="4" :text="item.remarkName" />
              </view>
            </template>
            <view class="mb-2">
              <text class="text-[24rpx] text-[#999] mr-2">
                手机号码
              </text>
              <text class="text-[28rpx] text-[#333]">
                {{ item.mobile }}
              </text>
            </view>
            <view class="mb-2">
              <text class="text-[24rpx] text-[#999] mr-2">
                登记时间
              </text>
              <text class="text-[28rpx] text-[#333]">
                {{ formatTime(item.gmtCreate, 'YYYY-MM-DD HH:mm') }}
              </text>
            </view>
            <view class="mb-2">
              <text class="text-[24rpx] text-[#999] mr-2">
                邀请成员数量
              </text>
              <text class="text-[28rpx] text-[#333]">
                {{ item.count }}
              </text>
            </view>
            <template #actions>
              <wd-button type="primary" size="small" plain @click.stop="handleUpgrade(item)">
                查看邀请成员
              </wd-button>
              <wd-button type="success" size="small" plain @click.stop="handleUpgrade(item)">
                升级成为社员
              </wd-button>
            </template>
          </BaseCard>
        </view>
      </template>
    </YpScrollView>
  </view>
</template>

<style scoped lang="scss">
.invite-list {
  height: 100vh;
}

.invite-summary {
  margin: 24rpx 0;
  padding: 24rpx 30rpx;
  background: linear-gradient(90deg, #e0f7fa 0%, #f1f8e9 100%);
  border-radius: 16rpx;
  font-size: 28rpx;
  color: #333;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
.summary-num {
  color: #1976d2;
  font-weight: bold;
  margin: 0 4rpx;
}
.summary-highlight {
  color: #43a047;
  font-weight: bold;
  margin: 0 4rpx;
}

.invite-card-list {
  padding: 0 30rpx;
}

// 移除 .invite-card, .invite-index, .invite-actions 样式，使用 BaseCard 的样式

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
  // BaseCard 已有响应式设计
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
