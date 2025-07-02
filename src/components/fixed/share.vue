<template>
	<view>
		<wx-share v-if="wxState" @wx_show="wx_show"></wx-share>
		<view class="bgw" style="height: 100rpx;"></view>
		<view class="iphoneX_bottom" v-if="isIphoneX"></view>
		<view class="ask_bottom" @click.stop="dd" style="border-top: 1px solid rgba(0,0,0,0.05);">
			<view class="ask_box">
				<!-- #ifdef APP-PLUS -->
				<view class="b_btn" :style="options.questionReId==question.myQuestionReId && options.questionReId? 'margin: 0 auto;border:none':'border:none'" @click="app_share">
					<image v-if="imgState" src="https://app.y9net.cn/images/imgs/project_iclaim/share1.png" mode="widthFix"></image>
					<image v-else src="https://app.y9net.cn/images/imgs/project_iclaim/share.png" mode="widthFix"></image>
					<text>分享</text>
				</view>
				<!-- #endif -->
				<!-- #ifndef APP-PLUS || H5 -->
				<button @click="wx_show" :style="options.questionReId==question.myQuestionReId && options.questionReId? 'margin: 0 auto;border:none':'border:none'" hover-class="none" plain="true" class="b_btn" open-type="share">
					<image v-if="imgState" src="https://app.y9net.cn/images/imgs/project_iclaim/share1.png" mode="widthFix"></image>
					<image v-else src="https://app.y9net.cn/images/imgs/project_iclaim/share.png" mode="widthFix"></image>
					<text>分享</text>
				</button>
				<!-- #endif -->
				<text v-if="downBtnShow" class="b_answer"  @click="askQuestion">{{downBtnTxt?'查看回答':'立即回答'}}</text>
			</view>
			<view v-if="!isIphoneX" style="height: 14rpx;"></view>
			<view class="iphoneX_bottom" v-if="isIphoneX"></view>
		</view>
	</view>
</template>

<script>
	import wxShare from "@/components/fixed/wxShare.vue"
	let {myshare} = require('@/common/public')
	export default {
		data() {
			return {
				isIphoneX:this.$isIphoneX,
				imgState:this.$isExperts,
				iswx:false,
				wxState:false
			};
		},
		components:{wxShare},
		props:{
			downBtnShow:{//底部回答按钮是否展示
				type:Boolean,
				default:true
			},
			downBtnTxt:{//底部回答按钮显示内容，true显示查看回答，否则显示立即回答
				type:Boolean,
				default:false
			},
			options:{
				type:Object,
				required:true
			},
			question:{
				type:Object,
				required:true
			}
		},
		created() {
			// #ifndef H5
			this.$iswx=true
			// #endif
			// if(this.$iswx){
			// 	this.wx_share()
			// }
		},
		methods:{
			dd(){return},
			askQuestion(){
				let question=this.question
				if(question.myQuestionRe){
					// this.$Router.push({name:"askDetail",params:{id:question.id,questionReId:question.myQuestionReId}})
				}else{
					// this.$Router.push({name:'publishArticle',params:{type:2,title:this.question.title,questionId:this.question.id}})
				}
			},
			wx_show(){
				console.log(this.question)
				this.wxState=!this.wxState
			},
			wx_share(){
				let obj=this.question
				myshare(obj.title,"")
			},
			app_share(){
				 // #ifdef APP-PLUS
				  this.$appShare()
				 // #endif
			}
		}
	}
</script>

<style lang="scss" scoped>
.ask_bottom{width:100% ;position: fixed;bottom: 0;left: 0;background-color: #FFFFFF;padding: 14rpx 30rpx 0;}
.ask_bottom .ask_box{display: flex;justify-content: space-between;}
.ask_bottom .b_btn{display: flex;color: $uni-text-color-inverse;width: 110rpx;padding: 14rpx 0;font-size: 28rpx;justify-content: space-between;line-height: 40rpx;margin: 0;flex-shrink: 1;}
.ask_bottom .b_answer{min-width: 520rpx;height: 72rpx;background-color: $uni-text-color-inverse;color: #FFFFFF;display: block;line-height: 72rpx;text-align: center;border-radius: 36rpx;/* #ifdef H5 */
	width: 100%;
/* #endif */}
.ask_bottom .b_btn image{width: 32rpx;height: 32rpx;margin-right: 10rpx;padding: 2rpx;}
</style>
