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
const isSelf = ref(true)
const pageParams = ref({
  pageNum: 1,
  pageSize: 4,
})
const selected = ref(0)
const option = [
  { label: '未签约案件', value: 0 },
  { label: '已签约案件', value: 1 },
]

async function handleWatchProgress({ caseId }) {
  const { rows } = await CaseAPI.getCaseProcess(caseId)
  stepsPopupRef.value.open(caseId, rows)
}

function handleChange() {
  ypScrollViewRef.value?.getData()
}

async function getCaseListData() {
  // isFilter:0 未签约 1 已签约
  return CaseAPI.getCaseList({ ...pageParams.value, userId: id, isFilter: selected.value })
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
  <view class="h-screen">
    <wd-sticky z-index="9999">
      <view class="w-screen border-b h-[5vh]">
        <wd-drop-menu>
          <wd-drop-menu-item v-model="selected" :options="option" @change="handleChange" />
        </wd-drop-menu>
      </view>
    </wd-sticky>

    <!-- 案件列表 -->
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
              </template>

              <template #actions>
                <view class="flex gap-2 mt-4">
                  <wd-button
                    v-if="isSelf"
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
