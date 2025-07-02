<template>
	<!-- 固定到顶部或者底部 -->
	<view class="fixed clear">
		<view v-if="location=='bottom'" class="fixed_bottom" :style="{bottom:bottomValue,left:left,right:right,}">
			<slot></slot>
			<view v-if="isIphoneX" class="iphoneX_bottom"></view>
		</view>
	</view>

</template>

<script>
	export default {
		props: {
			location:{
				type:String,
				default:'bottom'
			},
			bottomValue:{
				type:String,
				default:'30rpx'
			},
			left:{
				type:String,
				default:"30rpx"
			},
			right:{
				type:String,
				default:"30rpx"
			}
		},
		data() {
			return {
				isIphoneX:this.$isIphoneX,
				scrollH:0,
			};
		},
		watch: {
			
		},
		created() {	
		
		},
		mounted() {
			// this.$on()
		},
		methods: {	
		}
	}
</script>

<style lang="scss">
	/* 清除浮动 */
	.clear {
	  zoom: 1;
	}
	
	.clear:after {
	  content: '';
	  display: block;
	  clear: both;
	  
	  height: 0;
	  line-height: 0;
	  visibility: hidden;
	}
	.clear:before{
		 height: 0;
		 box-sizing: border-box;
	}
	
	.fixed{width: 100%;}
	.fixed_bottom{width: 100%;position: fixed;z-index: 20;}
</style>
