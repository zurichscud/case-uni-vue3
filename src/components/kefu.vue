<template>
	<view class="kefu">
		<!-- #ifdef MP-WEIXIN -->
			<button class="contact noneBtn" :session-from="'{nickName:' + userHx.nickNameHx+',avatarUrl:' + userHx.photo + '}'" open-type="contact" show-message-card="true" send-message-title="弈赔小程序" send-message-path="/pages/project_iclaim/index/expertConsultation?type=1" send-message-img="https://app.y9net.cn/images/iclaim/img_ask.png" @contact="handleContact">
				<slot name="kefu"></slot>
			</button>
		<!-- #endif -->		
		<!-- #ifndef MP-WEIXIN -->
			<button class="contact noneBtn" @click="contactKefu">
				<slot name="kefu"></slot>
			</button>
		<!-- #endif -->

		<!-- 我只是不想封装弹窗了，千姿百态 -->
		 <view v-if="showModel" class="modal_bg" @click.stop="close">
		 	<view class="addUser_content modal_wapper" >
		 		<view class="modal_body">
		 			<view class="title" >
		 				<view class="content" >您没有已生效的弈通卡，暂时无法进行理赔辅导。</view>
		 			</view>
		 		</view>
		 		<view class="modal_bottom" >
					<!-- 去快速咨询 -->
					<view class="btn close" @click.stop="nav('kefu')">去咨询</view>
		 			<view class="btn confirm" @click.stop="nav('cardList')">购买/激活</view>
		 		</view>
		 	</view>
		 </view>
	</view>

</template>
<script>
	export default {
		name: 'tab',
		components: {},
		props: {
			isKefu:{
				type:Boolean,
				default:true
			},
		},
		data() {
			return {
				userHx:null,
				strings:'',
				showModel:false,
			};
		},
		watch: {
			
		},
		created() {
			this.userHx=this.$store.state.user
			// #ifdef MP-WEIXIN
			if(this.userHx){
				this.userHx.nickNameHx=`${this.userHx.id}-${this.userHx.nickName}`
				console.log('this.userHx:',this.userHx)
			}
			// #endif
			
			
		},
		methods: {	
			close() {
				//关闭弹窗
				this.showModel=!this.showModel
			},
			nav(name){
				this.close()
				if(name=="cardList"){
					// this.$Router.push({name:'cardList'})
				}else if(name=='kefu'){//去免费的快速咨询那里
					//使用微信客服代替环信所有 12.15  http://kefu.easemob.com/webim/im.html?configId=3ef4e1b0-e8f4-4c29-9edb-6cd185fd7c19 大康
					let url=`https://work.weixin.qq.com/kfid/kfc0661c6f158062ace`
					
					// console.log('window对象',window)
					// this.$Router.push({name:'webview',params:{url}})
				}
			},
			//您可能要发送的小程序 点击跳转页面
			handleContact(e){
				if(e.detail.path){
					// this.$Router.push({path:e.detail.path,query:e.detail.query})
				}
			},
			//app跳转客服 使用h5的客服
			contactKefu(){
				let that=this	
				// #ifdef APP-PLUS
					if(this.isKefu){
						let url=`https://work.weixin.qq.com/kfid/kfc0661c6f158062ace`
						// this.$Router.push({name:'webview',params:{url}})
					}else{//购买 提升
						this.showModel=true
					}
				// #endif
				// #ifndef APP-PLUS
					window.location.href=("https://work.weixin.qq.com/kfid/kfc0661c6f158062ace")
				// #endif
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	// .kefu{width: 100%;}
	/* modal */
	.modal_bg{z-index: 666;width:100%;height:100%;position: fixed;top:0;left:0;background: rgba(0, 0, 0, .7);text-align: center;
	.modal_wapper{width:77%;height: 416rpx;box-sizing: border-box;padding: 30rpx;border-radius:12rpx;z-index: 669;background: #fff;position: fixed;top: 50%;left: 50%;transform: translate(-50%,-50%)}
	.modal_img{width:300rpx;height: 212rpx;display: inline-block;}
	.modal_body{padding: 20rpx 0 50rpx 0;text-align: left;}
	.modal_body_img{width:88rpx;height: 88rpx;display: inline-block;}
	.content{color: #999;margin: 42rpx 0 60rpx 0;}
	.subContent{font-size: 28rpx;color:$uni-text-color-grey;margin-top: 16rpx;}
	
	/* .modal_bottom{padding: 38rpx 0;} */
	.btn{width:220rpx;height: 72rpx;line-height: 72rpx;border-radius: 35rpx;}
	.close{display: inline-block;background:#B7C4CB; color: #fff;margin-right: 30rpx;}
	.confirm{display: inline-block; background:$uni-text-color-inverse;color: #fff;}
	.defaultConfirm{margin-left:30rpx;display: inline-block;color: #79B2A1!important;}
	}
		/* modal end */
</style>
