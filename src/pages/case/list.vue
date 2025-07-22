<script setup>
import { formatTime } from '@/utils/date'
import StepsPopup from './components/StepsPopup.vue'
import * as CaseAPI from '@/apis/case'
import BaseItem from '@/components/BaseCard/BaseItem.vue'
import BaseCard from '@/components/BaseCard/BaseCard.vue'

const stepsPopupRef = ref()
const ypScrollViewRef = ref()
const pageParams = ref({
  pageNum: 1,
  pageSize: 4,
})
// const selectedTime = ref('all')
// const timeOptions = ref([
//   { text: '全部时间', value: 'all' },
//   { text: '今天', value: 'today' },
//   { text: '本周', value: 'week' },
//   { text: '本月', value: 'month' },
// ])

async function handleWatchProgress({ caseId }) {
  const { rows } = await CaseAPI.getCaseProcess(caseId)
  stepsPopupRef.value.open(caseId, rows)
}

async function getCaseListData() {
  return CaseAPI.getCaseList(pageParams.value)
}

onMounted(() => {
  ypScrollViewRef.value?.getData()
})
</script>

<template>
  <view class="case-list-container">
    <!-- 搜索栏 -->
    <!-- <view class="search-section">
      <wd-search
        v-model="searchKeyword"
        placeholder-left
        placeholder="搜索案件编号、案件名称"
        @search="handleSearch"
        @clear="handleClear"
        hide-cancel
        show-action
      />
    </view> -->

    <!-- 筛选栏 -->
    <!-- <view class="filter-section">
      <wd-drop-menu>
        <wd-drop-menu-item v-model="selectedStatus" :options="statusOptions" @change="handleStatusChange">
        </wd-drop-menu-item>
        <wd-drop-menu-item v-model="selectedTime" :options="timeOptions" @change="handleTimeChange">
        </wd-drop-menu-item>
      </wd-drop-menu>
    </view> -->

    <!-- 案件列表 -->
    <YpScrollView :query="getCaseListData" ref="ypScrollViewRef" v-model:page="pageParams">
      <template #default="{ list }">
        <view class="px-4">
          <BaseCard v-for="(item, index) in list" :key="item.caseId || index">
            <template #index>
              {{ index + 1 }}
            </template>
            <view class="mb-2">
              <text class="text-[24rpx] text-[#999] mr-2">
                案件编号
              </text>
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
            <template #actions>
              <view class="flex gap-2 mt-4">
                <wd-button type="primary" size="small" plain @click.stop="handleWatchProgress(item)">
                  查看案件进程
                </wd-button>
              </view>
            </template>
          </BaseCard>
        </view>
      </template>
    </YpScrollView>
  </view>
  <!-- 办理进程弹窗 -->
  <StepsPopup ref="stepsPopupRef" />
</template>

<style scoped lang="scss">
.case-list-container {
  height: 100vh;
}

.number {
  font-family: 'SF Mono', 'Consolas', 'monospace';
}
</style>

<route lang="json">
{
  "name": "caseList",
  "layout": "default",
  "auth": true,
  "style": {
    "navigationBarTitleText": "案件列表"
  }
}
</route>
