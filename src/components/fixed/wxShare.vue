<template>
	<view class="wxShare" @touchstart.stop.prevent="tou">
		<image src="https://app.y9net.cn/images/imgs/project_iclaim/share.png" mode=""></image>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		methods:{
			tou(){
				console.log(1)
				this.$emit("wx_show")
			}
		}
	}
</script>

<style lang="scss">
.wxShare{
	width: 100%;
	height: 100vh;
	padding: 10rpx 30rpx;
	background:rgba(0,0,0,0.75);
	position: fixed;
	top: 0;
	left: 0;
	z-index: 999;
}
image{
	width: 592rpx;
	height: 322rpx;
	display: block;
	float: right;
}
</style>
