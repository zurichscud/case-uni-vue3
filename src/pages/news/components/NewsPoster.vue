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
  <!-- 413*735 -->
  <l-painter
    css="width: 750rpx; background: linear-gradient(180deg,#ff971b 0%, #ff5000 100%)"
    :hidden="true"
    @fail="fail"
    @done="done"
    path-type="url"
    ref="poster"
    performance
  >
    <l-painter-view css=" display: block">
      <l-painter-view css="display: block;">
        <l-painter-image :src="src" css="width: 100%; object-fit: cover;" />
        <!-- 文字 -->
        <l-painter-view
          css="display:flex; justify-content: space-between; align-items: center;position: absolute;bottom: 0; background:#e8baa0; height:160rpx;padding-left: 46rpx;padding-right: 40rpx;"
        >
          <l-painter-view css="display:block">
            <l-painter-view css="display:flex; align-items: center;">
              <!-- 用户名 -->
              <l-painter-text
                :text="username"
                css="color: #41464F; font-size: 30rpx; fontWeight: bold; margin-right:40rpx;"
              />
              <!-- 手机号 -->
              <l-painter-text
                :text="phone"
                css="color: #41464F; font-size: 25rpx; fontWeight: bold"
              />
            </l-painter-view>

            <l-painter-text
              text="扫描二维码加入我的团队"
              css="display: block; color: #41464F; font-size: 25rpx; margin-top: 10rpx;"
            />
          </l-painter-view>
          <!-- 二维码 -->
          <l-painter-image :src="qrcode" css="width: 128rpx; height: 128rpx;" />
        </l-painter-view>
      </l-painter-view>
    </l-painter-view>
  </l-painter>
</template>

<style scoped>
.demo{
  color: #41464F;
}
</style>
