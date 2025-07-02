<template>
	<view>
		<view class="list_block m-30">
			<view class="img_block">
				<image class="userImg" src="../../../static/user.png"></image>
			</view>
			<view class="flex_between">
				<view class="title fz_36 font_bold">{{refDataObj.userName}}</view>
				<view class="btn_identity fz_28" :class="refDataObj.identity==='红军'?'redArmy':''">
					{{refDataObj.identity}}
				</view>
			</view>
			<view></view>
			<view class="block_right">
				<view>
					<view class="mb-30">{{refDataObj.content}}</view>
					<view class="flex_between">
						<view class="like_color fz_28">
							{{refDataObj.createTime}}
						</view>
						<view class="flex_between">
							<image class="like_img"
								:src="refDataObj.active?'../../../static/like_active.png':'../../../static/like.png'"
								mode=""></image>
							<view class="like_color fz_28" :class="refDataObj.active?'active_style':''" @click='like'>
								点赞 {{refDataObj.likeNumber}}
							</view>
						</view>

					</view>
				</view>
			</view>

		</view>
		<view>

		</view>

	</view>
</template>

<script>
	import {
		mapState
	} from "vuex"
	export default {
		data() {
			return {
				likeShow: false,

			}
		},
		computed: {
			...mapState(['user']),
			refDataObj() {
				return this.dataObj
			},
			refDetail() {
				return this.detail
			}
		},
		props: {
			// 每条
			dataObj: {
				type: Object,
				default: {}
			},
			// 总信息
			detail: {
				type: Object,
				default: {}
			},
		},
		methods: {
			like() {
				if (this.refDetail.status != 2) {
					return this.$toast('点赞阶段已结束')
				}
				if (this.refDetail.isLiked) {
					return this.$toast('每期只能点赞一次且不可撤回')
				}

				if (!this.refDetail.identity) {
					this.$emit('selectionIdentity')
					return
				}
				if (this.refDataObj.active) return
				// wx.requestSubscribeMessage({
				//   tmplIds: ['fxqKcRbuMI-hBPa7jNb9inJefJJJpDsHmEJp6Dp4WQg'],
				//   success (res) { 
				// 	  console.log("调用成功",res);
				//   }
				// })	
				this.$emit('onLikeShow', this.dataObj)
			},


		}
	}
</script>

<style scoped lang="scss">
	.list_block {
		display: grid;
		grid-template-columns: 100rpx 1fr;
		grid-template-rows: 100rpx 1fr;

		.userImg {
			width: 80rpx;
			height: 80rpx;

		}

		.img_block {
			display: flex;
			justify-content: start;
			align-items: center;
		}


		.block_right {
			flex-grow: 1;

			.title {}
		}

		.btn_identity {
			width: max-content;
			padding: 3rpx 10rpx;
			background-color: #3F9CFF;
			color: white;
			text-align: center;
			border-radius: 20rpx;
		}

		.redArmy {
			background-color: red;
		}

		.like_img {
			width: 40rpx;
			height: 40rpx;
		}

		.like_color {
			color: #cdcdcd;
		}

		.active_style {
			color: red;
		}
	}
</style>