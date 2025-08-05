<script setup>
defineProps({
  title: {
    type: String,
    default: '',
  },
  imageUrl: {
    type: String,
  },
})
onLoad((query) => {
  uni.setNavigationBarTitle({
    title: query.title,
  })
})
</script>

<template>
  <view class="main">
    <image lazy-load mode="widthFix" :src="imageUrl"></image>
  </view>
</template>

<style scoped lang="scss">
.main {
  position: relative;

  image {
    width: 100%;
    vertical-align: middle;
  }
}
</style>

<route lang="json">
{
  "name": "quickNewsDetail",
  "style": {
    "navigationBarTitleText": "赔案快报"
  }
}
</route>
