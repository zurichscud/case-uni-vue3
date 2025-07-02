<template>
  <view class="">
    <view
      class=""
      style="display: flex; width: 100%; border-bottom: 1rpx solid #dddddd; padding-bottom: 12rpx"
    >
      <view class="title">
        <text :class="indexs == 0 ? 'active' : ''" class="text1" @click="indexsSet(0)">附件</text>
      </view>
      <view class="title">
        <text :class="indexs == 1 ? 'active' : ''" class="text1" @click="indexsSet(1)">图片</text>
      </view>
    </view>
    <swiper class="swiper" :duration="500" :current="indexs" @change="indexsget">
      <swiper-item>
        <view class="swiper-item">
          <view class="queye" v-if="FileList.length == 0"> 无内容 </view>
          <scroll-view scroll-y="true" class="scroll-Y">
            <view
              v-for="(item, index) in FileList"
              :key="index"
              class="textadd"
              @click="download(item.documentUrl)"
            >
              <view class="fileStyle">
                <view class="" style="">
                  <image
                    :src="item.documentUrl | fileUrl"
                    mode=""
                    style="width: 80rpx; height: 80rpx"
                  ></image>
                </view>
                <view class="" style="margin-left: 20rpx; position: relative">
                  <view
                    class=""
                    style="
                      position: absolute;
                      top: 15rpx;
                      right: -284rpx;
                      color: #9d9d9d;
                      font-size: 24rpx;
                    "
                  >
                    {{ item.creatTime }}
                  </view>
                  <view class="fileName">
                    {{ item.name }}
                  </view>
                  <view class="fileTime">
                    {{ item.userId ? '用户' : '专家' }}
                  </view>
                </view>
              </view>
            </view>
          </scroll-view>
        </view>
      </swiper-item>
      <swiper-item>
        <view class="swiper-item">
          <view class="queye" v-if="urls.length == 0"> 无内容 </view>
          <scroll-view scroll-y="true" class="scroll-Y">
            <view
              v-for="(item, index) in urls"
              style="
                display: inline-block;
                width: 146rpx;
                height: 146rpx;
                overflow: hidden;
                margin: 2rpx 3rpx;
              "
              :key="index"
            >
              <view
                class="zoomImage"
                @click="openImage(index)"
                :style="{
                  backgroundImage: 'url(' + item + ')'
                }"
              >
              </view>
            </view>
          </scroll-view>
        </view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        FileList: [],
        urls: [],
        options: {},
        indexs: 0
      }
    },
    async onLoad(options) {
      this.options = options
      await this.getFile()
      await this.getimgs()
    },
    filters: {
      fileUrl(url) {
        let value = url.split('.')
        if (value[value.length - 1] != 'pdf') {
          return 'https://app.y9net.cn/data/01/32/wKgBNmNbb6WAJdTvAAANuxHmxvQ073.png'
        } else {
          return 'https://app.y9net.cn/data/01/32/wKgBNmNbb8WAOJqTAAAKj1Rk9sM643.png'
        }
      }
    },

    methods: {
      // 获取附件数据
      async getFile() {
        let { datas } = await this.$api.selectFileUploadByCaseChat({
          caseId: this.options.caseId
        })

        this.FileList = datas
      },
      // 查找图片记录
      async getimgs() {
        let { datas } = await this.$api.selectPhotoUploadByCaseChat({
          caseId: this.options.caseId
        })
        let url = []
        datas.forEach((el) => {
          url.push(el.photoUrl)
        })
        this.urls = url
      },
      // 图片
      openImage(i) {
        uni.previewImage({
          urls: this.urls,
          current: i,
          loop: true
        })
      },

      // 查看附件
      download(url) {
        uni.downloadFile({
          url: url,
          success: (res) => {
            if (res.statusCode === 200) {
              let filePath = res.tempFilePath
              uni.openDocument({
                filePath: filePath,
                showMenu: true,
                success: function (res) {}
              })
            }
          }
        })
      },
      indexsSet(indexs) {
        this.indexs = indexs
      },
      indexsget(e) {
        this.indexs = e.detail.current
      }
    }
  }
</script>

<style scoped lang="scss">
  .title {
    flex: 1;
    font-size: 28rpx;
    color: #999999;
    text-align: center;
    height: 6vh;
    line-height: 7vh;
    .text1 {
      display: inline-block;
      height: 76rpx;
      line-height: 104rpx;
    }
  }
  .swiper {
    height: 91vh;
    margin-top: 10rpx;
  }
  .active {
    font-size: 36rpx;
    font-weight: 600 !important;
    border-bottom: 10rpx solid #3f9cff;

    color: #111111;
  }
  .queye {
    text-align: center;
    color: #999999;
    font-size: 28rpx;
    margin-top: 40rpx;
  }

  .zoomImage {
    display: inline-block;
    width: 100%;
    height: 0;
    padding-bottom: 100%;
    overflow: hidden;
    background-position: center center;
    background-repeat: no-repeat;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    background-size: cover;
  }
  .scroll-Y {
    height: 92vh;
    width: 100%;
  }
  .textadd {
    padding: 20rpx 32rpx;
  }
  .fileStyle {
    border-bottom: 1rpx solid #ddd;
    display: flex;
    padding-bottom: 20rpx;
    .fileTime {
      color: #9d9d9d;
      font-size: 24rpx;
    }
    .fileName {
      margin-bottom: 10rpx;
      width: 300rpx;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
</style>
