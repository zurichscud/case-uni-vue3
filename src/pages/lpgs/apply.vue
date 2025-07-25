<template>
  <view>
    <view class="boxuser">
      <view class="title">请上传证明</view>
      <view class="imginfo">
        请上传岗位证、职业资格证、获奖证明等能证明现在或曾经从事过保险行业的证明
      </view>
      <view class="loadImg" @click="selectApplyImage" v-if="!applyImg">
        <image class="img_show" src="../../static/xiangji.png" mode=""></image>
      </view>
      <view style="position: relative" @click="previewImage" v-if="!!applyImg">
        <image :src="applyImg.url" class="loadPhoto" mode="aspectFill"></image>
        <view class="boxX" @click.stop="handleRemoveImg">
          <image src="../../static/close.png" mode="" class="box_img"></image>
        </view>
      </view>
      <view class="">
        <view class="imginfo">
          <image
            style="
              width: 32rpx;
              height: 32rpx;
              vertical-align: middle;
              position: relative;
              top: -5rpx;
            "
            src="../../static/alert.png"
            mode=""
          ></image>
          上传图片只用于认证
        </view>
      </view>
      <view class="btnonImg" :class="[applyImg && !isUpload ? 'active' : '']" @click="onloadImg">
        下一步
      </view>
    </view>
  </view>
</template>

<script setup>
import { useUserStore } from '@/stores'
import * as LPGSAPI from '@/apis/lpgs'
import { uploadFile } from '@/utils/http'

const userStore = useUserStore()
const applyImg = ref({
  url: null,
  type: 0, //0本地图片，1远程图片
})
const id = ref(null)
const isUpload = ref(false)

async function getApplyData() {
  const { data } = await LPGSAPI.getApplyDataByUserId({
    userId: userStore.id,
  })
  id.value = data.id //记录id
  applyImg.value = {
    url: data.photoUrl,
    type: 1,
  }
}

//预览审核照片
function previewImage() {
  uni.previewImage({
    urls: [applyImg.value.url],
  })
}

//删除审核照片
function handleRemoveImg() {
  applyImg.value = {
    url: null,
    type: 0,
  }
}

function selectApplyImage() {
  uni.chooseMedia({
    count: 1, //默认9
    sizeType: ['original'], //可以指定是原图还是压缩图，默认二者都有
    success(res) {
      console.log(res.tempFiles[0].tempFilePath)
      applyImg.value.url = res.tempFiles[0].tempFilePath
      applyImg.value.type = 0
      isUpload.value = false
    },
    fail(res) {
      console.log(res, '失败')
    },
  })
}

async function onloadImg() {
  if (applyImg.value && !isUpload.value) {
    console.log('[ applyImg.value ]-87', applyImg.value)
    uni.showLoading({
      title: '图片上传中',
    })
    isUpload.value = true
    if (applyImg.value.type === 0) {
      const { data } = await uploadFile(tempFilePath)
      applyImg.value = {
        url: data,
        type: 1,
      }
    }
    await LPGSAPI.applyUpgard({
      photoUrl: applyImg.value.url,
      userId: userStore.id,
      id: id.value,
    })
    uni.hideLoading()
    uni.navigateTo({
      url: '/pages/lpgs/processing',
    })
  } else {
    uni.showToast({
      title: '请选择上传图片',
      icon: 'none',
    })
  }
}

onMounted(() => {
  getApplyData()
})
</script>

<style lang="scss" scoped>
.boxuser {
  color: #999999;
  text-align: center;

  .title {
    font-size: 72rpx;
    color: #333333;
    margin-top: 80rpx;
    margin-bottom: 30rpx;
    font-family: PingFang SC-中黑体, PingFang SC;
  }

  .loadPhoto {
    width: 526rpx;
    height: 726rpx;
    margin: 0 auto;
    border-radius: 20rpx;
    margin-top: 80rpx;
    margin-bottom: 100rpx;
  }

  .loadImg {
    width: 526rpx;
    height: 726rpx;
    background-color: #f4f4f4;
    margin: 0 auto;
    border-radius: 20rpx;
    margin-top: 80rpx;
    margin-bottom: 100rpx;
    display: flex;
    justify-content: center;
    align-items: center;

    .img_show {
      width: 138rpx;
      height: 112rpx;
    }
  }

  .boxX {
    width: 38px;
    height: 38px;
    background: rgba(0, 0, 0, 0.33);
    border-radius: 50%;
    box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.08);
    position: absolute;
    left: 0;
    right: 0;
    bottom: 145rpx;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;

    .box_img {
      width: 32rpx;
      height: 32rpx;
    }
  }

  .btnonImg {
    width: 580rpx;
    height: 88rpx;
    line-height: 88rpx;
    background-color: white;
    background-color: #cacaca;
    border-radius: 200rpx;
    margin: 0 auto;
    color: white;
    box-shadow: 0px 4px 10px 0px #cbcbcb;
  }

  .active {
    background: #3f9cff !important;
    box-shadow: 0px 4px 10px 0px rgba(63, 156, 255, 0.3) !important;
  }

  .imginfo {
    width: 526rpx;
    font-size: 28rpx;
    margin: 0 auto;
    margin-bottom: 30rpx;
  }
}
</style>

<route lang="json">
{
  "name": "lpgsApply",
  "layout": "default",
  "auth": true,
  "style": {
    "navigationBarTitleText": "申请入社"
  }
}
</route>
