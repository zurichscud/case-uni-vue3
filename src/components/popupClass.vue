<template>
	<view>
		<uni-popup ref="popupClass" :type="type1">
			<view class="a_box">
				<view class="title" v-if="title">{{title}}</view>
				<slot></slot>
				<view v-if="btn.length" style="height: 80rpx;"></view>
				<view class="btn" v-if="btn.length">
					<text v-if="btn[0]" :style="'background-color: '+bgc" @click="j_btn(0)">{{btn[0]}}</text>
					<text v-if="btn[1]" @click="j_btn(1)">{{btn[1]}}</text>
				</view>
			</view>
		</uni-popup> 
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	export default {
		components:{uniPopup},
		props:{
			type1:{
				type:String,
				default:"center"
			},
			title:{
				type:String,
				default:'温馨提示'
			},
			btn:{
				type:Array,
				default:()=>['','确定']
			},
			handle:{
				type:Number,
				default:0,
			},
			closeState:{
				type:Boolean,
				default:true
			}
		},
		data() {
			return {
				bgc:"#F1FAFF",
			};
		},
		created() {
			this.bgc=this.$isExperts?'#F1FAFF':'#FFF6EE'
		},
		methods:{
			open(){
				this.$refs.popupClass.open()
			},
			close(){
				this.$refs.popupClass.close()
			},
			j_btn(index){
				console.log(index)
				if(index==0){
					this.$refs.popupClass.close()
					this.$emit("backData",0)
				}else{
					if(this.closeState){
						this.$refs.popupClass.close()
					}
					this.$emit("backData",1)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
.a_box{width: 590rpx;position: relative;padding: 60rpx 0 0;min-height: 380rpx;border-radius: 20rpx;background-color: #FFFFFF;overflow: hidden;
	.title{text-align: center;font-size: 40rpx;font-weight: 600;}
	.btn{display: flex;justify-content: space-between;position: absolute;bottom: 0;left: 0;width: 100%;height: 80rpx;
		text{height: 80rpx;width: 100%;line-height: 80rpx;text-align: center;}
		text:first-child{color: $uni-text-color-inverse;}
		text:last-child{color: #FFFFFF;background-color: $uni-text-color-inverse;}
	}
}
</style>
