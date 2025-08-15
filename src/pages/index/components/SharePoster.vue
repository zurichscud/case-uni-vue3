<script setup>
import appConfig from '@/config/app'

const poster = ref(null)
const tempFilePath = ref(null)
const posterUrl = appConfig.invitePoster
const qrcodeUrl = ref('')

defineProps({
  qrcode: {
    type: String,
    default: '',
  },
})
function fail(e) {
  console.log('fail',e)
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function build(qrcode) {
  qrcodeUrl.value=qrcode
  console.log('[ qrcode ]-25', qrcode)
    await sleep(5000) // 暂停 5 秒
  // 如果返回的是base64是无法使用 saveImageToPhotosAlbum，需要设置 pathType为url
  try {
    const res = await poster.value.canvasToTempFilePath({
      fileType: 'jpg',
      quality: 1,
    })
    tempFilePath.value = res.tempFilePath
  } catch (e) {
    console.log(e)
    uni.showToast({
      title: '生成海报失败',
      icon: 'none',
    })
  }
  return tempFilePath.value
}

function save() {
  uni.saveImageToPhotosAlbum({
    filePath: tempFilePath.value,
    success() {
      uni.showToast({
        title: '已保存到相册',
        icon: 'success',
      })
    },
  })
}

defineExpose({
  build,
  save,
})
</script>

<template>
  <!-- 413*735 -->
  <l-painter
    css="width: 750rpx; background: linear-gradient(180deg,#ff971b 0%, #ff5000 100%)"
    :hidden="true"
    @fail="fail"
    path-type="url"
    ref="poster"
    performance
  >
    <l-painter-view css=" display: block">
      <!-- 海报 -->
      <l-painter-image :src="posterUrl" css="width: 100%; object-fit: cover;" />
      <!-- 二维码 -->
      <l-painter-view css="width: 100%;position: absolute;bottom:140rpx; display:flex;justify-content:center">
        <l-painter-image
          :src="qrcodeUrl"
          css="width: 200rpx; height: 200rpx; "
        />
      </l-painter-view>
    </l-painter-view>
  </l-painter>
</template>

<style scoped></style>
