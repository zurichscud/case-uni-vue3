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
const visible = ref(false)
const posterUrl = ref('')

function handleClose() {
  visible.value = false
  posterUrl.value = ''
}

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
  posterUrl.value = res
  visible.value = true
  uni.hideLoading()
}

function handleSave() {
  uni.saveImageToPhotosAlbum({
    filePath: posterUrl.value,
    success() {
      uni.showToast({
        title: '已保存到相册',
        icon: 'success',
        duration: 2000,
      })
      handleClose()
    },
  })
}

function handlePreviewPoster() {
  uni.previewImage({
    urls: [posterUrl.value],
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
    <!-- 海报画板 -->
    <news-poster
      ref="posterRef"
      :username="userStore.nickName"
      :src="imageUrl"
      :qrcode="QRURL"
      :phone="userStore.mobile"
    />
    <wd-popup
      v-model="visible"
      position="center"
      closable
      custom-style="border-radius: 20rpx;background: transparent;"
      @close="handleClose"
    >
      <view class="w-[700rpx] h-[80vh]">
        <image
          :src="posterUrl"
          style="height: 1000rpx"
          mode="aspectFit"
          @click="handlePreviewPoster"
        />
        <view class="flex justify-center items-center mt-4">
          <wd-button size="large" type="primary" icon="download" @click="handleSave">
            保存
          </wd-button>
        </view>
      </view>
    </wd-popup>
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
