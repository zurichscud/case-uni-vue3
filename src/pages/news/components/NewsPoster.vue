<script setup>
const poster = ref(null)
const tempFilePath = ref(null)

defineProps({
  username: {
    type: String,
    default: '',
  },
  src: {
    type: String,
    default: '',
  },
  phone: {
    type: String,
    default: '',
  },
  qrcode: {
    type: String,
    default: '',
  },
})

function fail(e) {
  console.log(e)
}

function done(e) {
  console.log(e)
}

async function save() {
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

function saveImg() {
  uni.saveImageToPhotosAlbum({
    filePath: tempFilePath.value,
    success() {
      uni.showToast({
        title: '已保存到相册',
        icon: 'success',
        duration: 2000,
      })
    },
  })
}

defineExpose({
  save,
  saveImg,
})
</script>

<template>
  <l-painter
    css="width: 750rpx;padding-top: 10rpx; padding-bottom: 10rpx; background: linear-gradient(180deg,#ff971b 0%, #ff5000 100%)"
    :hidden="false"
    @fail="fail"
    @done="done"
    path-type="url"
    ref="poster"
    performance
  >
    <l-painter-view css="padding-left: 10px;padding-right: 10px; display: block">
      <l-painter-view css="display: block; margin-bottom: 10rpx;">
        <l-painter-image :src="src" css="width: 100%; object-fit: cover;" />
      </l-painter-view>

      <l-painter-view css="display:flex; justify-content: space-between; align-items: center;">
        <l-painter-view css="display:block">
          <l-painter-view css="display:flex; align-items: center;">
            <!-- 用户名 -->
            <l-painter-text
              :text="username"
              css="color: #ffffff; font-size: 35rpx; fontWeight: bold; margin-right:40rpx;"
            />
            <!-- 手机号 -->
            <l-painter-text
              :text="phone"
              css="color: #ffffff; font-size: 30rpx; fontWeight: bold"
            />
          </l-painter-view>

          <l-painter-text
            text="扫描二维码加入我的团队"
            css="display: block; color: rgba(255,255,255,.7); font-size: 28rpx; margin-top: 10rpx;"
          />
        </l-painter-view>
        <l-painter-image :src="qrcode" css="width: 128rpx; height: 128rpx;" />
      </l-painter-view>
    </l-painter-view>
  </l-painter>
</template>

<style scoped></style>
