<script setup>
import { ref, computed } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { formatTime } from '@/utils/date'
import StepsPopup from './components/StepsPopup.vue'

const caseList = ref([])
const loading = ref(false)
const loadingMore = ref(false)
const refreshing = ref(false)
const hasMore = ref(true)
const pageNum = ref(1)
const pageSize = ref(10)
const progressVisible = ref(false)
const currentCase = ref(null)
// const selectedTime = ref('all')
// const timeOptions = ref([
//   { text: '全部时间', value: 'all' },
//   { text: '今天', value: 'today' },
//   { text: '本周', value: 'week' },
//   { text: '本月', value: 'month' },
// ])

// 模拟案件数据
const mockCaseList = ref([
  {
    caseId: 'CASE202501001',
    caseName: '交通事故理赔纠纷案',
    submitterName: '张三',
    caseSubmitTime: '2025-01-15 09:30:00',
    status: '2',
  },
  {
    caseId: 'CASE202501002',
    caseName: '医疗保险理赔争议',
    submitterName: '李四',
    caseSubmitTime: '2025-01-14 14:20:00',
    status: '1',
  },
  {
    caseId: 'CASE202501003',
    caseName: '财产保险损失评估',
    submitterName: '王五',
    caseSubmitTime: '2025-01-13 16:45:00',
    status: '3',
  },
  {
    caseId: 'CASE202501004',
    caseName: '人身意外险理赔',
    submitterName: '赵六',
    caseSubmitTime: '2025-01-12 11:15:00',
    status: '2',
  },
  {
    caseId: 'CASE202501005',
    caseName: '车险定损纠纷处理',
    submitterName: '钱七',
    caseSubmitTime: '2025-01-11 08:30:00',
    status: '4',
  },
])

// 生命周期
onLoad(() => {
  loadCaseList()
})

onShow(() => {
  // 页面显示时可以刷新数据
})

// 方法
async function loadCaseList(isRefresh = false, isLoadMore = false) {
  try {
    if (isRefresh) {
      refreshing.value = true
      pageNum.value = 1
    }
    else if (isLoadMore) {
      if (!hasMore.value || loadingMore.value) {
        return
      }
      loadingMore.value = true
      pageNum.value++
    }
    else {
      loading.value = true
      pageNum.value = 1
    }

    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 这里应该调用实际的API
    // const response = await fetchCaseList({
    //   pageNum: pageNum.value,
    //   pageSize: pageSize.value,
    //   keyword: searchKeyword.value,
    //   status: selectedStatus.value,
    //   timeRange: selectedTime.value
    // })

    // 模拟数据返回
    const mockData = mockCaseList.value.slice(0, pageSize.value)

    if (isRefresh || !isLoadMore) {
      caseList.value = mockData
    }
    else {
      caseList.value.push(...mockData)
    }

    // 模拟分页逻辑
    hasMore.value = pageNum.value < 3 // 假设总共3页数据
  }
  catch (error) {
    console.error('加载案件列表失败:', error)
    uni.showToast({
      title: '加载失败，请重试',
      icon: 'error',
    })
  }
  finally {
    loading.value = false
    loadingMore.value = false
    refreshing.value = false
  }
}

// function handleStatusChange(value) {
//   console.log('状态筛选:', value)
//   loadCaseList()
// }

// function handleTimeChange(value) {
//   console.log('时间筛选:', value)
//   loadCaseList()
// }

function handleRefresh() {
  loadCaseList(true)
}

function loadMore() {
  loadCaseList(false, true)
}

function handleWatchProgress(caseItem) {
  currentCase.value = caseItem
  progressVisible.value = true
}
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
    <scroll-view
      class="case-scroll-view"
      scroll-y
      :refresher-enabled="true"
      :refresher-triggered="refreshing"
      @refresherrefresh="handleRefresh"
      @scrolltolower="loadMore"
      enhanced
      :show-scrollbar="false"
    >
      <view class="case-list">
        <view v-for="(item, index) in caseList" :key="item.caseId || index" class="case-card">
          <!-- 序号 -->
          <view class="case-index">
            {{ index + 1 }}
          </view>

          <!-- 案件卡片头部 -->
          <view class="case-header">
            <view class="case-number">
              <text class="case-label">
                案件编号
              </text>
              <text class="case-id">
                {{ item.caseId }}
              </text>
            </view>
          </view>

          <!-- 案件名称 -->
          <view class="case-title">
            {{ item.caseName || '案件名称' }}
          </view>

          <!-- 案件信息 -->
          <view class="case-info">
            <view class="info-row">
              <view class="info-item">
                <wd-icon name="user" size="28rpx" color="#999"></wd-icon>
                <text class="info-label">
                  提交人
                </text>
                <text class="info-value">
                  {{ item.submitterName || item.nickName }}
                </text>
              </view>
            </view>

            <view class="info-row">
              <view class="info-item">
                <wd-icon name="time" size="28rpx" color="#999"></wd-icon>
                <text class="info-label">
                  提交时间
                </text>
                <text class="info-value">
                  {{ formatTime(item.caseSubmitTime || item.submitTime, 'YYYY-MM-DD HH:mm:ss') }}
                </text>
              </view>
            </view>
          </view>

          <!-- 操作按钮 -->
          <view class="case-actions">
            <wd-button type="primary" size="small" plain @click.stop="handleWatchProgress(item)">
              <view class="flex items-center">
                <text class="iconfont icon-renwujincheng mr-1"></text>
                <text>查看案件进程</text>
              </view>
            </wd-button>
          </view>
        </view>

        <!-- 空状态 -->
        <empty v-if="!loading && caseList.length === 0" text="暂无案件数据" />

        <!-- 加载更多 -->
        <!-- <view v-if="caseList.length > 0" class="load-more">
          <wd-loading v-if="loadingMore" type="spinner" size="32rpx">加载中...</wd-loading>
          <text v-else-if="hasMore" class="load-more-text" @click="loadMore">点击加载更多</text>
          <text v-else class="no-more-text">已加载全部数据</text>
        </view> -->
      </view>
    </scroll-view>
  </view>

  <!-- 办理进程弹窗 -->
  <StepsPopup v-model="progressVisible" />
</template>

<style scoped lang="scss">
.case-list-container {
  min-height: 100vh;
  background-color: #ffffff;
}

.case-scroll-view {
  height: 100vh;
}

.case-list {
  padding: 0 30rpx;
}

.case-card {
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
    background: linear-gradient(135deg,
      rgba(63, 156, 255, 0.15) 0%,
      rgba(82, 196, 26, 0.12) 30%,
      rgba(255, 193, 7, 0.1) 60%,
      rgba(220, 53, 69, 0.08) 100%);
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
    background: radial-gradient(circle,
      rgba(255, 255, 255, 0.8) 0%,
      rgba(255, 255, 255, 0.4) 50%,
      transparent 100%);
    border-radius: 50%;
    z-index: 2;
    animation: shimmer 3s ease-in-out infinite;
  }

  &:active {
    transform: scale(0.98);
    background: #f8f9fa;
  }
}

.case-index {
  position: absolute;
  top: 40rpx;
  right: 40rpx;
  font-size: 32rpx;
  color: #a1a0a0;
  font-weight: 600;
  z-index: 3;
  line-height: 1;
}

.case-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20rpx;
}

.case-number {
  flex: 1;

  .case-label {
    font-size: 24rpx;
    color: #999;
    margin-right: 16rpx;
  }

  .case-id {
    font-size: 28rpx;
    color: #333;
    font-weight: 600;
    font-family: 'SF Mono', Consolas, monospace;
  }
}

.case-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 24rpx;
  line-height: 1.4;
}

.case-info {
  margin-bottom: 24rpx;
}

.info-row {
  margin-bottom: 16rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.info-item {
  display: flex;
  align-items: center;

  .info-label {
    font-size: 26rpx;
    color: #666;
    margin: 0 12rpx 0 8rpx;
    min-width: 120rpx;
  }

  .info-value {
    font-size: 26rpx;
    color: #333;
    flex: 1;
  }
}

.case-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 20rpx;
  border-top: 1rpx solid #f0f0f0;
}

// 动画效果
@keyframes shimmer {
  0%, 100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4rpx);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.2);
  }
}

// 响应式设计
@media (max-width: 750rpx) {
  .case-card {
    margin: 16rpx 0;
    padding: 24rpx;
  }

  .case-title {
    font-size: 30rpx;
  }
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
