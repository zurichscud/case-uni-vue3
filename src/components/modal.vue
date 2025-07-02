<template>
	<view v-if="isModal2" class="modal_bg" @click.stop="close">
		<view>{{title}}</view>
		<view class="addUser_content modal_wapper" :style="{width:width}">
			<view v-if="title">{{title}}</view>
			<image v-if="imgTop" mode="widthFix" class="image modal_img" :src="imgTop"></image>
			<view  v-if="type=='text'" class="modal_body">
				<view class="title" >
					<view class="content" >{{content}}</view>
					<view class="subContent" @click="getnum">{{subContent}}</view>
				</view>
			</view>
			<slot v-else></slot>
			<view v-if="isBottom" class="modal_bottom" :style="{'padding-top':modalBottomPadding,'padding-bottom':modalBottomPadding}">
				<button v-if="cancelText" class="btn close" @click.stop="close">{{cancelText}}</button>
				<button v-if="confirmType=='getUserInfo'" :open-type="confirmType" class="btn confirm" hover-class="none" @getuserinfo='getUserInfo'>{{confirmText}}</button>
				<!-- #ifdef MP-WEIXIN -->  
				<button v-else-if="confirmType=='getPhoneNumber'" open-type="getPhoneNumber" class="btn confirm" @getphonenumber='getPhoneNumber'>{{confirmText}}</button>
				<!-- #endif -->
				<button v-else-if="confirmType=='default'" :type="confirmType" class="btn defaultConfirm" @click="confirm">{{confirmText}}</button>
				<button v-else class="btn confirm" @click="confirm">{{confirmText}}</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			type:{
				type:String,
				value:'text',
			},
			title:{type: String,value:""},
			imgTop: {type: String,value: ""},
			content: {type: String,value: ""},
			subContent: { type: String, value: "" },
			cancelText: {type: String,value: ""},
			confirmText: { type: String, value: "确认" },
			isModal: { type: Boolean, value: false },
			confirmType: { type: String, value: '' }, 
			isBottom: { type: String, value: "true" },
			width: { type: String, value: "89%" },
			modalBottomPadding: { type: String, value: "38rpx" },
		},
		data() {
			return {
				isModal2:this.isModal
			};
		},
		watch:{
		},
		methods:{
			close() {
				//关闭弹窗
				this.isModal2= !this.isModal2
				console.log(this.isModal)
			},
			confirm(e){
				this.$emit('confirm')
				this.close()
			},
			getPhoneNumber(e){
				console.log('获取手机号', e.detail)
				// this.$emit(`getPhoneNumber`, e.detail)
			}
		}
	}
</script>

<style lang="scss">
image{height: auto}
.searchBar{height: 100rpx;line-height: 100rpx;}
/* modal */
.modal_bg{width:100%;height:100%;position: fixed;top:0;left:0;background: rgba(0, 0, 0, .7);z-index: 3;text-align: center;}
.modal_wapper{width:89%;border-radius:12rpx;z-index: 5;background: #fff;position: fixed;top: 50%;left: 50%;transform: translate(-50%,-50%)}
.modal_img{width:44rpx;height: 44rpx;}
.modal_body{padding: 60rpx 0;}
.subContent{font-size: 28rpx;color:#888888;margin-top: 16rpx;}

/* .modal_bottom{padding: 38rpx 0;} */
.btn{width:260rpx;height: 72rpx;line-height: 72rpx;}
.close{display: inline-block;background:#DDDDDD; color: #222222;}
.confirm{margin-left:30rpx;display: inline-block; background:#79B2A1;color: #fff;}
.defaultConfirm{margin-left:30rpx;display: inline-block;color: #79B2A1!important;}
</style>
