<script setup>
import { ref, onMounted } from 'vue'
import { formatTime } from '@/utils/date'
import { useUserStore } from '@/stores'
import * as InviteAPI from '@/apis/invite'
import * as LPGSAPI from '@/apis/lpgs'
import InviteStatistics from './components/InviteStatistics.vue'
import BaseItem from '@/components/BaseCard/BaseItem.vue'
import router from '@/utils/router'

const INVITE_TYPE = {
  MEMBER: 0,
  GROUP: 1,
}
const ypScrollViewRef = ref()
const ypScrollViewRef2 = ref()
const userStore = useUserStore()
let isFilter = INVITE_TYPE.MEMBER
const query = defineProps({
  //userId
  id: {
    type: String,
  },
  //是否限制跳转
  limit: {
    type: Number,
    default: 0,
  },
})
const pageParams = ref({
  pageNum: 1,
  pageSize: 4,
})
const pageParams2 = ref({
  pageNum: 1,
  pageSize: 4,
})
const currentTab = ref(0)
const count = ref({})
const id = computed(() => {
  if (query.id === '') {
    return userStore.id
  }
  return query.id
})
const isSelf = computed(() => {
  return id.value === userStore.id
})

async function getInviteListData() {
  //只有自己才能获取升级信息
  if (isSelf.value) {
    getUpgardMSgData()
  }
  return InviteAPI.getInviteListById({ ...pageParams.value, userId: id.value, isFilter })
}

function handleWatchMember(member) {
  router.push('/pages/invite/list', { id: member.id, limit: 1 })
}

async function handleInvite(member) {
  await LPGSAPI.remindBaoMin({ userId: member.id })
  uni.showToast({ title: `已邀请${member.nickName}成为社员`, icon: 'success' })
  ypScrollViewRef.value?.getData()
}

async function getUpgardMSgData() {
  const { data } = await InviteAPI.getUpgardMSg()
  count.value = data.count
}

async function getGroupListData() {
  return InviteAPI.getInviteListById({ ...pageParams.value, userId: id.value, isFilter })
}

function handleTabChange({ index }) {
  if (index === 0) {
    isFilter = INVITE_TYPE.MEMBER
    ypScrollViewRef.value?.getData()
  } else if (index === 1) {
    isFilter = INVITE_TYPE.GROUP
    ypScrollViewRef2.value?.getData()
  }
}

onLoad(() => {
  nextTick(() => {
    ypScrollViewRef.value?.getData()
  })
})
</script>

<template>
  <view class="h-screen">
    <wd-tabs
      v-model="currentTab"
      auto-line-width
      sticky
      animated
      @change="handleTabChange"
      swipeable
    >
      <!-- 人员 -->
      <wd-tab title="人员">
        <view>
          <YpScrollView :query="getInviteListData" ref="ypScrollViewRef" v-model:page="pageParams">
            <template #default="{ list }">
              <view class="px-4">
                <!-- 统计 -->
                <InviteStatistics
                  v-if="list.length > 0 && isSelf"
                  :she-yuan="count.sheyuanCount"
                  :bao-min="count.baominCount"
                  :fen-she="count.fensheCount"
                />
                <!-- 升级提示区域 -->
                <!-- <UpgradeTip :remark="remark" :count="count" v-if="isSelf" /> -->
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
                      <wd-tag type="primary" plain v-if="item.currentDepth === 1">直邀</wd-tag>
                      <wd-tag type="success" plain v-else>非直邀</wd-tag>
                    </view>
                  </view>
                  <BaseItem icon="icon-dianhuahaoma" label="手机号码" :value="item.mobile" />
                  <BaseItem
                    icon="icon-shijian"
                    label="登记时间"
                    :value="formatTime(item.gmtCreate, 'YYYY-MM-DD HH:mm')"
                  />
                  <BaseItem icon="icon-chengyuan" label="邀请成员数量" :value="item.count" />
                  <template #actions>
                    <view class="flex gap-2 mt-4">
                      <wd-button
                        v-if="item.count > 0 && !limit"
                        type="primary"
                        size="small"
                        plain
                        @click.stop="handleWatchMember(item)"
                      >
                        查看邀请成员
                      </wd-button>
                      <wd-button
                        v-if="item.isRemind === 0 && !limit"
                        type="success"
                        size="small"
                        plain
                        @click.stop="handleInvite(item)"
                      >
                        邀请成为社员
                      </wd-button>
                    </view>
                  </template>
                </BaseCard>
              </view>
            </template>
          </YpScrollView>
        </view>
      </wd-tab>
      <!-- 组织 -->
      <wd-tab title="育成">
        <YpScrollView :query="getGroupListData" ref="ypScrollViewRef2" v-model:page="pageParams2">
          <template #default="{ list }">
            <view class="px-4">
              <BaseCard v-for="(item, index) in list" :key="item.id || index">
                <template #index>
                  {{ index + 1 }}
                </template>
                <view class="flex items-center gap-2 mb-2">
                  <text class="text-[32rpx] text-[#333] font-bold">
                    {{ item.membersClubName || '暂无团队名称' }}
                  </text>
                  <wd-tag type="primary" plain v-if="item.currentDepth === 1">直邀</wd-tag>
                  <wd-tag type="success" plain v-else>非直邀</wd-tag>
                </view>
                <BaseItem icon="icon-chengyuan" label="成员数量" :value="item.count" />
              </BaseCard>
            </view>
          </template>
        </YpScrollView>
      </wd-tab>
    </wd-tabs>
  </view>
</template>

<style scoped lang="scss"></style>

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
