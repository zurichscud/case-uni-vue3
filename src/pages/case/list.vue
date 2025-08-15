<script setup>
import { formatTime } from '@/utils/date'
import StepsPopup from './components/StepsPopup.vue'
import * as CaseAPI from '@/apis/case'
import BaseItem from '@/components/BaseCard/BaseItem.vue'
import BaseCard from '@/components/BaseCard/BaseCard.vue'
import { useUserStore } from '@/stores'

const userStore = useUserStore()
const stepsPopupRef = ref()
let id = userStore.id
const ypScrollViewRef = ref()
const currentTab = ref(0)
const pageParams = ref({
  pageNum: 1,
  pageSize: 4,
})
const isFilter = ref(0)
const option = ref([
  { label: '未签约案件', value: 0, bageProps: { modelValue: 0, right: '-8px' } },
  { label: '已签约案件', value: 1, bageProps: { modelValue: 0, right: '-8px' } },
])

async function handleWatchProgress({ caseId }) {
  const { rows } = await CaseAPI.getCaseProcess(caseId)
  stepsPopupRef.value.open(caseId, rows)
}

function handleTabChange({ index }) {
  isFilter.value = index
  pageParams.value.pageNum = 1
  ypScrollViewRef.value?.getData()
}

async function getCaseListData() {
  // isFilter:0 未签约 1 已签约
  console.log(currentTab.value, 'currentTab')
  const res = await CaseAPI.getCaseList({
    ...pageParams.value,
    userId: id,
    isFilter: isFilter.value,
  })
  // option.value[isFilter.value].bageProps.modelValue = res.total
  return res
}

onLoad((query) => {
  if (query.id) {
    id = query.id
  }
  nextTick(() => {
    ypScrollViewRef.value?.getData()
  })
})
</script>

<template>
  <view class="h-screen">
    <wd-sticky>
      <view class="w-screen h-[5vh]">
        <wd-tabs animated @change="handleTabChange" v-model="currentTab" auto-line-width>
          <wd-tab
            v-for="item in option"
            :title="item.label"
            :key="item.label"
            :badge-props="item.bageProps"
          />
        </wd-tabs>
      </view>
    </wd-sticky>
    <view class="h-[94vh]">
      <YpScrollView :query="getCaseListData" ref="ypScrollViewRef" v-model:page="pageParams">
        <template #default="{ list }">
          <view class="px-4">
            <BaseCard v-for="(item, index) in list" :key="item.caseId || index">
              <template #index>
                {{ index + 1 }}
              </template>

              <template #default>
                <view class="mb-2">
                  <text class="text-[24rpx] text-[#999] mr-2">案件编号</text>
                  <text class="text-[28rpx] text-[#333] font-bold number">
                    {{ item.caseId }}
                  </text>
                </view>
                <view class="mb-2">
                  <text class="text-[32rpx] text-[#333] font-bold">
                    {{ item.accidentType || '未知案件名称' }}
                  </text>
                </view>
                <BaseItem icon="icon-ren" label="提交人" :value="item.membersName || '未知提交人'">
                  <yp-tag class="ml-2" :status="4" :text="item.remarkName" />
                </BaseItem>
                <BaseItem
                  icon="icon-shijian"
                  label="提交时间"
                  :value="formatTime(item.registerTime, 'YYYY-MM-DD HH:mm:ss')"
                />
                <BaseItem
                  v-if="item.signTime"
                  icon="icon-shijian"
                  label="签约时间"
                  :value="formatTime(item.signTime, 'YYYY-MM-DD')"
                />
              </template>

              <template #actions>
                <view class="flex gap-2 mt-4">
                  <wd-button
                    v-if="item.userId === id"
                    type="primary"
                    size="small"
                    plain
                    @click.stop="handleWatchProgress(item)"
                  >
                    查看案件进程
                  </wd-button>
                </view>
              </template>
            </BaseCard>
          </view>
        </template>
      </YpScrollView>
    </view>
  </view>
  <!-- 办理进程弹窗 -->
  <StepsPopup ref="stepsPopupRef" />
</template>

<style scoped lang="scss">
.number {
  font-family: 'SF Mono', 'Consolas', 'monospace';
}
</style>

<route lang="json">
{
  "name": "caseList",
  "layout": "default",
  "auth": true,
  "dev": true,
  "style": {
    "navigationBarTitleText": "案件列表"
  }
}
</route>
