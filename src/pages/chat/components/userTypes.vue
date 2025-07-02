<template>
  <view class="">
    <view
      class=""
      :class="list.type == 3 || list.type == 2 ? 'lefts' : 'rights'"
      v-if="list.msgType != 5"
    >
      <view
        class="fixed"
        :class="[list.type == 3 || list.type == 2 ? 'fixed' : 'fixed1', fixed ? 'fixeds' : '']"
        ref="child"
      >
        <view class="">
          <view class="" v-if="list.type == 1">
            <image :src="list.userPhoto" mode="" class="img"></image>
          </view>
          <view v-else-if="list.type == 2">
            <image :src="list.expertPhoto" mode="" class="img"></image>
          </view>
          <view class="" v-else-if="list.type == 3">
            <image
              src="https://app.y9net.cn/images/imgs/icon_xiaoyi3.png"
              mode=""
              class="img"
            ></image>
          </view>
        </view>
        <view class="" style="margin: -16rpx 10rpx 0 10rpx">
          <view
            class="nameSize"
            :class="list.type == 3 ? 'nameSize' : 'nameSizes'"
            v-if="list.type == 3"
          >
            晓弈
          </view>
          <view
            class="nameSize"
            :class="list.type == 2 ? 'nameSize' : 'nameSizes'"
            v-else-if="list.type == 2"
          >
            {{ list.expertName }}
          </view>
          <view
            class="nameSize"
            :class="list.type == 3 ? 'nameSize' : 'nameSizes'"
            v-else-if="list.type == 1"
          >
            {{ list.userName }}
          </view>
          <view
            :style="{
              backgroundColor: list.msgType != 3 ? 'white' : 'transparent'
            }"
            class="casek"
            :class="[
              list.type == 3 || list.type == 2 ? 'casek' : 'caseks',
              lists.msgType != 3 ? 'casek_padding' : ''
            ]"
          >
            <text user-select class="warpS" v-if="list.msgType == 1 || !list.msgType">
              {{ lists.content }}
            </text>

            <image
              lazy-load
              style="width: 378rpx; height: 519rpx; border-radius: 10rpx"
              @click="openImage(list.content)"
              :src="lists.content"
              alt=""
              mode="aspectFill"
              v-else-if="list.msgType == 3"
            ></image>
            <view class="fileType" v-else-if="list.msgType == 2" @click="download(list.content)">
              <view class="msgFile">
                {{ list.content | fileUrl('name') }}
              </view>
              <view class="" style="flex: 1">
                <image
                  style="width: 88rpx; height: 88rpx; vertical-align: middle"
                  :src="list.content | fileUrl('url')"
                  mode=""
                ></image>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view v-if="list.msgType == 5">
      <rich-text :nodes="list.content"></rich-text>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      let msgType = [
        {
          value: 'txt',
          type: 1
        },
        {
          value: 'word',
          type: 2
        },
        {
          value: 'image',
          type: 3
        },
        {
          value: 'pdf',
          type: 4
        }
      ]
      return {
        lists: this.list,
        nickName: ''
      }
    },
    props: {
      list: {
        type: Object,
        default: () => {}
      },
      urls: {
        typeof: Array,
        default: []
      }
    },
    filters: {
      fileUrl(msg, name) {
        let url = msg.split(',')[0]
        let msgName = msg.split(',')[1]

        if (name == 'url') {
          let value = url.split('.')
          console.log(value[value.length - 1])
          if (value[value.length - 1] != 'pdf') {
            return 'https://app.y9net.cn/data/01/32/wKgBNmNbb6WAJdTvAAANuxHmxvQ073.png'
          } else {
            return 'https://app.y9net.cn/data/01/32/wKgBNmNbb8WAOJqTAAAKj1Rk9sM643.png'
          }
        } else {
          return msgName
        }
      }
    },
    created() {},
    mounted() {},
    methods: {
      navTo(id) {
        uni.navigateTo({
          url: `/pages/meeting/detail?id=${id}`
        })
      },
      // 查看附件
      download(msg) {
        let url = msg.split(',')[0]
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
      async openImage(urls) {
        this.$parent.eventforcs()
        let urlList = this.$props.urls.map((el, i) => {
          return el
        })
        console.log(urls, urlList)
        let index = urlList.indexOf(urls)
        await uni.previewImage({
          urls: urlList,
          current: index,
          loop: true
        })
      }
    },
    watch: {
      list(newValue, oldValue) {
        if (newValue !== oldValue) {
          this.lists = newValue
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .btnhuiyi {
    width: 342rpx;
    height: 50rpx;
    color: white;
    line-height: 50rpx;
    text-align: center;
    background-color: #3f9cff;
    border-radius: 10rpx;
    margin-top: 30rpx;
  }

  .fixed {
    display: flex;
    justify-content: start;
    margin-top: 20rpx;
  }

  .fixed1 {
    flex-direction: row-reverse;
  }

  .img {
    width: 72rpx;
    height: 72rpx;
    border-radius: 50%;
  }

  .nameSize {
    font-size: 25rpx;
    color: #b59e9e;
    line-height: 63rpx;
    position: absolute;
    left: 102rpx;
  }

  .nameSizes {
    text-align: right;
    position: absolute;
    right: 102rpx;
  }

  .casek {
    background: white;
    border-radius: 20rpx;
    border-top-left-radius: 0px;
    max-width: 460rpx;
    margin-top: 66rpx;
  }

  .casek_padding {
    padding: 20rpx 22rpx 20rpx 22rpx;
  }

  .caseks {
    border-radius: 20rpx;
    border-top-right-radius: 0px;
    max-width: 460rpx;
  }

  .fileType {
    height: 104rpx;
    width: 460rpx;
    display: flex;
    justify-content: flex-start;
    font-size: 28rpx;
    color: #111111;

    .msgFile {
      word-break: break-all; //在恰当的断字点进行换行
      overflow: hidden; //文字超出的进行隐藏
      text-overflow: ellipsis; //超出的文字用省略号表示
      display: -webkit-box; //将元素设为盒子伸缩模型显示
      text-overflow: ellipsis; //利用盒子模型
      -webkit-box-orient: vertical; //伸缩方向设为垂直方向
      -webkit-line-clamp: 2;
      flex: 3;
      padding-right: 10rpx;
    }
  }

  .warpS {
    word-break: break-all;
  }

  .lefts {
    margin-top: 5px;
    position: relative;
  }

  .rights {
    display: flex;
    justify-content: flex-end;
    margin-top: 5px;
    position: relative;
  }

  .fixeds {
    margin-top: 0px !important;
  }
</style>
