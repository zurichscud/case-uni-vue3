<!-- 更多案例 -->
<template>
  <view class="container">
    <scroll-view
      class="scroll-container"
      scroll-y
      @scrolltolower="loadMore"
      :lower-threshold="100"
      enhanced
      :show-scrollbar="false"
      :enable-back-to-top="true"
      :refresher-enabled="false"
    >
      <view class="box_page">
        <view v-for="(item, index) in dataList" :key="index" class="boxlist">
          <typicalCase :item="item"></typicalCase>
        </view>
      </view>

      <uni-load-more :status="loadMoreState" @click-load-more="loadMore" />
    </scroll-view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import typicalCase from '../components/TypicalCase.vue'
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
      pageSize: 8,
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
  console.log('onScrolltolower', loadMoreState.value)

  if (loadMoreState.value === 'loading' || loadMoreState.value === 'noMore') {
    console.log('loadMore blocked due to state:', loadMoreState.value)
    return
  }

  if (dataList.value.length >= total.value) {
    loadMoreState.value = 'noMore'
    console.log('All data loaded, setting state to noMore')
    return
  }

  console.log('Loading more data, page:', pageNum.value + 1)
  pageNum.value++
  await getArticleListData(true)
}

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
  height: 0; // 重要：让flex子元素正确计算高度
}

.box_page {
  padding: 0 40rpx;
  min-height: 100rpx; // 确保有最小高度

  .boxlist {
    border-top: 1px solid #f1f1f1;
  }

  .boxlist:first-child {
    border-top: none;
  }
}

// uni-load-more组件在scroll-view中的样式
:deep(.uni-load-more) {
  padding: 20rpx 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

<route lang="json">{
  "name": "more",
  "style": {
    "navigationBarTitleText": "更多案例"
  }
}</route>
