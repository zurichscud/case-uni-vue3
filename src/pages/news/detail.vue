<script setup>
import { REMARK } from '@/enums/remark'
import { useUserStore } from '@/stores'

const userStore = useUserStore()
const remark = computed(() => userStore.remark)
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  imageUrl: {
    type: String,
  },
})

function handlePreview() {
  uni.previewImage({
    urls: [props.imageUrl],
  })
}

function handleShare() {
  if (remark.value === REMARK.BaoMin) {
    uni.showToast({
      title: '保民暂时不支持分享哦～',
      icon: 'none',
    })
    return
  }
  //TODO：生成分享图片
}
onLoad((query) => {
  uni.setNavigationBarTitle({
    title: query.title,
  })
})
</script>

<template>
  <view class="main h-screen">
    <image lazy-load mode="widthFix" :src="imageUrl" @click="handlePreview" />
    <view class="py-2 px-4">
      <wd-button type="primary" size="large" block @click="handleShare" icon="share">
        <text>分享</text>
      </wd-button>
    </view>
  </view>
</template>

<style scoped lang="scss">
.main {
  position: relative;
  background-color: #e8baa0;

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
