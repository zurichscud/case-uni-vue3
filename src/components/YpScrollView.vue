<script setup>

const refreshing = ref(false)
const moreStatus = ref('more')
const pageParams = ref({
  pageNum: 1,
  pageSize: 4,
})

const props = defineProps({
  query: {
    type: Function,
    required: true,
  },
})

async function getData() {
  try {

    const { rows, total } = await props.query(pageParams.value)

    if (pageParams.value.pageNum === 1) {
      caseList.value = rows
    } else {
      caseList.value.push(...rows)
    }

    if (caseList.value.length < total) {
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
    loadingMore.value = false
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
  if (moreStatus.value === 'noMore') {
    return
  }
  getData()
}
</script>

<template>
  <scroll-view
    class="case-scroll-view"
    scroll-y
    :refresher-enabled="true"
    :refresher-triggered="refreshing"
    @refresherrefresh="handleRefresh"
    @scrolltolower="handleScrolltoLower"
    enhanced
    :show-scrollbar="false"
  >
    <slot></slot>
  </scroll-view>
</template>

<style scoped lang="scss">
.case-scroll-view {
  height: 100%;
}
</style>
