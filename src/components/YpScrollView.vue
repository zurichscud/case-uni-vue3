<script setup>
// 获取数据接口
const props = defineProps({
  query: {
    type: Function,
    required: true,
  },
})
const pageParams = defineModel('page', {
  type: Object,
  default: () => ({
    pageNum: 1,
    pageSize: 4,
  }),
})

const list = ref([]) // 数据列表
const refreshing = ref(false) // 下拉刷新状态
const loading = ref(false) // 加载状态
const moreStatus = ref('more') // 加载更多状态


async function getData() {
  try {
    loading.value = true
    // 用户可以自定义如何进行请求
    const { rows, total } = await props.query()

    if (pageParams.value.pageNum === 1) {
      list.value = rows || []
    } else {
      list.value.push(...(rows || []))
    }

    if (list.value.length < total) {
      moreStatus.value = 'more'
      pageParams.value.pageNum++
    } else {
      moreStatus.value = 'noMore'
    }
  } catch (error) {
    console.error('加载案件列表失败:', error)
    moreStatus.value = 'more' // 错误时恢复可加载状态
    uni.showToast({
      title: '加载失败，请重试',
      icon: 'error',
    })
  } finally {
    loading.value = false
    refreshing.value = false
  }
}

async function handleRefresh() {
  refreshing.value = true
  pageParams.value.pageNum = 1
  moreStatus.value = 'more'
  await getData()
  refreshing.value = false
}

function handleScrolltoLower() {
  if (moreStatus.value === 'noMore' || loading.value) {
    return
  }
  moreStatus.value = 'loading'
  getData()
}

// 重置组件状态
function reset() {
  list.value = []
  refreshing.value = false
  loading.value = false
  moreStatus.value = 'more'
  pageParams.value = {
    pageNum: 1,
    pageSize: 4,
  }
}

defineExpose({
  getData,
  reset,
})
</script>

<template>
  <scroll-view
    class="yp-scroll-view"
    scroll-y
    :refresher-enabled="true"
    :refresher-triggered="refreshing"
    @refresherrefresh="handleRefresh"
    @scrolltolower="handleScrolltoLower"
    :lower-threshold="100"
    :enable-back-to-top="true"
    enhanced
    :show-scrollbar="false"
  >
    <slot :list="list"></slot>
    <!-- 空状态 -->
    <empty v-if="list.length === 0"></empty>
    <!-- 加载更多 -->
    <uni-load-more v-if="list.length > 0" :status="moreStatus" />
  </scroll-view>
</template>

<style scoped lang="scss">
.yp-scroll-view {
  height: 100%;
}
</style>
