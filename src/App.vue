<script setup lang="ts">
import { useAppStore } from '@/stores'

const appStore = useAppStore()

onLaunch(() => {
  // #ifdef MP-WEIXIN
  const { miniProgram } = uni.getAccountInfoSync()
  //version:线上小程序版本号（仅在正式版小程序上支持）
  appStore.setApp({
    wxVersion: miniProgram.version,
    envVersion: miniProgram.envVersion,
  })
  console.log(appStore.envVersion);

  // #endif
})
</script>

<style lang="scss">
@import '@tuniao/tn-style/dist/uniapp/index.css';
@import '@/style/index.scss';
@import '@/style/iconfont.css';
@import '@/style/font.scss';
</style>
