<script setup lang="ts">
import avatar from '@/static/读书.png'
import { ref, getCurrentInstance } from 'vue'
import { useMessage } from 'wot-design-uni'
// 团队信息数据
const teamInfo = ref({
  name: '我的团队',
  description: '杭州市红叶联社',
  avatar,
})

// 分支机构数据
const list = [
  {
    id: 1,
    name: 'North Branch',
    members: 15,
    cases: 23,
    contracts: 18,
    established: '2018',
    status: 'active',
  },
  {
    id: 2,
    name: 'South Branch',
    members: 12,
    cases: 18,
    contracts: 15,
    established: '2020',
    status: 'active',
  },
  {
    id: 3,
    name: 'East Branch',
    members: 10,
    cases: 15,
    contracts: 12,
    established: '2019',
    status: 'active',
  },
  {
    id: 4,
    name: 'West Branch',
    members: 8,
    cases: 12,
    contracts: 10,
    established: '2021',
    status: 'active',
  },
]

const message = useMessage('globalMessage')
async function handleEditName() {
  const { value: input } = await message.prompt({
    title: '请输入新团队名称',
    inputValue: teamInfo.value.name,
  })
  if (typeof input === 'undefined') {
    return // 用户取消
  }
  if (typeof input !== 'string' || !input.trim()) {
    uni.showToast({ title: '团队名称不能为空', icon: 'none' })
    return
  }
  teamInfo.value.name = input.trim()
  uni.showToast({ title: '修改成功', icon: 'success' })
}
</script>

<template>
  <view class="min-h-screen bg-gray-50">
    <!-- 团队信息展示区域 -->
    <view class="flex p-4">
      <view class="flex w-full flex-col gap-4 items-center">
        <view class="flex gap-4 flex-col items-center">
          <!-- 团队头像 -->
          <image
            :src="teamInfo.avatar"
            class="rounded-full h-30 w-30 object-cover"
            mode="aspectFill"
          />
          <!-- 团队信息 -->
          <view class="flex flex-col items-center justify-center">
            <view class="flex items-center justify-center">
              <text class="text-gray-900 text-[45rpx] font-bold text-center">
                {{ teamInfo.name }}
              </text>
              <text class="iconfont icon-zhongmingming ml-2 text-gray-500" @tap="handleEditName" />
            </view>
            <text class="text-gray-600 text-base font-normal text-center">
              所属联社：{{ teamInfo.description }}
            </text>
          </view>
        </view>
      </view>
    </view>

    <!-- 分社列表标题 -->
    <text class="text-gray-900 text-[40rpx] font-bold px-4 pb-3 pt-5 block">
      分社列表
    </text>

    <!-- 分社列表 -->
    <view class="space-y-0">
      <view
        v-for="branch in list"
        :key="branch.id"
        class="flex gap-4 bg-gray-50 px-4 py-3 justify-between"
      >
        <view class="flex items-start gap-4">
          <!-- 分支机构图标 -->
          <view class="text-gray-900 flex items-center justify-center rounded-lg bg-gray-200 shrink-0 w-12 h-12">
            <wd-icon name="home" size="24px" />
          </view>
          <!-- 分支机构信息 -->
          <view class="flex flex-1 flex-col justify-center">
            <text class="text-gray-900 text-base font-medium">
              {{ branch.name }}
            </text>
            <text class="text-gray-600 text-sm font-normal">
              Members: {{ branch.members }} | Cases: {{ branch.cases }} | Contracts: {{ branch.contracts }}
            </text>
            <text class="text-gray-600 text-sm font-normal">
              Established: {{ branch.established }}
            </text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>
.icon-zhongmingming {
  font-size: 30rpx;
}
</style>

<route lang="json">
{
  "name": "myTeam",
  "layout": "default",
  "auth": true,
  "style": {
    "navigationBarTitleText": "我的团队"
  }
}
</route>
