<template>
  <view class="">
    <template v-if="dataList.length == 0">
      <none name="您还没有订单~"></none>
    </template>
    <template v-else>
      <view class="pageOrderList">
        <view class="OrderList" v-for="(item, index) in dataList" :key="item.ordersId">
          <view class="OrderNum">
            订单编号：
            <text class="textValue" user-select>{{ item.ordersId }}</text>
          </view>
          <view class="">
            订单名称：
            <text class="textValue">{{ item.content }}</text>
          </view>
          <view class="flex_divide">
            <view class="">
              支付金额：
              <text class="textValue" style="color: red">{{ item.amount }}</text>
            </view>
            <view class="detail" v-if="item.businessType == 37" @click="openAlter(item.ordersId)">
              详情 >
            </view>
          </view>
          <view class="flex_divide">
            <view class="">支付时间：</view>
            <view class="timeText">
              {{ item.purchaseTime }}
            </view>
          </view>
        </view>
      </view>
    </template>
    <alert ref="child" @submit="close" closex title="订单详情">
      <scroll-view
        scroll-y
        style="
          width: 600rpx;
          max-height: 400rpx;
          overflow-y: true;
          text-align: left;
          padding-bottom: 32rpx;
        "
        class="child"
      >
        <view v-for="(item, index) in detailList" :key="index" class="sheet">
          <view class="">{{ item.chapter }} {{ item.title }}</view>
          <view v-for="(n, j) in item.singleList" :key="j" class="chapter">
            <view v-for="(el, i) in n.teacherList" :key="i" class="flex_start">
              <view class="flex_divide" style="line-height: 50rpx">
                <view class="">{{ n.no }} {{ n.name }}</view>
              </view>
              <text style="padding-left: 3ch">主讲人：{{ el.teacherName }}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </alert>
  </view>
</template>

<script>
import { mapState } from 'vuex'
import alert from '@/components/alert.vue'
const dictionary = [
  {
    businessType: 36,
    text: '《理赔焦点》视频课程(全部A)',
  },
  {
    businessType: 37,
    text: '《理赔焦点》视频课程(分章)',
  },
  {
    businessType: 38,
    text: '《理赔焦点》视频课程(全部B)',
  },
  {
    businessType: 39,
    text: '《理赔焦点》视频课程(全部)',
  },
  {
    businessType: 40,
    text: '付费咨询',
  },
  {
    businessType: 41,
    text: '付费咨询',
  },
]
export default {
  data() {
    return {
      dataList: [],
      detailList: [],
    }
  },
  components: {
    alert,
  },
  computed: {
    ...mapState(['user']),
  },
  onLoad() {
    this.pageInit()
  },
  methods: {
    dictionary(businessType, classSingleIds = null) {
      let Obj = dictionary.find((el) => el.businessType == businessType)
      if (businessType == 37) {
        let listLength = classSingleIds.split(',')
        return '《理赔焦点》视频课程(' + '共' + listLength.length + '章)'
      } else {
        return Obj.text
      }
    },
    async pageInit() {
      let { data, code } = await this.$api.getMyOrder({
        userId: this.user.id,
      })
      if (code == 200) {
        this.dataList = data.map((el) => {
          if (el.businessType == 37) {
            el.content = this.dictionary(el.businessType, el.classSingleIds)
          } else {
            el.content = this.dictionary(el.businessType)
          }
          return el
        })
        console.log(this.dataList, '数组')
      }
    },
    async openAlter(ordersId) {
      let { data, code, msg } = await this.$api.getOrderInfo({
        orderId: ordersId,
      })
      if (code == 200) {
        this.detailList = data

        this.$refs.child.open()
      } else {
        this.$toast(msg)
      }
    },
    close() {
      this.$refs.child.close()
    },
  },
}
</script>

<style scoped lang="scss">
.child {
}
.sheet {
  margin-bottom: 32rpx;
}
.chapter {
  font-size: 30rpx;
}

.pageOrderList {
  padding: 20rpx 20rpx;
}

.textValue {
  // color: white;
}

.timeText {
  font-size: 26rpx;
  color: #999;
}

.OrderList {
  color: #111111;
  margin: 20rpx auto;
  // background-color: #3F9CFF;
  box-shadow: 0px 8rpx 14rpx 10rpx rgba(0, 0, 0, 0.05);
  padding: 20rpx 32rpx;
  border-radius: 10rpx;
  line-height: 55rpx;
}

.detail {
  color: #3f9cff;
}
</style>
