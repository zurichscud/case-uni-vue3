<script setup>
import { REMARK } from '@/enums/remark'
import { useUserStore } from '@/stores'
import NewsPoster from './components/NewsPoster.vue'
import { useQRcode } from '@/hooks/useQRcode'

const { QRURL, getMyQRcodeData } = useQRcode()
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  imageUrl: {
    type: String,
  },
})
const posterRef = ref(null)
const userStore = useUserStore()
const remark = computed(() => userStore.remark)
const loading = ref(false)

function handlePreview() {
  uni.previewImage({
    urls: [props.imageUrl],
  })
}

async function handleShare() {
  if (remark.value === REMARK.BaoMin) {
    uni.showToast({
      title: '保民暂时不支持分享哦～',
      icon: 'none',
    })
    return
  }

  uni.showLoading({
    title: '生成海报中...',
  })
  const res = await posterRef.value.save()
  uni.saveImageToPhotosAlbum({
    filePath: res,
    success() {
      uni.showToast({
        title: '已保存到相册',
        icon: 'success',
        duration: 2000,
      })
    },
    complete() {
      uni.hideLoading()
    },
  })
}

onLoad((query) => {
  getMyQRcodeData()
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
      <wd-button
        type="primary"
        size="large"
        block
        @click="handleShare"
        icon="share"
        :loading="loading"
      >
        <text>分享</text>
      </wd-button>
    </view>
    <!-- 海报 -->
    <news-poster
      ref="posterRef"
      :username="userStore.nickName"
      :src="imageUrl"
      :qrcode="QRURL"
      :phone="userStore.mobile"
    />
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
  "layout": "default",
  "auth": true,
  "style": {
    "navigationBarTitleText": "赔案快报"
  }
}
</route>
