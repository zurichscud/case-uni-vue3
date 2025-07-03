<template>
	<view>
		<view class="swiper_top_text">
			<view class="" @click="setIndex(index)" style="position: relative;" v-for="(item,index) in listText"
				:key="index" :class="index==swiperIndex?'active':''">
				<view class="text">
					{{item}}
				</view>
				<view class="hr_active" v-if="index==swiperIndex">
					<image src="../../static/active.png" mode="" class="active_btm_icon"></image>
				</view>
			</view>
		</view>
		<view class="">
			<!-- -->
			<view v-if='swiperIndex===0' class="p-30 pb-100">
				<view class="font_bold fz_50 mb-30 text_center">
					{{ objDetail.title}}
				</view>
				<!-- <rich-text :nodes="objDetail.caseDetail" class="richTextInfo"></rich-text> -->
				<!-- <image :src="objDetail.caseDetail" mode="widthFix"  class="content_style"></image> -->
				<mp-html :content="objDetail.caseDetail"></mp-html>
				<view class="text_center fz_24 c-9 p-30">
					已经到底了～
				</view>
				<view class="pubilsh_style text_center br-20 fz_24 c-9" v-if="objDetail.status===1&&content.type==1"
					@click="contentBtn">
					<image src="../../static/comment.png" mode="" class="r_image"></image>
					<view class="r-font">
						发表观点
					</view>
				</view>
			</view>
			<view v-if='swiperIndex===1'>
				<view v-if="!!objDetail.dynamicEntries" class=" p-s zindex-10069" style="top: 106rpx;">
					<u-notice-bar bgColor='#55aaFF' color='#FFFFFF' :text="objDetail.dynamicEntries"
						class="mb-30"></u-notice-bar>
				</view>
				<view class="p-30">
					<view class="card_style bx m-30 card_top">
						<view class="flex_between">
							<view class="fz_36 font_bold">
								我的观点
							</view>
							<view v-if="!!likeDetail.identity" class="btn_identity fz_28"
								:class="likeDetail.identity==='红军'?'redArmy':''">
								{{likeDetail.identity}}
							</view>
							<view v-if="!likeDetail.identity" class="btn_identity fz_28" @click="selectIdentity">选择身份
							</view>
						</view>

						<view>
							<view>
								<form @reset="formReset">
									<view class="uni-form-item uni-column m-30">
										<u--textarea :disabled='objDetail.status!=1||!aditDisabled' :focus="editAuth"
											@blur="onBlur" v-model="content.text" border='surround'
											:autoHeight='autoHeight' maxlength="-1"
											:placeholder="objDetail.status!=1?'评论阶段已结束，您未发表自己的观点':'请输入您的观点'"
											@confirm='viewpointBtn'></u--textarea>
									</view>
									<view v-if='objDetail.status===1' class="flex_between">
										<view class="submit_style text_center" @click="editIsFocs">
											{{!aditDisabled?'编辑':'重置'}}
										</view>
										<view class="submit_style text_center" @click="viewpointBtn">
											{{content.type===1?'提交观点':'修改观点'}}
										</view>
									</view>

								</form>

							</view>
							<view class="fz_24 c-9 m-30" v-if='objDetail.status===1&&content.type==1'>
								暂未有您自己的观点，可以在上方提交参与哦！
							</view>

						</view>
					</view>
					<view class="card_style bx m-30 block_comment" v-if="objDetail.status!==1">

						<u-subsection :list="list" keyName='lable' :current="current" @change="sectionChange"
							mode="subsection"></u-subsection>
						<!-- <view class="w-50">
							<u-subsection  activeColor="#f56c6c"  @change="sectionChangeSlot" :list="listSlot" :current="currentSlot" mode="subsection"></u-subsection>
						</view> -->
						<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y sv_block"
							@scrolltolower="lower">
							<view v-for="(item,index) in dataList" :key='index'>
								<comment-list @onLikeShow='onLikeShow' :dataObj='item'
									:detail='likeDetail'></comment-list>
							</view>
							<view class="text_center fz_24 c-9 p-30" v-if="dataList.length===0">
								暂无观点～
							</view>
							<view class="text_center fz_24 c-9 p-30" v-if="dataList.length!==0">
								已经到底了～
							</view>
						</scroll-view>
					</view>

				</view>
			</view>
			<view v-if='swiperIndex===2'>

				<!-- <image v-if="objDetail.status===3" :src="objDetail.caseEndDetail" mode="widthFix"  class="content_style"></image> -->
				<!-- v-if="objDetail.status!==3" -->
				<none name="活动暂未到该阶段~"></none>
			</view>
		</view>
		<u-modal :show="show" showCancelButton @confirm="choiceIdentity" @cancel="closeEvent" title="请选取您的身份">
			<view class="slot-content">
				<u-radio-group v-model="gameIdentityId" placement="row" @change="groupChange">
					<u-radio :customStyle="{marginBottom: '8px'}" v-for="(item, index) in columns[0]" :key="index"
						:label="item.identityName" :name="item.id">
					</u-radio>
				</u-radio-group>
			</view>

		</u-modal>
		<u-modal :show="commentShow" showCancelButton @confirm="commentConfirm" @cancel="commentCancel" title="请输入您的观点">
			<view class="comment-content">
				<u--textarea v-model="content.text" border='surround' placeholder="请输入您的观点"
					@confirm='commentConfirm'></u--textarea>
			</view>
		</u-modal>
		<u-modal :show="viewpointShow" showCancelButton @confirm="commentConfirm" @cancel="viewpointCancel" title="提示">
			<view class="text_center fz_28 c-9">
				{{viewpointText}}
			</view>
		</u-modal>
		<u-modal :show="likeShow" showCancelButton @confirm="likeConfirm" @cancel="likeCancel" title="提示"
			content='每期活动用户只有一次点赞机会且不可修改,是否继续？'></u-modal>
			<movable-area class="area_block_style">
							<movable-view :x="x" :y="y" direction="all"
							class="area_block_children_style"
							>
							<view class="pubilsh_style text_center br-20 fz_24 c-9" @click="ranking"
								v-if="objDetail.status!==1">
								<image src="../../static/ranking.png" mode="" class="r_image"></image>
								<view class="r-font">
									排行榜
								</view>
							</view>
							</movable-view>
						</movable-area>


	</view>
</template>

<script>
	import commentList from "./components/comment-list.vue"
	export default {
		data() {
			return {
				likeShow: false,
				gameIdentityId: 1,
				value1: '',
				form: {},
				list: [{
					lable: '全部观点',
					value: 0
				}, {
					lable: '红军观点',
					value: 1
				}, {
					lable: '蓝军观点',
					value: 2
				}],
				listSlot: ['最新评论', '最热观点'],
				currentSlot: 0,
				current: 0,
				listText: ['案情介绍', '我的观点', '裁判结果'],
				swiperIndex: 0,
				options: {},
				objDetail: {},
				show: false,
				columns: [],
				likeDetail: {
					identity: '',
					isLiked: false,
					status: 1
				},
				scrollTop: 0,
				old: {
					scrollTop: 0
				},
				dataList: [],
				content: {
					type: 1,
					text: '',
					id: 0
				},
				commentShow: false,
				// 选择身份后，内容是否显示
				isCommentShow: false,
				viewpointShow: false,
				editAuth: false,
				aditDisabled: false,
				reset: {
					text: "",
					type: 1
				},
				autoHeight: false,
				x: 0,
				y: 150
			}
		},
		components: {
			commentList
		},
		computed: {
			...mapState(['user']),
			viewpointText() {
				return '是否要' + (this.content.type === 1 ? '提交您的观点' : '修改您的观点') + '?'
			}
		},
		onShow() {

		},
		onLoad(options) {
			this.options = options
			this.getInfo()
			this.dictionary()
			this.getIdentity()
			this.fetchComment()
			this.$api.userRecord(this.user.id, options.id)

		},
		onShareAppMessage(res) {
			return {
				title: '兵棋推演火热进行中!',
				imageUrl: 'https://app.y9net.cn/data/01/45/wKgBNmW7XaeAdVomABFRNYyluMk808.png',
				success(res) {
					console.log('分享成功', res);
				}
			}

		},
		onShareTimeline() {
			return {
				title: '兵棋推演火热进行中!'
			}
		},
		methods: {
			async ding() {
				if(this.content.type!==1)return
					let that = this
				wx.requestSubscribeMessage({
					tmplIds: ['fxqKcRbuMI-hBPa7jNb9ipqSrnfyMpG8gB0rlJhwu5g'],
					success :async (res)=> {
						console.log("调用成功", res);
						let e = await uni.login({})
						let data = {
							code: e[1].code,
						}
						let {
							datas
						} = await that.$api.getSessionKey(data)
						let openid = datas.openid
						 await that.$api.setSaveSendId({
							gameCaseId:that.options.id,
							openId:openid,
							type:1,
							userId:that.user.id
						})
					}
				})
			},
			onLikeShow(dataObj) {
				this.likeShow = true
				this.dataObj = dataObj
			},
			async likeConfirm() {
				let res = await this.$api.setUserLike({
					likedUserId: this.dataObj.userId,
					likedPostId: this.user.id,
					gameCaseId: this.dataObj.gameCaseId,
					commentId: this.dataObj.id
				})
				if (res.code == 200) {
					this.likeShow = false
					// this.$emit("like")
					this.getCommentList()
				}

			},
			likeCancel() {
				this.likeShow = false
			},
			// 失去焦点
			onBlur() {
				this.editAuth = false
			},
			// 点击编辑 重置
			editIsFocs() {
				if(!!this.aditDisabled){
					this.content.text=this.reset.text
					this.aditDisabled = false
					return
				}
				this.reset.text = this.content.text
				if (!this.likeDetail.identity) {
					return this.show = true
				}
				if (!this.editAuth) {
					this.editAuth = true
				}
				this.aditDisabled = true
			},
			// 排行榜
			ranking() {
				uni.navigateTo({
					url: '/pages/mcd/ranking?id=' + this.options.id
				})

			},
			// 选择身份按钮
			selectIdentity() {
				this.isCommentShow = false
				this.show = true
			},
			// 发表观点按钮
			contentBtn() {
				if (this.likeDetail.identity) {
					this.commentShow = true
				} else {
					this.isCommentShow = true
					this.show = true
				}

			},

			viewpointBtn() {
				if (!this.aditDisabled) {
					return this.$toast("请点击编辑后输入观点")
				}
				if (!this.content.text) {
					return this.$toast("请输入您的观点")
				}
				if (this.reset.text === this.content.text) {
					this.aditDisabled = false
					return this.$toast("两次观点一致，无需修改")
				}
				if (!this.identity) {
					this.viewpointShow = true
				} else {
					this.show = true
				}


			},
			async choiceIdentity() {
				let res = await this.$api.setSelectIdentity({
					userId: this.user.id,
					gameCaseId: this.options.id,
					gameIdentityId: this.gameIdentityId
				})
				if (res.code == 200) {
					let obj = this.columns[0].find(el => {
						return el.id === this.gameIdentityId
					})
					this.likeDetail.identity = obj.identityName
					this.closeEvent()
					if (this.isCommentShow) {
						this.commentShow = true
					}


				}

			},
			groupChange(val) {
				console.log(val);
			},
			// 获取用户是否评论
			async fetchComment() {
				let {
					data,
					code
				} = await this.$api.getUserComment(this.user.id, this.options.id)
				if (code === 200) {
					if (data.isCommented) {
						this.content.type = 2
						this.content.text = data.gameCommentListVo.content
						this.content.id = data.gameCommentListVo.id

					}
				}
			},
			lower: function(e) {
				console.log(e)
			},
			goTop: function(e) {
				// 解决view层不同步的问题
				this.scrollTop = this.old.scrollTop
				this.$nextTick(function() {
					this.scrollTop = 0.01
				});
				// uni.showToast({
				// 	icon: "none",
				// 	title: "纵向滚动 scrollTop 值已被修改为 0"
				// })
			},

			async commentConfirm() {
				if (!this.likeDetail.identity) {
					this.show = true
					this.isCommentShow = true
					return this.$toast("请选择身份后发表自己的观点")
				}
				if (!this.content.text.trim()) return this.$toast("请输入内容")
				if (this.content.type === 1) {
					let res = await this.$api.setUserComment({
						userId: this.user.id,
						gameCaseId: this.options.id,
						content: this.content.text
					})
					if (res.code == 200) {
	                   this.ding()

						this.content.type = 2
						this.commentShow = false
						await this.$toast("发表观点成功")
						this.setIndex(1)
						await this.getCommentList()
					}
				} else {
					let {
						code
					} = await this.$api.modifyComment({
						id: this.content.id,
						content: this.content.text
					})
					if (code === 200) {
						this.$toast("修改观点成功")
					}
				}
				this.aditDisabled = false
				this.viewpointShow = false

				this.fetchComment()
			},
			commentCancel() {
				this.commentShow = false
			},
			viewpointCancel() {
				this.viewpointShow = false
			},
			closeEvent() {
				this.show = false
			},
			submit() {

			},
			sectionChangeSlot(index) {
				this.currentSlot = index;
			},
			async sectionChange(index) {
				this.goTop()
				this.current = index;
				await this.getCommentList()

			},
			async setIndex(i) {
				this.swiperIndex = i
				if (i === 1) {
					setTimeout(() => {
						this.autoHeight = true
					}, 50)

				} else {
					this.autoHeight = false
				}

			},
			// 用户名获取当前身份
			async getIdentity() {
				let res = await this.$api.getUserIdentity(this.user.id, this.options.id)
				if (res.code === 200 && !!res.data) {
					this.likeDetail.identity = res.data.identity

				}
			},
			// 获取红蓝军字典
			async dictionary() {
				let res = await this.$api.getIdentityList()
				if (res.code == 200) {
					this.columns = [res.data]
				}


			},
			//获取案件介绍
			async getInfo() {
				let res = await this.$api.getGameWarsInfo(this.options.id)
				if (res.code === 200) {
					this.objDetail = res.data
					this.likeDetail.status = res.data.status
					if (this.objDetail.status !== 1) {
						this.listText = ['案情介绍', '全部观点', '裁判结果'],
							await this.getCommentList()

					}
				}
			},
			// 获取用户是否点赞
			async getUserLike() {
				let res = await this.$api.getUserLike(this.user.id, this.options.id)
				if (res.code == 200) {
					if (res.data.isLiked) {
						this.likeDetail.isLiked = true
						this.dataList.forEach(el => {
							if (res.data.commentId === el.id) {
								console.log("执行了");
								el.active = true
							}
						})
					}
				}
			},
			// 用户获取评论列表
			async getCommentList() {
				let res = await this.$api.getGameCommentList("?pageNum=1&pageSize=3000", {
					gameCaseId: this.options.id,
					identityId: this.list[this.current].value
				})
				if (res.code === 200) {
					this.dataList = res.rows.map(el => {
						el.active = false
						return el
					})
					await this.getUserLike()

				}
			}
		}
	}
</script>

<style scoped lang="scss">
	$publicColor: #3F9CFF;
.area_block_style {
		position: fixed;
		bottom: 40rpx;
		right: 10rpx;
		width: 100rpx;
		height: 500rpx;
		pointer-events: none;

		.area_block_children_style {
			width: 100rpx;
			height: 100rpx;
			pointer-events: auto;
			.pubilsh_style {
				width: 100rpx;
				background-color: white;
				color: white;
				height: 100rpx;
				// position: fixed;
				// bottom: 120rpx;
				// box-sizing: border-box;
				// margin: 0 auto;
				// right: 10rpx;
				border-radius: 50%;

				.r_image {
					width: 100rpx;
					height: 100rpx;
					font-size: 0;

				}

				.r-font {
					color: #000000;
					// position: absolute;
				}
			}


		}

	}
	.swiper_top_text {
		padding-top: 28rpx;
		display: flex;
		justify-content: space-around;
		font-size: 28rpx;
		color: #999999;
		background-color: white;
		position: sticky;
		top: 0;
		box-shadow: 4px 5px 22px 10px rgba(0, 0, 0, 0.05);
		z-index: 2024;

		.active {
			color: #000000;
			font-size: 36rpx;

			.text {
				position: relative;
				top: -8rpx;
			}
		}

		.hr_active {
			// margin: 10rpx auto;
			font-size: 10rpx;
			text-align: center;
			margin-bottom: 16rpx;

			.active_btm_icon {
				height: 6rpx;
				width: 28rpx;
			}
		}
	}

	.richTextInfo {
		letter-spacing: 6rpx;
		line-height: 50rpx;
		text-align: justify;
	}

	.join_style {
		position: fixed;
		width: 690rpx;
		background-color: $publicColor;
		height: 85rpx;
		line-height: 85rpx;
		color: white;
		bottom: 100rpx;
		border-radius: 15rpx;
	}

	.submit_style {
		background-color: $publicColor;
		height: 65rpx;
		line-height: 65rpx;
		color: white;
		width: 280rpx;
		border-radius: 15rpx;
	}

	.card_top {
		margin-top: 0;
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

	.block_comment {}

	.sv_block {
		max-height: calc(100vh - 300rpx);
	}

	.content_style {
		width: 100%;
		display: block;
	}


	.slot-content {
		width: 300rpx;

		::v-deep .u-radio-group--row {
			width: 300rpx;
			justify-content: space-between;
		}
	}

	.comment-content {
		width: 100%;
	}
</style>