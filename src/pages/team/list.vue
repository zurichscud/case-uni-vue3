<script setup lang="ts">
import avatar from '@/static/读书.png'
import { ref } from 'vue'
import { useMessage } from 'wot-design-uni'
import BaseItem from '@/components/BaseCard/BaseItem.vue'
import * as TeamAPI from '@/apis/team'
import router from '@/utils/router'
import { useUserStore } from '@/stores'

const userStore = useUserStore()
const TEAM_TYPE = {
  DIRECT: 0, // 直辖
  NON_DIRECT: 1, // 非直辖
}
const message = useMessage('globalMessage')
const teamInfo = ref<{
  name: string | undefined
  branch: string | undefined
  headquarters: string | undefined
  avatar: string
}>({
  name: undefined,
  branch: undefined, // 分社
  headquarters: undefined, // 联社
  avatar,
})
const pageParams = ref({
  page: 1,
  pageSize: 4,
})
const ypScrollViewRef = ref()

// 获取团队信息
async function getTeamListData() {
  const { data } = await TeamAPI.getTeamList()
  const { myTeamList, myteamName } = data
  teamInfo.value.name = myteamName.nickName
  teamInfo.value.branch = myteamName.branch
  teamInfo.value.headquarters = myteamName.headquarters
  // 为什么这样返回，问后端啊，跟我说不支持分页
  return {
    rows: myTeamList,
    total: myTeamList.length,
  }
}

// 查看邀请列表
function toInviteList(id: any) {
  if (id) {
    const limit = id === userStore.id ? 0 : 1
    router.push('/pages/invite/list', { id, limit })
  } else {
    uni.showToast({
      title: 'id不能为空',
      icon: 'none',
    })
  }
}

// 查看案件列表
function toCaseList(id: any) {
  if (id) {
    const limit = id === userStore.id ? 0 : 1
    router.push('/pages/case/list', { id, limit })
  } else {
    uni.showToast({
      title: 'id不能为空',
      icon: 'none',
    })
  }
}

// 编辑团队名称
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
  await TeamAPI.updateTeamName({ teamName: teamInfo.value.name, userId: userStore.id! })
  uni.showToast({ title: '修改成功', icon: 'success' })
  ypScrollViewRef.value.getData()
}

onMounted(() => {
  ypScrollViewRef.value.getData()
})
</script>

<template>
  <!-- bg-gray-50 -->
  <view class="min-h-screen">
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
              <text class="text-gray-900 text-[40rpx] font-bold text-center">
                {{ teamInfo.name }}
              </text>
              <text class="iconfont icon-zhongmingming ml-2 text-gray-500" @tap="handleEditName" />
            </view>
            <text
              v-if="teamInfo.headquarters"
              class="text-gray-600 text-base font-normal text-center"
            >
              所属联社：{{ teamInfo.headquarters }}
            </text>
            <text v-if="teamInfo.branch" class="text-gray-600 text-base font-normal text-center">
              所属分社：{{ teamInfo.branch }}
            </text>
          </view>
        </view>
      </view>
    </view>

    <!-- 分社列表标题 -->
    <text class="text-gray-900 text-[40rpx] font-bold px-4 pb-3 pt-5 block">分社列表</text>

    <!-- 分社列表 -->
    <YpScrollView :query="getTeamListData" v-model:page="pageParams" ref="ypScrollViewRef">
      <template #default="{ list }">
        <view class="px-4">
          <BaseCard v-for="(item, index) in list" :key="item.id">
            <template #index>
              {{ index + 1 }}
            </template>

            <template #default>
              <view class="flex items-center gap-2">
                <view>{{ item.branch || '未知团队名称' }}</view>
                <wd-tag type="primary" plain v-if="item.type === TEAM_TYPE.DIRECT">直辖</wd-tag>
                <wd-tag type="success" plain v-else-if="item.type === TEAM_TYPE.NON_DIRECT">
                  非直辖
                </wd-tag>
              </view>

              <BaseItem icon="icon-ren" label="成员数量" :value="item.userNum" />
              <BaseItem icon="icon-shijian" label="成立时间" :value="item.gmtCreate" />
              <BaseItem icon="icon-weiqianyue" label="未签约案件数量" :value="item.noSignCaseNum" />
              <BaseItem icon="icon-qianyue" label="已签约案件数量" :value="item.signCaseNum" />
            </template>

            <template #actions>
              <view class="flex gap-2 mt-4">
                <wd-button type="primary" size="small" plain @click.stop="toInviteList(item.id)">
                  查看邀请列表
                </wd-button>
                <wd-button type="success" size="small" plain @click.stop="toCaseList(item.id)">
                  查看案件列表
                </wd-button>
              </view>
            </template>
          </BaseCard>
        </view>
      </template>
    </YpScrollView>
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
  "dev": true,
  "style": {
    "navigationBarTitleText": "我的团队"
  }
}
</route>
