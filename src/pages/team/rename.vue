<script setup lang="ts">
import CityPicker from './components/CityPicker/index.vue'
import TnTitle from '@tuniao/tnui-vue3-uniapp/components/title/src/title.vue'
import TnInput from '@tuniao/tnui-vue3-uniapp/components/input/src/input.vue'
import TnModal from '@tuniao/tnui-vue3-uniapp/components/modal/src/modal.vue'

const cityPickerVisible = ref(false)
const formData = ref({
  city: '',
  custom: '',
})
const modalRef = ref()

function handleRegionChange({ cityName }: { cityName: string }) {
  cityPickerVisible.value = false
  //存在不以市结尾的城市
  // console.log(cityName.slice(0, -1))
  formData.value.city = cityName
}

function handleSubmit() {
  console.log(formData.value)
  modalRef.value?.showModal({
    title: '提示',
    content: `您新的团队名为：理赔公社${formData.value.city}${formData.value.custom}分社，是否确认提交`,
    showCancel: true,
    confirmText: '确认',
    cancelText: '我再想想',
    confirm: () => {
      console.log('点击了确认按钮')
    },
  })
}
</script>

<template>
  <view class="h-screen box-border px-4">
    <wd-gap height="10"></wd-gap>
    <view class="flex flex-col gap-2 my-6">
      <TnTitle title="城市" mode="hLine" size="lg" />
      <TnInput
        v-model="formData.city"
        type="select"
        placeholder="请选择城市"
        size="lg"
        @click="cityPickerVisible = true"
      />
    </view>

    <view class="flex flex-col gap-2 my-6">
      <TnTitle title="自定义词语" mode="hLine" size="lg" />
      <TnInput
        v-model="formData.custom"
        placeholder="请输入自定义团队名称部分，最多可输入4个字符"
        clearable
        trim
        :maxlength="4"
      />
    </view>
    <wd-gap height="50"></wd-gap>
    <wd-button block type="primary" @click="handleSubmit">提交</wd-button>
  </view>

  <!-- 省市区选择，uniapp的picker组件，不支持三级联动 -->
  <CityPicker
    column="2"
    :visible="cityPickerVisible"
    @confirm="handleRegionChange"
    @cancel="() => (cityPickerVisible = false)"
  />
  <TnModal ref="modalRef" />
</template>

<style scoped lang="scss"></style>

<route lang="json">
{
  "name": "renameTeamName",
  "layout": "default",
  "auth": true,
  "style": {
    "navigationBarTitleText": "命名我的团队"
  }
}
</route>
