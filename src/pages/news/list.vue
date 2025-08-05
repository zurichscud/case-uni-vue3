<script setup>
import NewsCard from './components/NewsCard.vue'
import * as NewsAPI from '@/apis/news'
import router from '@/utils/router'

const list = ref([])

async function getNewsListData() {
  const { rows } = await NewsAPI.getNewsList()
  list.value = rows
}

function toDetail(item) {
  router.push('/pages/news/detail', { title: item.title, imageUrl: item.imageUrl })
}

onLoad(() => {
  getNewsListData()
})
</script>

<template>
  <view class="h-screen bg-gray-100 p-4">
    <NewsCard
      :title="item.title"
      v-for="(item, index) in list"
      :key="index"
      @to="toDetail(item)"
    />
  </view>
</template>

<style scoped></style>

<route lang="json">
{
  "name": "quickNews",
  "style": {
    "navigationBarTitleText": "赔案快报"
  }
}
</route>
