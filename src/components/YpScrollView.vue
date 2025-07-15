<script setup>
const props = defineProps({
  query: {
    type: Function,
    required: true,
  },
})
const list = ref([])
const refreshing = ref(false) // 下拉刷新状态
const loading = ref(false) // 加载状态
const moreStatus = ref('more') // 加载更多状态
const pageParams = ref({
  pageNum: 1,
  pageSize: 4,
})

async function getData() {
  try {
    const { rows, total } = await props.query(pageParams.value)

    if (pageParams.value.pageNum === 1) {
      list.value = rows
    } else {
      list.value.push(...rows)
    }

    if (list.value.length < total) {
      moreStatus.value = 'more'
      pageParams.value.pageNum++
    } else {
      moreStatus.value = 'noMore'
    }
  } catch (error) {
    console.error('加载案件列表失败:', error)
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
  console.log('handleScrolltoLower')
  if (moreStatus.value === 'noMore') {
    return
  }
  getData()
}

defineExpose({
  getData,
})
</script>

<template>
  <scroll-view
    class="h-full"
    scroll-y
    :refresher-enabled="true"
    :refresher-triggered="refreshing"
    @refresherrefresh="handleRefresh"
    @scrolltolower="handleScrolltoLower"
    enhanced
    :show-scrollbar="false"
  >
    <slot :list="list"></slot>
    <!-- 加载更多 -->
    <uni-load-more v-if="list.length > 0" :status="moreStatus" />
  </scroll-view>
</template>

<style scoped lang="scss">
.case-scroll-view {
  height: 100%;
}
</style>
