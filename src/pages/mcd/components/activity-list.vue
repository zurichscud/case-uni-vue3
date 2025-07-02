<template>
  <view class="activity_list br-20">
    <view class="cycle_list" :class="arrObj.status === 3 ? 'finishStatus' : ''">
      {{ arrObj.periods }}
    </view>
    <view class="flex_between">
      <view class="font_bold"> 活动名称 </view>
      <view class="fz_28">
        {{ arrObj.title }}
      </view>
    </view>
    <view class="flex_between m-30">
      <view class="font_bold"> 活动状态 </view>
      <view class="fz_28">
        {{
          dictionaryList.length !== 0 &&
          !!arrObj.status &&
          filterValue(arrObj.status, dictionaryList)
        }}
        <text v-if="arrObj.status <= 2"> （截止: {{ timeCutOff(arrObj) }}） </text>
      </view>
    </view>
    <view class="flex_between fz_24 c-9">
      <view>
        {{ arrObj.createTime }}
      </view>
      <view class="card_top_right" @click="navTo"> 活动详情 > </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {}
    },
    props: {
      dictionaryList: {
        type: Array,
        default: []
      },
      arrObj: {
        type: Object,
        default: () => {
          return {
            status: 1,
            commentDeadline: null,
            likeDeadline: null
          }
        }
      }
    },
    created() {},
    mounted() {},
    methods: {
      timeCutOff(arrObjs) {
        if (arrObjs.status * 1 === 1) {
          return arrObjs.commentDeadline
        } else if (arrObjs.status * 1 === 2) {
          return arrObjs.likeDeadline
        }
        return ''
      },
      navTo() {
        let that = this
        /* 	wx.requestSubscribeMessage({
					tmplIds: ['fxqKcRbuMI-hBPa7jNb9inJefJJJpDsHmEJp6Dp4WQg'],
					async success(res) {
						let e = await uni.login({})
						let data = {
							code: e[1].code,
						}
						let {
							datas
						} = await that.$api.getSessionKey(data)
						let openid = datas.openid
						console.log(openid);
					}
				}) */
        uni.navigateTo({
          url: '/pages/mcd/mcd-detail?id=' + this.arrObj.id
        })
      },
      filterValue(val = 1, arr) {
        if (!val) return ''
        let str = String(val)
        let Obj = arr.find((el) => {
          return el.dictValue === str
        })
        return Obj.dictLabel
      }
    }
  }
</script>

<style scoped lang="scss">
  .activity_list {
    box-shadow: 4px 5px 22px 10px rgba(0, 0, 0, 0.05);
    box-sizing: border-box;
    padding: 40rpx;
    overflow: hidden;
    position: relative;

    .cycle_list {
      width: max-content;
      padding: 0 20rpx;
      color: white;
      background-color: red;
      position: absolute;
      text-align: center;
      top: 0;
      right: 0;
      font-size: 24rpx;
    }

    .finishStatus {
      background-color: #999999;
    }
  }

  .card_top_right {
    width: 200rpx;
    height: 64rpx;
    line-height: 64rpx;
    border-radius: 200rpx;
    font-size: 24rpx;
    text-align: center;
    color: white;
    box-shadow: 0px 2px 7px 0px rgba(0, 115, 238, 0.27);
    background: linear-gradient(139deg, #6bb3ff 0%, #1486ff 100%);
  }
</style>
