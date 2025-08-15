<script setup lang="ts">
import CityPicker from './components/CityPicker/index.vue'

const cityPickerVisible = ref(false)

function handleRegionChange({ cityName }: { cityName: string }) {
  cityPickerVisible.value = false
  //存在不以市结尾的城市
  console.log(cityName.slice(0, -1))
}
</script>

<template>
  <view class="h-screen bg-gray-100">

  </view>

  <!-- 省市区选择，uniapp的picker组件，不支持三级联动 -->
  <CityPicker
    column="2"
    :visible="cityPickerVisible"
    @confirm="handleRegionChange"
    @cancel="() => (cityPickerVisible = false)"
  />
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
