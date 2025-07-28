<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const url = ref('')
onLoad((query) => {
  url.value = query.url
  uni.setNavigationBarTitle({
    title: query.title,
  })
})
</script>

<template>
 <web-view :src="url"></web-view>
</template>

<style scoped></style>

<route lang="json">
{
  "name": "webview"
}
</route>
