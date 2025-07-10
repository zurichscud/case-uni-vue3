<!-- 经典案例 -->
<template>
  <view>
    <view class="articleDetail" v-if="loading">
      <view class="title">
        {{ dataObj.title }}
      </view>
      <view class="readNum">阅读量：{{ dataObj.readingVolume }}</view>
      <rich-text :nodes="dataObj.content" class="richTextInfo"></rich-text>
    </view>
    <promptBtm></promptBtm>
  </view>
</template>

<script setup>
  import { ref } from 'vue'
  import { onLoad } from '@dcloudio/uni-app'
  import promptBtm from '@/components/promptBtm.vue'
  import * as ArticleAPI from '@/apis/article'

  const dataObj = ref({})
  const loading = ref(false)

  async function fetchdetails(id) {
    uni.showLoading({
      title: '加载中',
    })
    const { data } = await ArticleAPI.getArticle({ articleId: id })
    let article = data
    article.content = article.content.replace(/section/gi, 'p')
    article.content = article.content.replace(/h-inner/gi, 'div')
    article.content = article.content.replace(/h-char/gi, 'div')
    article.content = article.content.replace(/<p>&nbsp;<\/p>/gi, '<br/>')
    article.content = article.content.replace(/<p><strong>&nbsp;<\/strong><\/p>/gi, '<br/>')
    article.content = article.content.replace(
      /<img [^>]*src=['"]([^'"]+)[^>]*>/gi,
      function (match, reSrc) {
        //reSrc,返回每个匹配的字符串
        var newImg = '<img src="' + reSrc + '" alt="加载中" style="max-width:100%;height:auto" />'
        //by. dj_g
        return newImg
      },
    )
    dataObj.value = article
    uni.hideLoading()
    loading.value = true
  }

  onLoad((query) => {
    fetchdetails(query.id)
  })
</script>

<style scoped lang="scss">
  .articleDetail {
    padding: 40rpx 30rpx;
  }

  .title {
    display: block;
    line-height: 72rpx;
    font-size: 48rpx;
    font-weight: 600;
  }

  .readNum {
    display: block;
    font-size: 24rpx;
    color: #b2b2b2;
    margin: 30rpx 0;
  }

  .richTextInfo {
    letter-spacing: 6rpx;
    line-height: 50rpx;
    text-align: justify;
  }
</style>


<route lang="json">{
  "name": "detail",
  "style": {
    "navigationBarTitleText": "案例详情"
  }
}</route>
