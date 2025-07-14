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

 async function handleRefresh() {
  refreshing.value = true
  pageParams.value.pageNum = 1
  moreStatus.value = 'more'
  await props.query()
  refreshing.value = false
}

function handleScrolltoLower() {
  if (moreStatus.value === 'noMore') {
    return
  }
  props.query()
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
