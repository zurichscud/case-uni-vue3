<script setup>
import { REMARK } from '@/enums/remark'
import { useUserStore } from '@/stores'
import QrcodePoster from '@/components/zhangyu-qrcode-poster/zhangyu-qrcode-poster.vue'

const posterRef = ref(null)
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
  posterRef.value.showCanvas()
}
onLoad((query) => {
  uni.setNavigationBarTitle({
    title: query.title,
  })
})
</script>

<template>
  <view class="main h-screen">
    <!-- 赔案快报 -->
    <image lazy-load mode="widthFix" :src="imageUrl" @click="handlePreview" />
    <!-- 分享按钮 -->
    <view class="py-2 px-4">
      <wd-button type="primary" size="large" block @click="handleShare" icon="share">
        <text>分享</text>
      </wd-button>
    </view>
    <!-- 海报 -->
    <QrcodePoster :header-img="imageUrl" ref="posterRef" />
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
