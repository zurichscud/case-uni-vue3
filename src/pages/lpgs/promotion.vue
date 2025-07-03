<!-- 晋升公社理事条件 -->
<template>
  <view class="pagea">
    <image
      lazy-load
      mode="widthFix"
      :src="
        user.remark == '7' || user.remark == '8'
          ? 'https://app.y9net.cn/data/01/38/wKgBNmPpoIuAZKK9AAQgKJOGCkI935.jpg'
          : 'https://app.y9net.cn/data/01/38/wKgBNmPpoFGAOrKJAAKHyfxrjp8415.jpg'
      "
      alt=""
      style="width: 100%"
    ></image>
  </view>
</template>

<script>
  export default {
    data() {
      return {}
    },
    computed: {
      ...mapState(['user', 'userType'])
    },
    onLoad() {
      if (this.user.remark == 6) {
        uni.setNavigationBarTitle({
          title: '晋升大队长条件'
        })
      } else {
        uni.setNavigationBarTitle({
          title: '晋升公社理事条件'
        })
      }
    }
  }
</script>

<style scoped lang="scss"></style>
