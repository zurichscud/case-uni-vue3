<template>
  <view class="h-screen px-3 box-border">
    <wd-gap height="30"></wd-gap>
    <wd-steps :active="active" align-center>
      <wd-step icon="edit-1" title="填写资料" />
      <wd-step icon="clock" title="审核中" />
      <wd-step icon="check1" title="审核结果" />
    </wd-steps>
    <wd-gap height="30"></wd-gap>
    <!--表单 -->
    <view v-if="active !== 2">
      <view class="flex flex-col gap-4 my-6">
        <TnTitle title="现任职岗位/职业" mode="vLine" />
        <TnInput v-model="formData.profession" placeholder="请输入现任职岗位/职业" />
      </view>
      <view class="flex flex-col gap-2 my-6">
        <TnTitle title="现服务企业" mode="vLine" />
        <TnInput v-model="formData.company" placeholder="请输入现服务企业" />
      </view>
      <view class="flex flex-col gap-2 my-6">
        <TnTitle title="证明材料" mode="vLine" />
        <wd-notice-bar
          text="请上传岗位证、职业资格证、获奖证明等能证明现在或曾经从事过保险行业的证明"
          prefix="warn-bold"
        />
        <TnImageUpload
          v-model="imageList"
          :custom-upload-handler="uploadImage"
          :limit="1"
          :show-error-tips="false"
        />
      </view>
      <view class="text-center text-xs text-gray-500 mb-2" v-if="lastSubmitTime">
        上次提交时间：{{ lastSubmitTime }}
      </view>
      <wd-button size="large" block type="primary" @click="handleSubmit">
        {{ submitBtnText }}
      </wd-button>
    </view>
    <!-- 审核结果 -->
    <view v-else>
      <view class="flex flex-col items-center justify-center">
        <image :src="noPass" style="width: 500rpx; height: 500rpx" mode="scaleToFill" />
        <view class="text-center text-xl text-gray-500 mb-8">审核不通过</view>
        <view class="text-center text-xs text-gray-500 mb-2">驳回理由：</view>
        <view class="text-center text-xs text-gray-500 mb-8">{{ formData.failureReason }}</view>
        <wd-button  block type="primary" @click="handleReSubmit">
          重新申请
        </wd-button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores'
import * as LPGSAPI from '@/apis/lpgs'
import { uploadFile } from '@/utils/http'
import TnTitle from '@tuniao/tnui-vue3-uniapp/components/title/src/title.vue'
import TnInput from '@tuniao/tnui-vue3-uniapp/components/input/src/input.vue'
import TnImageUpload from '@tuniao/tnui-vue3-uniapp/components/image-upload/src/image-upload.vue'
import type { ImageUploadFile } from '@tuniao/tnui-vue3-uniapp'
import noPass from '@/static/no-pass.png'

const active = ref(0)
const userStore = useUserStore()
const id = ref<number>()
const lastSubmitTime = ref<string>()
const formData = ref({
  profession: '',
  company: '',
  failureReason: '',
})
const imageList = ref<string[]>([])
const submitBtnText = computed(() => {
  if (active.value === 0) {
    return '提交'
  } else {
    return '修改'
  }
})

//获取上一次的申请记录
async function getApplyData() {
  const { data } = await LPGSAPI.getApplyDataByUserId({
    userId: userStore.id!,
  })
  id.value = data.id //记录id
  imageList.value = [data.photoUrl]
  formData.value = {
    ...data,
  }
  lastSubmitTime.value = data.submitTime
  if (data.status === 0) {
    active.value = 1
  } else {
    active.value = 2
  }
}

//重新申请
async function handleReSubmit() {
  active.value = 0
}

//自定义上传函数
async function uploadImage(file: ImageUploadFile) {
  const { data } = await uploadFile((file as UniApp.ChooseImageSuccessCallbackResultFile).path)
  return data
}

async function handleSubmit() {
  if (!imageList.value[0]) {
    uni.showToast({
      title: '请上传证明材料',
      icon: 'none',
    })
    return
  }
  if (!formData.value.profession) {
    uni.showToast({
      title: '请输入现任职岗位/职业',
      icon: 'none',
    })
    return
  }
  if (!formData.value.company) {
    uni.showToast({
      title: '请输入现服务企业',
      icon: 'none',
    })
    return
  }
  await LPGSAPI.applyUpgard({
    photoUrl: imageList.value[0],
    userId: userStore.id!,
    id: id.value,
    profession: formData.value.profession,
    company: formData.value.company,
  })
  uni.showToast({
    title: '提交成功',
    icon: 'success',
  })
}

onMounted(() => {
  getApplyData()
})
</script>

<style lang="scss" scoped></style>

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
