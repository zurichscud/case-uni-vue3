<script setup lang="ts">
import { useAppStore } from '@/stores'

const appStore = useAppStore()

onLaunch(() => {
  // #ifdef MP-WEIXIN
  const { miniProgram } = uni.getAccountInfoSync()
  //version:线上小程序版本号（仅在正式版小程序上支持）
  appStore.setWxVersion(miniProgram.version)
  // #endif
})
</script>

<style lang="scss"></style>
