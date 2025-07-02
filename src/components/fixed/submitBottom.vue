<template>
	<!-- 固定到顶部或者底部1 -->
	<view class="submitBottom clear" :style="{bottom:bottomValue,left:left,right:right,}">
		<v-fixed :location="'bottom'">
			<view :class="[loading?'loadingcss':'','submit']" @click="submit">{{btnTitle}}</view>
		</v-fixed>
		<view style="height: 88rpx;"></view>
	</view>

</template>

<script>
	import vFixed from "@/components/fixed/fixed.vue"
	export default {
		components:{
			vFixed
		},
		props: {
			btnTitle:{//传值：<v-submit-bottom :btnTitle="'确认'" @submit="submit"></v-submit-bottom>
				type:String,
				default:'下一步'
			},
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
				loading:false
			};
		},
		watch: {
			
		},
		mounted() {	
			this.$on('submit',(val)=>{
				this.loading=val.loading
			})
		},
		methods: {	
			//提交
			submit(){
				if(!this.loading){
					this.$emit('submit',{loading:this.loading})
				}
			},
		}
	}
</script>

<style lang="scss">
	.submit{width:690rpx;text-align: center;
	height:88rpx;
	line-height: 88rpx;
	background:$uni-text-color-inverse;
	border-radius:44rpx;color:rgba(255,255,255,1);font-weight:600;}
	// .submitBottom{position: fixed;z-index: 20;}
	// .fixed{width: 100%;}
	.loadingcss{background:#B7C4CB;}
	.submitBottom{width: 100%;position: fixed;z-index: 20;}
</style>
