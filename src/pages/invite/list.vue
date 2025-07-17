<script setup>
import { ref, onMounted } from 'vue'
import { formatTime } from '@/utils/date'
import { useUserStore } from '@/stores'
import * as InviteAPI from '@/apis/invite'
import UpgradeTip from './components/UpgradeTip.vue'
import { REMARK } from '@/enums/remark'

const ypScrollViewRef = ref()
const ypScrollViewRef2 = ref()
const userStore = useUserStore()
const remark = computed(() => userStore.remark)
const pageParams = ref({
  page: 1,
  pageSize: 4,
})
const currentTab = ref(0)

async function getInviteListData() {
  return InviteAPI.getInviteListById({ ...pageParams.value, userId: userStore.id })
}

function handleWatchMember(member) {
  uni.showToast({ title: `已查看邀请成员：${member.name}`, icon: 'success' })
}

function handleUpgrade(member) {
  uni.showToast({ title: `已请求升级：${member.name}`, icon: 'success' })
}

async function getGroupListData() {
  return {
    rows: [
      {
        id: 1,
        name: '枫叶联社1',
        count: 10,
      },
      {
        id: 2,
        name: '枫叶联社2',
        count: 20,
      },
    ],
    total: 2,
  }
}

// 使用onMounted代替onLoad
onMounted(() => {
  ypScrollViewRef.value?.getData()
  ypScrollViewRef2.value?.getData()
})
</script>

<template>
  <view class="invite-list">
    <wd-tabs v-model="currentTab" auto-line-width>
      <!-- 人员 -->
      <wd-tab title="人员">
        <YpScrollView :query="getInviteListData" ref="ypScrollViewRef" v-model:page="pageParams">
          <template #default="{ list }">
            <view class="px-4">
              <!-- 升级提示区域 -->
              <UpgradeTip :remark="remark" />
              <!-- 邀请列表 -->
              <BaseCard v-for="(item, index) in list" :key="item.id || index">
                <template #index>
                  {{ index + 1 }}
                </template>
                <view class="mb-2">
                  <view class="flex items-center gap-2 mb-2">
                    <text class="text-[32rpx] text-[#333] font-bold">
                      {{ item.nickName }}
                    </text>
                    <yp-tag :status="4" :text="item.remarkName || '未知身份'" />
                  </view>
                  <text class="text-[24rpx] text-[#999] mr-2">手机号码</text>
                  <text class="text-[28rpx] text-[#333]">
                    {{ item.mobile }}
                  </text>
                </view>
                <view class="mb-2">
                  <text class="text-[24rpx] text-[#999] mr-2">登记时间</text>
                  <text class="text-[28rpx] text-[#333]">
                    {{ formatTime(item.gmtCreate, 'YYYY-MM-DD HH:mm') }}
                  </text>
                </view>
                <view class="mb-2">
                  <text class="text-[24rpx] text-[#999] mr-2">邀请成员数量</text>
                  <text class="text-[28rpx] text-[#333]">
                    {{ item.count }}
                  </text>
                </view>
                <template #actions>
                  <view class="flex gap-2 mt-4">
                    <wd-button
                      v-if="item.count > 0"
                      type="primary"
                      size="small"
                      plain
                      @click.stop="handleWatchMember(item)"
                    >
                      查看邀请成员
                    </wd-button>
                    <wd-button
                      v-if="item.remark === REMARK.BaoMin"
                      type="success"
                      size="small"
                      plain
                      @click.stop="handleUpgrade(item)"
                    >
                      升级成为社员
                    </wd-button>
                  </view>
                </template>
              </BaseCard>
            </view>
          </template>
        </YpScrollView>
      </wd-tab>
      <!-- 组织 -->
      <wd-tab title="组织">
        <YpScrollView :query="getGroupListData" ref="ypScrollViewRef2" v-model:page="pageParams">
          <template #default="{ list }">
            <view class="px-4">
              <BaseCard v-for="(item, index) in list" :key="item.id || index">
                <template #index>
                  {{ index + 1 }}
                </template>
                <view class="flex items-center gap-2 mb-2">
                  <text class="text-[32rpx] text-[#333] font-bold">
                    {{ item.name }}
                  </text>
                </view>
                <view class="mb-2">
                  <text class="text-[24rpx] text-[#999] mr-2">成员数量</text>
                  <text class="text-[28rpx] text-[#333]">
                    {{ item.count }}
                  </text>
                </view>
              </BaseCard>
            </view>
          </template>
        </YpScrollView>
      </wd-tab>
    </wd-tabs>
  </view>
</template>

<style scoped lang="scss">
.invite-list {
  height: 100vh;
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
