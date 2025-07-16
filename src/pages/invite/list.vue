<script setup>
const ypScrollViewRef = ref(null)
const pageParams = ref({
  page: 1,
  pageSize: 4,
})

function getInviteListData() {

}
</script>

<template>
  <view class="invite-list">
    <YpScrollView :query="getInviteListData" ref="ypScrollViewRef" v-model:page="pageParams">
      <template #default="{ list }"></template>
    </YpScrollView>
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
  "style": {
    "navigationBarTitleText": "邀请列表"
  }
}
</route>
