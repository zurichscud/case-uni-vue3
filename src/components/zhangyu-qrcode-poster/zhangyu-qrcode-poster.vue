<script setup>
import { ref, getCurrentInstance } from 'vue'

const props = defineProps({
  //海报头图
  headerImg: {
    type: String,
    default: 'https://app.y9net.cn/data/00/00/rBEACGiTAwGATMIgAAg0YDPnDbU289.jpg',
  },
  title: {
    type: String,
    default: '标题',
  },
  subTitle: {
    type: String,
    default: '副标题',
  },
  tip: {
    type: String,
    default: '提示语',
  },
  //底部广告图
  abImg: {
    type: String,
    default: 'https://app.y9net.cn/data/01/33/wKgBNmNrSeSAbR2TAAEp5UKyBy8155.png',
  },
})
const canvasW = ref(uni.upx2px(550))
const canvasH = ref(uni.upx2px(1000))
const instance = getCurrentInstance()
const ctx = ref(uni.createCanvasContext('my-canvas', instance))
const isShow = ref(false)
const qrcode = ref('')

// 显示画布
function showCanvas(qrcodeParam) {
  isShow.value = true
  qrcode.value = qrcodeParam
  __init()
}

// 初始化画布
async function __init() {
  uni.showLoading({
    title: '加载中...',
    mask: true,
  })
  // 设置画布背景透明
  ctx.value.setFillStyle('rgba(255, 255, 255, 0)')
  // 设置画布大小
  ctx.value.fillRect(0, 0, canvasW.value, canvasH.value)
  // 绘制圆角背景
  drawRoundRect(ctx.value, 0, 0, canvasW.value, canvasH.value, uni.upx2px(18), '#FFFFFF')
  // 获取标题图片
  const headerImg = await getImageInfo(props.headerImg)
  const hW = uni.upx2px(550) //头图宽
  const hH = uni.upx2px(900) //头图高
  const border = (canvasW.value - hW) / 2
  // 绘制标题图
  drawRoundImg(ctx.value, headerImg.path, border, border, hW, hH, uni.upx2px(16))
  // 绘制标题
  // ctx.value.setFontSize(18) // 设置标题字体大小
  // ctx.value.setFillStyle('#333') // 设置标题文本颜色
  // const tY = border + hH + uni.upx2px(60) //标题y坐标
  // ctx.value.fillText(props.title, border, tY)
  // 绘制虚线
  const lineY = hH + uni.upx2px(30)
  drawDashLine(ctx.value, uni.upx2px(20), lineY, canvasW.value - uni.upx2px(20), lineY, 5)
  // 绘制提示文案
  const tipY = lineY + uni.upx2px(50)
  ctx.value.setFontSize(12)
  ctx.value.setFillStyle('#858585')
  ctx.value.fillText(props.tip, border + uni.upx2px(34), tipY)
  // 绘制abImg
  // 绘制二维码
  if (qrcode.value) {
    const qrcodeImg = await getImageInfo(qrcode.value)
    ctx.value.drawImage(
      qrcodeImg.path,
      uni.upx2px(384),
      lineY + uni.upx2px(20),
      uni.upx2px(156),
      uni.upx2px(156),
    )
  }

  // 延迟渲染
  setTimeout(() => {
    ctx.value.draw(true, () => {
      uni.hideLoading()
    })
  }, 500)
}

// 绘制虚线
function drawDashLine(ctxParam, x1, y1, x2, y2, dashLength) {
  ctxParam.setStrokeStyle('#cccccc') // 设置线条的颜色
  ctxParam.setLineWidth(1) // 设置线条宽度
  const dashLen = dashLength
  const xpos = x2 - x1 // 得到横向的宽度;
  const ypos = y2 - y1 // 得到纵向的高度;
  const numDashes = Math.floor(Math.sqrt(xpos * xpos + ypos * ypos) / dashLen)
  // 利用正切获取斜边的长度除以虚线长度，得到要分为多少段;
  for (let i = 0; i < numDashes; i++) {
    if (i % 2 === 0) {
      ctxParam.moveTo(x1 + (xpos / numDashes) * i, y1 + (ypos / numDashes) * i)
      // 有了横向宽度和多少段，得出每一段是多长，起点 + 每段长度 * i = 要绘制的起点；
    } else {
      ctxParam.lineTo(x1 + (xpos / numDashes) * i, y1 + (ypos / numDashes) * i)
    }
  }
  ctxParam.stroke()
}

// 带圆角图片
function drawRoundImg(ctxParam, img, x, y, width, height, radius) {
  ctxParam.beginPath()
  ctxParam.save()
  // 左上角
  ctxParam.arc(x + radius, y + radius, radius, Math.PI, Math.PI * 1.5)
  // 右上角
  ctxParam.arc(x + width - radius, y + radius, radius, Math.PI * 1.5, Math.PI * 2)
  // 右下角
  ctxParam.arc(x + width - radius, y + height - radius, radius, 0, Math.PI * 0.5)
  // 左下角
  ctxParam.arc(x + radius, y + height - radius, radius, Math.PI * 0.5, Math.PI)
  ctxParam.stroke()
  ctxParam.clip()
  ctxParam.drawImage(img, x, y, width, height)
  ctxParam.restore()
  ctxParam.closePath()
}

// 圆角矩形
function drawRoundRect(ctxParam, x, y, width, height, radius, color) {
  ctxParam.save()
  ctxParam.beginPath()
  ctxParam.setFillStyle(color)
  ctxParam.setStrokeStyle(color)
  ctxParam.setLineJoin('round') // 交点设置成圆角
  ctxParam.setLineWidth(radius)
  ctxParam.strokeRect(x + radius / 2, y + radius / 2, width - radius, height - radius)
  ctxParam.fillRect(x + radius, y + radius, width - radius * 2, height - radius * 2)
  ctxParam.stroke()
  ctxParam.closePath()
}

// 获取图片
function getImageInfo(imgSrc) {
  return new Promise((resolve, reject) => {
    // 检查图片路径是否有效
    if (!imgSrc || typeof imgSrc !== 'string') {
      const error = new Error(`图片路径无效: ${imgSrc}`)
      reject(error)
      console.log('获取图片失败：图片路径无效', imgSrc)
      return
    }

    uni.getImageInfo({
      src: imgSrc,
      success: (image) => {
        resolve(image)
        console.log('获取图片成功', image)
      },
      fail: (err) => {
        reject(err)
        console.log('获取图片失败', err)
      },
    })
  })
}

// 保存图片到相册
function saveImage() {
  // 判断用户授权
  uni.getSetting({
    success(res) {
      console.log('获取用户权限', res.authSetting)
      if (Object.keys(res.authSetting).length > 0) {
        // 判断是否有相册权限
        if (res.authSetting['scope.writePhotosAlbum'] === undefined) {
          // 打开设置权限
          uni.openSetting({
            success(_res) {
              console.log('设置权限', _res.authSetting)
            },
          })
        } else {
          if (!res.authSetting['scope.writePhotosAlbum']) {
            // 打开设置权限
            uni.openSetting({
              success(_res) {
                console.log('设置权限', _res.authSetting)
              },
            })
          }
        }
      }
    },
  })
  uni.canvasToTempFilePath(
    {
      canvasId: 'my-canvas',
      quality: 1,
      complete: (res) => {
        console.log('保存到相册', res)
        uni.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: (_res) => {
            uni.showToast({
              title: '已保存到相册',
              icon: 'success',
              duration: 2000,
            })
            setTimeout(() => {
              isShow.value = false
            }, 2000)
          },
        })
      },
    },
    instance,
  )
}

defineExpose({
  showCanvas,
})
</script>

<template>
  <view class="content" v-if="isShow" @click.stop="isShow = false">
    <canvas
      @click.stop=""
      :style="{ width: canvasW + 'px', height: canvasH + 'px' }"
      canvas-id="my-canvas"
    ></canvas>
    <view class="save-btn" @click.stop="saveImage">保存图片</view>
  </view>
</template>

<style scoped lang="scss">
.content {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .save-btn {
    margin-top: 35rpx;
    color: #ffffff;
    background: linear-gradient(to right, #fe726b, #fe956b);
    padding: 15rpx 40rpx;
    border-radius: 50rpx;
  }
}
</style>
