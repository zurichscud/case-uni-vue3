<!-- 更多案例 -->
<template>
  <view class="container">
    <view class="box_page">
      <view v-for="(item, index) in dataList" :key="index" class="boxlist">
        <typicalCase :item="item"></typicalCase>
      </view>
    </view>

    <uni-load-more
      :status="loadMoreState"
      @clickLoadMore="loadMore"
    />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad, onReachBottom } from '@dcloudio/uni-app'
import typicalCase from '../index/components/typical-case.vue'
import * as ArticleAPI from '@/apis/article'

const dataList = ref([])
const pageNum = ref(1)
const total = ref(0)
const loadMoreState = ref('more') // more, loading, noMore

async function getArticleListData(isLoadMore = false) {
  try {
    loadMoreState.value = 'loading'
    const pageParam = {
      pageNum: pageNum.value,
      pageSize: 5,
    }
    const { rows, total: totalCount } = await ArticleAPI.getArticleList(pageParam, {})
    if (isLoadMore) {
      dataList.value.push(...rows)
    } else {
      dataList.value = rows
    }

    total.value = totalCount

    // 判断是否已加载完所有数据
    if (dataList.value.length >= total.value) {
      loadMoreState.value = 'noMore'
    } else {
      loadMoreState.value = 'more'
    }
  } catch (error) {
    console.error('加载数据失败:', error)
    loadMoreState.value = 'more'
  }
}

// 加载更多数据
async function loadMore() {
  if (loadMoreState.value === 'loading' || loadMoreState.value === 'noMore') {
    return
  }

  if (dataList.value.length >= total.value) {
    loadMoreState.value = 'noMore'
    return
  }

  pageNum.value++
  await getArticleListData(true)
}

// 滚动到底部触发
onReachBottom(() => {
  console.log('[  ]-87', '到底啦')
  if (loadMoreState.value !== 'loading' && loadMoreState.value !== 'noMore') {
    loadMore()
  }
})

onLoad(() => {
  getArticleListData()
})
</script>

<style scoped lang="scss">
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.scroll-container {
  flex: 1;
  height: 100%;
}

.box_page {
  padding: 0 40rpx;

  .boxlist {
    padding: 32rpx 0;
    border-top: 1px solid #f1f1f1;
  }

  .boxlist:first-child {
    border-top: none;
  }
}
</style>
