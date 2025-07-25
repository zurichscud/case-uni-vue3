<script setup>
import { ref, onMounted } from 'vue'
import { formatTime } from '@/utils/date'
import { useUserStore } from '@/stores'
import * as InviteAPI from '@/apis/invite'
import UpgradeTip from './components/UpgradeTip.vue'
import { REMARK } from '@/enums/remark'
import BaseItem from '@/components/BaseCard/BaseItem.vue'

const ypScrollViewRef = ref()
const ypScrollViewRef2 = ref()
const userStore = useUserStore()
let id = userStore.id
const remark = computed(() => userStore.remark)
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
const isSelf =ref(true)

async function getInviteListData() {
  if (isSelf.value) {
    getUpgardMSgData()
  }
  return InviteAPI.getInviteListById({ ...pageParams.value, userId: id })
}

function handleWatchMember(member) {
  uni.showToast({ title: `已查看邀请成员：${member.name}`, icon: 'success' })
}

function handleUpgrade(member) {
  uni.showToast({ title: `已请求升级：${member.name}`, icon: 'success' })
}

async function getUpgardMSgData() {
  const { data } = await InviteAPI.getUpgardMSg()
  count.value = data.count
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

function handleTabChange({ index }) {
  if (index === 0) {
    ypScrollViewRef.value?.getData()
  } else if (index === 1) {
    ypScrollViewRef2.value?.getData()
  }
}

onLoad((query) => {
  if (query.id) {
    id = query.id
    isSelf.value = false
  }
  nextTick(() => {
    ypScrollViewRef.value?.getData()
  })
})
</script>

<template>
  <view class="invite-list">
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
        <YpScrollView :query="getInviteListData" ref="ypScrollViewRef" v-model:page="pageParams">
          <template #default="{ list }">
            <view class="px-4">
              <!-- 升级提示区域 -->
              <UpgradeTip :remark="remark" :count="count" v-if="isSelf"/>
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
                      邀请成为社员
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
        <YpScrollView :query="getGroupListData" ref="ypScrollViewRef2" v-model:page="pageParams2">
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
                <BaseItem icon="icon-chengyuan" label="成员数量" :value="item.count" />
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
</style>

<route lang="json">
{
  "name": "inviteList",
  "layout": "default",
  "auth": true,
  "dev": true,
  "style": {
    "navigationBarTitleText": "邀请列表"
  }
}
</route>
