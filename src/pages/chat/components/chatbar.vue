<template>
	<view class="chat_bar clear">

		<v-fixed bottomValue='0' left='0' :v-if="false">
			<view class="bottom">
				<!-- type：1普通input（提交完订单才有） 2填空 3 单选，4多选 -->
				<block>
					<!-- 最后一步开始提交 -->
					<view v-if="isSubmit!=0" class="issubimt" style="height:400rpx; border: 1px solid transparent;">
						<view class="btnInut" @click="setOrder" v-if="isSubmit==1">立即支付</view>
						<view class="btnInut" @click="$refs.child1.open()" v-if="isSubmit==2">提交案件</view>
					</view>
					<view v-else class="answer" :style="{

						height:(flag?400:100) +'rpx',
						position:(!flag||!blur_flay)?'fixed':'sticky',
						bottom:keyHeight+'px',
					}">
						<!-- 	inputIndex:0,//输入框当前索引
								current:1,//当前问题
								lastMsg: '', //当前答案
								// 1普通input 2填空 3 单选，4多选 5地址
								typeIndex:3,//当前问题类型 -->
						<!-- 填空 -->
						<view v-if="typeIndex==2" class="input" :key="'inp'+orderIndex">
							<view class="submit1" @click="submit">
								<view>{{tiIndex==1?'提交':'下一步'}}</view>
							</view>
							<view class="topInput ">
								<view class="li" style="width: 600rpx;margin:0 auto 20rpx auto; white-space: pre-wrap;">
									{{inputStyle[inputIndex].nametext}}
								</view>
								<view style="width: 100%;">
									<input :type="inputStyle[inputIndex].type"
										:style="{width:inputStyle[inputIndex].width}"
										:maxlength="inputStyle[inputIndex].maxlength" :adjust-position="false"
										class="input_num" cursor-spacing="15" @focus="keyfocus" @blur="inputBlur"
										v-model="lastMsg">
									<text v-if="inputStyle[inputIndex].type=='number'"
										style="margin-left: 32rpx;vertical-align: middle;">元</text>
								</view>
							</view>
						</view>
						<!-- 单选 -->
						<view v-if="typeIndex==3" :key="'aswer'+orderIndex" class="pickerView finishBox"
							style="m       in-height: 370rpx;">
							<view class="submit1" @click.stop="submit">
								<view>{{tiIndex==1?'提交':'下一步'}}</view>
							</view>
							<picker-view @change="changeSingleList($event)" :value="singleIndex" immediate-change
								style="width: 100%;height: 100%;text-align: center;" indicator-class="select-line">
								<picker-view-column style="transform: translateY(-75px);" class="view-column first">
									<view class="item" :class="msgIndex==index?'colorType':''"
										v-for="(item,index) in lastQ" :key="index">{{item.msg}}
									</view>
								</picker-view-column>
							</picker-view>
						</view>
						<!-- 多选 -->
						<view v-if="typeIndex==4" class="input finishBox" style="text-align: center;">
							<view class="submit_flex">
								<view class="submit1 lot" v-if="!flag" @click="reselection">
									重选
								</view>
								<view class="ipt_text" style="flex:1;" v-if="!flag">
									<input type="text" :focus='true' :adjust-position="false" @blur="bluerHigt"
										v-model.trim="lastMsg" :maxlength='20' placeholder-style="color:#999999;"
										placeholder="请填写其它险种类别">
								</view>
								<view class="submit1" @click="submit" :class="flag?'':'lot'">
									<view>下一步</view>
								</view>
							</view>

							<view class="singleBox1" v-if="flag">
								<!-- singleBoxList.list.length==2?'item0':'item', -->
								<view :class="[item.checked?'colorR':'','itPublic','item']"
									v-for="(item,index) in lastQ" :key="index" @click="selectOptions(index,item)">
									{{item.msg}}
								</view>
							</view>
						</view>
						<!-- 地址选indicator-class择 -->


					</view>
				</block>
			</view>
		</v-fixed>
		<alert ref="child" title='受理条件' @submit="nav('case')" closex='true' auto='false'>
			<view class="alertC">
				<view class="colorAl alert">
					您的案件服务申请在满足以下条件时，理赔公社将予以受理
				</view>
				<view class="colorAl_fo alert">
					1.重疾/防癌/其他特种疾病:

				</view>
				<view class="colorAl_fw alert">
					理赔争议金额≥10万元
				</view>
				<view class="colorAl_fo alert">
					2.因意外或疾病导致的:
				</view>
				<view class="colorAl_fw alert">
					①医疗（报销/津贴费用）理赔争议金额≥5万元
				</view>
				<view class="">
					②身故/残疾理赔争议金额≥10万元
				</view>
				<view class="colorAl_btn" @click="$refs.child.close()">
					确定
				</view>
			</view>
		</alert>
		<alert ref="child1" title='温馨提示' closex='true' auto='false'>
			<view class="alert_style">
				<view style="width: 600rpx;" class="child">
					<view class="alertC">
						<view class="text_pay">
							请确认上述案件真实有效
						</view>
						<view class="text_pay">
							稍后有专家与你进一步沟通
						</view>

						<view class="child_flex">
							<view class="child_btnerr" @click="navTab">
								返回首页
							</view>
							<view class="child_btnnext" @click="submitCase()">
								确定
							</view>
						</view>
					</view>
				</view>
			</view>
		</alert>
		<alert ref="child2" title='温馨提示' closex='true' auto='false'>
			<view class="alert_style">
				<view style="width: 600rpx;" class="child">
					<view class="text_pay">
						理赔金额2万元以下的<br>理赔公社提供案件咨询服务
					</view>

					<!-- 	<view class="flex_divide">
					<view class="colorAl_btn" @click="$refs.child2.close()">
						取消
					</view>
					<view class="colorAl_btn" @click="$refs.child2.close()">
						去咨询
					</view>
				</view> -->
					<view class="child_flex">
						<view class="child_btnerr" @click="$refs.child2.close()">
							取消
						</view>
						<view class="child_btnnext" @click="goSeek">
							去咨询
						</view>
					</view>
				</view>
			</view>
		</alert>

	</view>
</template>

<script>
	import vFixed from "@/components/fixed/fixed"
	import alert from "@/components/alert.vue"
	let {
		uploadFilesAll
	} = require('@/common/public')

	export default {
		components: {
			vFixed,
			alert
		},
		props: {
			basic: {
				type: Object,
				value: {}
			}
		},
		data() {
			return {

				inputStyle: [{
						nametext: '请填写拒赔通知书或\n电话/微信/短信告知的拒赔理由',
						width: '500rpx',
						maxlength: 50,
						type: 'text'
					},
					{
						nametext: '请填写本次理赔申请总金额\n（可多家保险公司多张保单金额合计）',
						width: '200rpx',
						maxlength: 9,
						type: 'number'
					},
					{
						nametext: '简要说明案件情况',
						width: '500rpx',
						maxlength: 300,
						type: 'text'
					}
				],
				inputIndex: 0, //输入框当前索引
				current: 2, //当前问题 ,初始化从1开始
				lastMsg: '', //当前答案
				// 1普通input 2填空 3 单选，4多选 5地址
				typeIndex: 4, //当前问题类型
				flay: false, //提交答案节流
				flag: true, //多选其他填写
				lastQ: [], //答案列表
				singleIndex: [0], //单选当前索引
				tiIndex: 0, //提交下一步索引
				orderIndex: 0, //刷新组件
				msgIndex: 0, //单选高亮
				aniList: {},
				caseId: null, //订单id
				isSubmit: 0,
				fileL: [],
				msgTypeShow: this.$store.state.msgTypeShow,
				nums: [],
				keyHeight: 0,
				blur_flay: true,
				payDetail: {
					bussinessType: null,
					type: null
				}
			}
		},
		computed: {
			...mapState(['user', 'questionId']),
			...mapState('chat',['chatMsg'])
		},
		watch: {},
		created() {
			this.pageInit()
			// this.$nextTick(() => {
			// 	that.getChatInputH()
			// });
			// uni.onKeyboardHeightChange(res => {
			// 	this.$nextTick(() => {
			// 		this.keyHeight = res.height
			// 	})
			// })
		},
		destroyed() {
			this.$store.state.msgTypeShow = false
			uni.onKeyboardHeightChange()
			uni.offKeyboardHeightChange()
		},
		methods: {
			// answerType：1普通input（提交完订单才有） 2填空 3 单选，4多选
			...mapMutations('chat',['pushChatMsg', 'initChatMsg']),
			// 初始化数据
			pageInit() {
				this.initChatMsg() //初始化
				// this.getQuestionCurrent(3)
			},
			navTab(){
			uni.switchTab({
				url: '/pages/index/index'
			});
			},
			// 获取问题及答案，将问题加入到聊天记录中
			async getQuestionCurrent(questionId) {

				let Obj = {
					questionId
				}

				let msg = {
					type: 3,
					userId: this.user.id,
					caseId: this.caseId || null
				}
				let res = await this.$api.getQuestionAndAnswer(Obj)
				// if (answerIdIndex == 19) {
				// 	this.pushChatMsg({
				// 		answerType: res.data.questionList[0].answerType,
				// 		type: 3,
				// 		msg: '<p>尊敬的用户，感谢您的信任，我们将提供以下服务内容：</p><p>1. 提供完善的理赔申请资料清单</p><p> 2. 在线指导理赔申请书撰写 </p><br/><p>（本项服务仅限1家保险公司1起理赔事件）</p><br/><p>本项服务费用：90元</p><br/><p>服务时间:工作日9:00-18:00 </p><p>等待专家时间:2小时</p>'
				// 	})
				// 	msg.msg =
				// 		'尊敬的用户，感谢您的信任，我们将提供以下服务内容：\n1. 提供完善的理赔申请资料清单\n 2. 在线指导理赔申请书撰写\n\n（本项服务仅限1家保险公司1起理赔事件）\n\n本项服务费用：90元\n\n服务时间:工作日9:00-18:00\n等待专家时间:2小时'
				// 	msg.messageType = 1
				// 	await this.addMsg(msg)
				// } else {
				this.pushChatMsg({
					answerType: res.data.questionList[0].answerType,
					type: 3,
					msg: res.data.questionList[0].msg
				})
				msg.msg = res.data.questionList[0].msg
				msg.messageType = 1
				await this.addMsg(msg)
				// }

				this.lastQ = res.data.answerList
			},
			//多选合并msg
			addText() {
				let arr = JSON.parse(JSON.stringify(this.nums))
				let nums = this.nums.join()
				let msg = ''
				this.lastQ.forEach((n, index) => {
					arr.forEach((el, i) => {
						if (n.answerId == el) {
							if (el != 18) {
								if (msg.length == 0) {
									msg = n.msg
								} else {
									msg += ('/' + n.msg)
								}
							} else {
								if (!!this.lastMsg) {
									if (msg.length == 0) {
										msg = this.lastMsg
									} else {
										msg += ('/' + this.lastMsg)
									}
								}
							}
						}
					})
				})

				this.aniList.answer3OtherInsurance = !!this.lastMsg ? '(' + this.lastMsg + ')' : ''

				return {
					msg,
					nums
				}
			},
			// 判断是否是提交或者下一步
			judgeNext() {
				console.log();
				let answerId = this.lastQ[this.msgIndex].answerId
				// 19远程辅导  20评估报告  22案件咨询
				if (answerId == 19) {
					this.tiIndex = 1
				} else {
					this.tiIndex = 0
				}
				return answerId
			},
			// 切换地址
			areaChange(e) {
				let arr = e.target.values
				let msg = ''
				arr.forEach((el, i) => {
					msg += el.name
				})
				this.lastMsg = msg

			},
			async submitCase() {
				uni.showLoading({
					title: '正在前往沟通页面...'
				});

				let msg = {
					type: 1,
					userId: this.user.id,
					caseId: this.caseId ? this.caseId : null,
					messageType: 1
				}
				msg.statu = 1
				msg.caseType = 0
				await this.$api.updateCase(Object.assign(msg, this.aniList))
				msg.messageType = 5
				msg.msg =
					`<div style='font-size:12px;width: 100%;white-space: nowrap;color: #c5c5c5;text-align: center;margin: 20px 0;'><span style='color:#999;'>———————</span><span style='margin:0 20px;'>专家正在赶来的路上~</span><span style='color:#999;'>———————</span></div>`
				await this.addMsg(msg)
				uni.redirectTo({
					url: `/pages/deprecated/chatroom?caseId=${this.caseId}&userId=${this.user.id}`
				});
			},

			// 点击下一步
			async submit(){
				// inputIndex:0,//输入框当前索引
				// current:1,//当前问题
				// lastMsg: '', //当前答案
				// 2填空 3 单选，4多选 5地址
				// typeIndex:3,//当前问题类型

				if (!this.flay) {
					this.flay = true
					setTimeout(() => {
						this.flay = false
					}, 500)
					let flagCheck
					let msg = {
						type: 1,
						userId: this.user.id,
						caseId: this.caseId ? this.caseId : null,
						messageType: 1
					}
					switch (this.current) {
						case 2:
							flagCheck = await this.checkboxMany(msg)
							break;
						case 3:
							flagCheck = await this.radio(msg)
							break;
						case 4:
							flagCheck = await this.detailCase(msg)
							break;
						case 5:
							flagCheck = await this.detailMoeny(msg)
							break;
						case 6:
							flagCheck = await this.caseDetail(msg)
							break
						default:
							this.isSubmit = 2
							break;

					}
					console.log(this.current, "当前问题", flagCheck);
					if (!!flagCheck) {
						this.current++
					}
					return
				}

			},

			async goSeek() {
				let msg = {
					type: 1,
					userId: this.user.id,
					caseId: this.caseId ? this.caseId : null,
					messageType: 1
				}
				this.payDetail.type = 11
				this.payDetail.bussinessType = 41
				await this.moenyBranch(msg)
				await this.aeekAdviceFrom()
				this.isSubmit = 1
				this.$refs.child2.close()

			},
			// 多选问题 险种类别
			async checkboxMany(msg) {
				let flagCheck = true
				let msgs = await this.addText()
				if (msgs.msg) {
					this.nums = []
					this.typeIndex = 3

					this.$nextTick(() => {
						this.flag = true
					})
					await this.pushChatMsg({
						answerType: 2,
						type: 1,
						msg: msgs.msg
					})
					msg.msg = msgs.msg
					this.aniList.answer2 = msgs.nums
					this.aniList.answer3InsuranceCategory = msgs.nums
					await this.addMsg(Object.assign({}, msg, this.aniList))
					await this.getQuestionCurrent(1)
				} else {
					this.$toast('该项为必选')
					flagCheck = false
				}
				this.lastMsg = ''
				return flagCheck
			},
			// 目前案件处理阶段 单选
			async radio(msg) {
				let awer1 = this.lastQ[this.msgIndex].answerId
				this.typeIndex = 2
				this.inputIndex = 0
				await this.pushChatMsg({
					answerType: 2,
					type: 1,
					msg: this.lastQ[this.msgIndex].msg
				})
				msg.msg = this.lastQ[this.msgIndex].msg
				this.aniList.answer1 = awer1
				this.aniList.answer1CaseStatus = awer1
				await this.addMsg(Object.assign({}, msg, this.aniList))
				if ([1, 2, 3].includes(awer1)) {
					this.payDetail.type = 10
					this.payDetail.bussinessType = 40
					await this.aeekAdviceFrom()
					return false
				}

				await this.getQuestionCurrent(9)
				return true
			},
			async aeekAdviceFrom() {
				let msg = {
					type: 3,
					userId: this.user.id,
					caseId: this.caseId ? this.caseId : null,
					messageType: 1
				}
				this.pushChatMsg({
					answerType: 1,
					type: 3,
					msg: '<p>通过文字向专家提问，仅限一家保险公司一起理赔案件。</p><br/><p>收费标准： 60元，含1次提问+1次追问。</p><br/><p>服务时间：工作日9:00-18:00</p>'
				})
				msg.msg =
					'通过文字向专家提问，仅限一家保险公司一起理赔案件。\n\n收费标准： 60元，含1次提问+1次追问。\n\n服务时间：工作日9:00-18:00'
				msg.messageType = 1
				await this.addMsg(msg)
				this.pushChatMsg({
					answerType: 1,
					type: 3,
					pdf: true,
					msg: '<div @click="naoTo" class="" style="display: flex;width:230px;justify-content: space-between;"><div class="" style="flex-grow: 1;">问题咨询示例.pdf</div><div class=""><img style="width: 44px;height: 44px;"  src="https://app.y9net.cn/data/01/32/wKgBNmNbb8WAOJqTAAAKj1Rk9sM643.png" mode=""></img></div></div>',
					url: 'https://app.y9net.cn/data/01/3B/wKgBNmQmeWeAav6HAAHON4BjMCk032.pdf'
				})
				msg.msg =
					'https://app.y9net.cn/data/01/3B/wKgBNmQmeWeAav6HAAHON4BjMCk032.pdf,问题咨询示例.pdf'
				msg.messageType = 2
				await this.addMsg(msg)
				this.isSubmit = 1
			},
			// 拒赔告知理由 //填空
			async detailCase(msg) {
				let flagCheck = true
				if (!!this.lastMsg) {
					this.typeIndex = 2
					this.inputIndex = 1
					await this.pushChatMsg({
						answerType: 2,
						type: 1,
						msg: this.lastMsg
					})
					msg.msg = this.lastMsg
					this.aniList.answer9RefusalReason = this.lastMsg
					await this.addMsg(Object.assign(msg, this.aniList))
					await this.getQuestionCurrent(4)
				} else {

					this.$toast('输入值不能为空')
					flagCheck = false
				}
				this.lastMsg = ''
				return flagCheck
			},
			// 金额 填空
			async detailMoeny(msg) {
				let flagCheck = true
				if (!!this.lastMsg) {
					let money = this.lastMsg * 1
					if (money < 20000) {
						this.$refs.child2.open()
						return
					}
					await this.moenyBranch(msg)
					if (money >= 20000 && money < 100000) {
						this.isSubmit = 2
					} else {
						await this.getQuestionCurrent(11)
						this.typeIndex = 2
						this.inputIndex = 2
					}

				} else {
					this.$toast('输入金额不能为空')
					flagCheck = false
				}
				this.lastMsg = ''
				return flagCheck
			},
			async moenyBranch(msg) {
				await this.pushChatMsg({
					answerType: 2,
					type: 1,
					msg: this.lastMsg + '元'
				})
				msg.msg = this.lastMsg + '元'
				this.aniList.answer3 = this.lastMsg
				this.aniList.answer4Amount = this.lastMsg
				await this.addMsg(Object.assign({}, msg, this.aniList))
			},
			// 简要说明案件情况
			async caseDetail(msg) {
				let flagCheck = true
				if (!!this.lastMsg) {
					this.typeIndex = 2
					this.inputIndex = 2
					await this.pushChatMsg({
						answerType: 2,
						type: 1,
						msg: this.lastMsg
					})
					msg.msg = this.lastMsg
					this.aniList.newAnswer5 = this.lastMsg
					await this.addMsg(Object.assign({}, msg, this.aniList))
					this.isSubmit = 2
				} else {
					this.$toast('输入值不能为空')
					flagCheck = false
				}
				this.lastMsg = ''
				return flagCheck
			},

			inputMsg() {
				console.log(this.iptmsg);
			},


			// 争议金额失去焦点
			inputBlur(e) {
				console.log('失去焦点', e, this.lastMsg);
				if (this.inputIndex == 1) {
					this.lastMsg = Math.floor(e.detail.value * 100) / 100
				} else {
					this.lastMsg = e.detail.value
				}


				this.blur_flay = true
				this.bluerHigt()
			},
			// 争议金额获取焦点
			keyfocus() {
				this.blur_flay = false
			},
			// 多选其他失去焦点
			bluerHigt() {

				uni.hideKeyboard()
				this.keyHeight = 0
			},

			upLoadFile(index, type) { //type:0,投保过程，1理赔过程
				console.log(this.obj)
				let that = this;
				uni.chooseFile({
					type: 'file',
					success: function(source) {
						console.log(source)
						if (source.tempFiles[0].size < 1024 * 1024 * 5) {
							let tempFilePaths = source.tempFilePaths
							uploadFilesAll(tempFilePaths, function(res) {
								console.log(res)
								this.fileL.push(...res)
							})
						} else {
							this.$toast('文件过大，无法上传')
						}
					}
				});
			},
			//修改订单状态为正常
			async setOrder() {
				let msg = {
					type: 1,
					userId: this.user.id,
					caseId: this.caseId ? this.caseId : null,
					messageType: 1
				}
				// this.$emit('submit', {
				// 	caseId: this.caseId
				// })
				// let awser2 = this.aniList.answer2ServiceItem
				// 判断案件类型
				// if (awser2 == 19) {
				// 	bussinessType = 30
				// 	type = 1
				// } else if (awser2 == 22) {
				// 	bussinessType = 31
				// 	type = 2
				// } else if (awser2 == 20) {
				// 	bussinessType = 32
				// 	type = 3
				// } else if (awser2 == 32) {
				// 	bussinessType = 33
				// 	type = 4
				// } else if (awser2 == 33) {
				// 	bussinessType = 34
				// 	type = 5
				// } else if (awser2 == 34) {
				// 	bussinessType = 35
				// 	type = 6
				// }
				// 10,11
				if(this.payDetail.type==10){
					msg.caseType=7
				}else{
					msg.caseType=8
				}

				await this.$api.updateCase(Object.assign(msg, this.aniList))

				console.log(this.caseId, "当前id");
				let params = Object.assign({}, {
					caseId: this.caseId
				}, this.payDetail)
				uni.navigateTo({ url: '/pages/pay/payPage' })
			},
			/**下一步，提交type：1用户 2，专家 3，机器人
			 * 用户端提交内容 回复机器人：交机器人问题+答案，回复专家：仅提交答案（专家在后台提交自己的消息）
			 */

			//单选
			changeSingleList(e) {
				this.msgIndex = e.detail.value[0]
				this.judgeNext()

			},
			//多选
			selectOptions(index) {
				let itemCurrent = this.lastQ[index]
				const result = this.nums.findIndex(item => item === itemCurrent.answerId);
				if (result === -1) {
					if (itemCurrent.answerId == 18) {
						this.$nextTick(() => {
							this.flag = false
						})
					}
					this.nums.push(itemCurrent.answerId)
				} else {
					this.nums.splice(result, 1)
				}
				if (itemCurrent.checked == true) {
					itemCurrent.checked = false
				} else {
					itemCurrent.checked = true
				}
			},
			reselection() {
				this.nums.pop()
				this.lastQ[this.lastQ.length - 1].checked = false
				this.flag = true

			},
			updateLastQ() {
				this.lastQ = this.chatMsg[this.chatMsg.length - 1]
				console.log('最后一条数据', this.lastQ)
				this.$nextTick(() => {
					this.getChatInputH()
				});
			},


			//查询聊天记录
			async getMsgOrder() {
				let res = await this.$api.getMsgOrder({
					caseId: this.basic.caseId
				})
				if (res.code == 200) {
					console.log('回显数据', res.rows)
					this.$store.state.chatMsg.length = 1
					this.$store.state.chatMsg.push(...res.rows.reverse())
				}
				return true
			},
			// 提交聊天记录
			async addMsg(msg) {
				let res = await this.$api.addMsgOrder(msg)
				if (res.code == 200) {
					this.caseId = res.data
				}
				return true
			},

			// 查询用户+专家信息,type；1用户，2专家
			async getuserDetail(userId, expertId) {
				let data = {
					userName: '',
					userPhoto: '',
					expertName: '',
					expertPhoto: '',
				}
				let res = await this.$api.getCaseUser({
					id: userId
				})
				if (res.code == 200 && res.rows[0]) {
					data.userName = res.rows[0].nickName || res.rows[0].realName
					data.userPhoto = res.rows[0].photo

				}
				// let res1 = await this.$api.getCaseUser({
				// 	id: expertId
				// })
				// if (res.code == 200 && res1.rows[0]) {
				// 	data.expertName = res1.rows[0].nickName || res1.rows[0].realName
				// 	data.expertPhoto = res1.rows[0].photo

				// }
				console.log('组合数据', data)
				return data

			},
			//查看该订单上传的图片
			nav(name) {
				uni.navigateTo({
					path:'/pages/case/case',
					params: {
						orderId: this.basic.caseId
					}
				})
			},
			//获取聊天室的 输入框的高度
			getChatInputH() {
				let that = this
				let chatInputH = 0
				// #ifdef MP-ALIPAY
				let el = uni.createSelectorQuery().select('.bottom');
				// #endif
				// #ifndef MP-ALIPAY
				let el = uni.createSelectorQuery().in(this).select('.bottom');
				// #endif
				el.boundingClientRect().exec((res) => {
					if (res[0]) {
						chatInputH = res[0].height
					}
					this.$store.state.chatInputH = chatInputH * 1 || 120
				});
			},
			// 开关 底部选择聊天发送
			toggleMsgType() {
				let that = this
				this.msgTypeShow = !this.msgTypeShow
				this.$store.state.msgTypeShow = this.msgTypeShow

				this.$nextTick(() => {
					that.getChatInputH()
				});

			},
			focus() {
				this.$emit('inputFocused')
			},

			blur() {
				this.$emit('inputBlured')
			},
			inputBlured() {
				this.$emit('inputBlured');
			},

			// addOrUpdate(data){
			// 	return http.post(this.requestPath.addOrUpdate, data)
			// },
			// msglist(data){
			// 	return http.post(this.requestPath.msglist, data)
			// },



		}
	}
</script>

<style lang="scss" scoped>
	.alert_style {
		text-align: center;
		.title_text {
			font-size: 38rpx;
		}

		.text_pay {
			// margin-top: 42rpx;
			font-size: 32rpx;
			text-align: center;
			line-height: 50rpx;
		}

		.child_flex {
			font-size: 28rpx;
			display: flex;
			justify-content: space-between;
			margin-top: 52rpx;

			.child_btnerr {
				box-sizing: border-box;
				width: 266rpx;
				height: 72rpx;
				line-height: 64rpx;
				border-radius: 400rpx;
				border: 2px solid #d8d8d8;
				color: #999999;
			}

			.child_btnnext {
				box-sizing: border-box;
				width: 266rpx;
				height: 72rpx;
				line-height: 72rpx;
				color: white;
				border-radius: 400rpx;
				background: linear-gradient(139deg, #6BB3FF 0%, #1486FF 100%);
				box-shadow: 0px 2px 7px 0px rgba(0, 115, 238, 0.27);
			}
		}
	}

	.alertC {
		width: 600rpx;
		font-size: 32rpx;
		// color: #666666;
		text-align: center;

		.alert {
			margin-bottom: 26rpx;
		}

		.colorAl {
			color: #3F9CFF;
		}

		.colorAl_fo {

			font-family: PingFang SC-中黑体, PingFang SC;
			font-weight: 600;

		}

		.colorAl_btn {
			margin: 0 auto;
			margin-top: 60rpx;
			border-radius: 400rpx;
			text-align: center;
			color: white;
			width: 538rpx;
			height: 74rpx;
			line-height: 74rpx;
			background: linear-gradient(134deg, #F8FAFF 0%, #78B9FD 0%, #3F9CFF 100%);
			box-shadow: 0px 4px 10px 0px rgba(63, 156, 255, 0.2);
		}



		.colorAl_fw {

			font-family: PingFang SC-常规体, PingFang SC;
			font-weight: 400;
		}

	}

	::v-deep .active-class {
		color: #3F9CFF !important;
	}

	.vanArea {
		position: relative;
		top: -250rpx;


	}

	.view-column {
		background-color: transparent;
	}

	.imgBox {
		display: flex;
		justify-content: space-between;

		.img_name {
			border-bottom: 2rpx solid $uni-text-color-inverse;
			max-width: 544rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.j_btn {
			color: $uni-text-color-inverse;
		}
	}

	.onload {
		padding: 44rpx 32rpx;

		image {
			width: 256rpx;
			height: 80rpx;
		}
	}

	.btnInut {
		width: 686rpx;
		height: 124rpx;
		line-height: 124rpx;
		text-align: center;
		color: #fff;
		margin: 200rpx auto 0rpx auto;
		background: linear-gradient(90deg, #3F9CFF 6%, #7ABAFF 100%);
		border-radius: 20rpx;
	}

	.submit_flex {
		display: flex;
		justify-content: space-between;

		.ipt_text input {
			text-align: left;
			background-color: #eeeeee;
			width: 400rpx;
			height: 66rpx;
			line-height: 66rpx;

			margin-top: 20rpx;
			border-radius: 20rpx;
			font-size: 32rpx;
			padding-left: 15rpx;
		}

		.lot {
			width: 100rpx;
			text-align: center;
			flex: none;
		}
	}

	.submit1 {
		text-align: right;

		color: $uni-text-color-inverse;
		padding: 20rpx 32rpx;
		border-bottom: 1px solid #F9f9f9;
		height: 66rpx;
		line-height: 66rpx;
		flex: 1;
	}

	// .submit1{text-align: center;color: #fff;padding: 0 60rpx;height:72rpx;background:rgba(255,130,29,1);border-radius:35rpx;}
	.icon_right {
		width: 16rpx;
		height: 48rpx;
	}

	.item_right {
		color: $uni-text-color-grey;
		flex: 1;
		text-align: right;
		font-weight: 700;
	}



	.singleBox1 {
		max-height: 250rpx;
		overflow: auto;

		// padding: 40rpx 34rpx;
		.item {
			padding-left: 36rpx;
			padding-right: 36rpx;
		}

		.item0 {
			width: 324rpx;
			text-align: center;
		}
	}

	.itPublic {
		background: #fff;
		border-radius: 50rpx;
		padding-top: 15rpx;
		padding-bottom: 15rpx;
		margin-right: 30rpx;
	}

	.itPublic:last-child {
		margin-right: 0;
		margin-bottom: 0;
	}

	.colorR {
		color: #3F9CFF;
	}


	// background: #F4F4F4;
	.buttons {
		font-size: 28rpx;
		padding: 24rpx 120rpx;

		.btn {
			width: 136rpx;
			height: 64rpx;
			line-height: 64rpx;
			background: #3F9CFF;
			text-align: center;
			border-radius: 60rpx
		}

		.numBtn {
			color: #B6B6B6;
			font-size: 32rpx;
		}

		.btn1 {
			background: #E2E2E2;
		}

		.btn2 {
			color: #fff;
		}
	}



	.nextStep {
		background-color: white;
		position: relative;
		z-index: 100;
	}

	.pickerView {
		height: 400rpx;

	}

	.finishBox {
		height: 400rpx;
	}

	.answer {
		background-color: #FFF;
		overflow: hidden;
		width: 100%;

		.input .input_num {
			display: inline-block;
			width: 200rpx;
			height: 75rpx;
			background: #F4F4F4;
			border-radius: 8rpx;
			vertical-align: middle;
		}

		.input .input_Insurance {
			display: inline-block;
			width: 500rpx;
			height: 75rpx;
			background: #F4F4F4;
			border-radius: 8rpx;
			vertical-align: middle;
		}

		.input .input_nickname {
			display: inline-block;
			width: 200rpx;
			height: 75rpx;
			background: #F4F4F4;
			border-radius: 8rpx;
			vertical-align: middle;
		}

		.content {
			.li {
				width: 50%;
			}
		}

		.right {
			width: 200rpx;
		}

		.topInput {
			text-align: center;
			margin-top: 30rpx;
			color: #000;
		}

	}






	.chat_bar {}

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

	::v-deep .select-line::after {
		border-bottom: none;
	}

	::v-deep .select-line::before {
		border-top: none;
	}

	.colorType {
		color: #3F9CFF;
	}

	.bottom {
		background: #fff;
	}

	/*checkbox 选项框大小  */
	checkbox .wx-checkbox-input {
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;

	}

	/*checkbox选中后样式  */
	checkbox .wx-checkbox-input.wx-checkbox-input-checked {
		background: $uni-text-color-inverse;
		border: none;
	}

	/*checkbox选中后图标样式  */
	checkbox .wx-checkbox-input.wx-checkbox-input-checked::before {
		// width: 28rpx;
		// height: 28rpx;
		// line-height: 28rpx;
		text-align: center;
		font-size: 22rpx;
		color: #fff;
		background: transparent;
		transform: translate(-50%, -50%) scale(1);
		-webkit-transform: translate(-50%, -50%) scale(1);
	}

	.payBtn1 {
		display: inline-block;
		text-align: center;
		width: 80%;
		height: 80rpx;
		line-height: 80rpx;
		background: #FF821D;
		color: #fff;
		border-radius: 60rpx;
	}

	.payBtn {
		display: inline-block;
		text-align: center;
		width: 240rpx;
		height: 80rpx;
		line-height: 80rpx;
		background: #FF821D;
		color: #fff;
		border-radius: 60rpx;
	}

	.list {
		background: #fff;
		margin-left: 20rpx;
		display: inline-block;
		padding: 15rpx 5rpx;
		border-radius: 7rpx;
	}

	.list .item {
		margin: 0 30rpx;
		height: 50rpx;
	}

	.list .item:last-child {
		border: none;
	}

	.list .item_right {
		color: $uni-text-color-grey;
		flex: 1;
		overflow: auto;
	}

	.list .item_right input {
		text-align: right;
		margin-left: 80rpx;
	}

	.list .active,
	.icon_right {
		margin-left: 10rpx;
	}

	// .list	.icon_right{transform: rotate(90deg);}

	.typesLittle {
		height: 360rpx;
		overflow-y: auto;
		padding-bottom: 20rpx;
	}

	.typesLittle .item {
		margin-top: 20rpx;
		margin-left: 40rpx;
	}

	.typesLittle .item view {
		display: inline-block;
	}

	.other_MediationFun {
		border-top: 1px solid #D4DCE1;
		padding: 60rpx;
		background: $uni-bg-color-grey;

		.item {
			display: inline-block;
			margin-right: 40rpx;
			text-align: center;

			.item_img {
				display: inline-block;
				background: #fff;
				padding: 30rpx;
			}

			.item_img image {
				width: 60rpx;
				height: 40rpx;
			}

			.item_name {
				font-size: 28rpx;
				color: $uni-text-color-grey;
				margin-top: 20rpx;
			}
		}
	}

	.other_MediationFun .item:last-child {
		margin-right: 0
	}

	.room_bar {
		width: 100%;
		height: auto;
		/* border-bottom: 1px solid red; */
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 1;
		background-color: #F5F6F9;
		/* transform: translateZ(1000px); */
	}

	.publishArticle_bottom {
		background: #fff;
		width: 100%;
		position: fixed;
		left: 0;
		bottom: 0;
	}

	.other_func {
		width: 100%;
		padding: 20rpx 0;
		display: flex;
		border-top: 1px solid #D4DCE1;
	}

	.other_func_X {
		height: 128rpx;
	}

	.other_func image {
		width: 42rpx;
		height: 40rpx;
	}

	.open_emoji,
	.send_image,
	.open_camera,
	.v-record {
		width: 48rpx;
		height: 48rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		// margin-left: 48rpx;
	}

	.send_image1 {
		align-items: baseline;
		margin-right: 24rpx;
	}


	.v-record .icon-record {
		width: 18rpx;
		height: 40rpx;
	}

	.v-record {
		margin-left: 48rpx;
	}

	.open_camera,
	.send_image {
		// margin-left: 64rpx;
	}

	.issubimt {
		background: $uni-bg-color-grey;
	}


	.addMsg_voice image {
		width: 36rpx;
		height: 36rpx;
	}

	.addMsg image {
		width: 40rpx;
		height: 40rpx;
	}

	.text-input {
		width: 100%;
		height: 100rpx;
		padding: 0;
		display: block;
	}

	.news {
		width: 100%;
		height: 62rpx;
		font-size: 14px;
		padding-left: 20rpx;
		display: inline-block;
		line-height: 48rpx;
		position: relative;
		top: 0;
	}

	.bgEx {
		background-color: #0091EA;
	}

	.indicatorStyle {
		color: #3F9CFF;
	}

	.bg {
		background-color: $uni-text-color-inverse;
	}

	.send_btn {
		width: 120rpx;
		height: 60rpx;
		line-height: 60rpx;
		color: #fff;
		padding: 0;
		display: inline-block;
		float: right;
		border-radius: 30rpx;
		text-align: center;
	}

	.f-row {
		padding: 0 30rpx;
		height: 100rpx;
		display: flex;
		align-items: center;

	}

	.cancat {
		position: fixed;
		right: 0;
		bottom: 184rpx;
	}

	.cancat image {
		width: 128rpx;
		height: 118rpx;
	}

	.chatList {
		padding: 0 30rpx;
	}

	.keywords {
		background: #f5f6f9;
		width: 100%;
		white-space: nowrap;
		padding: 30rpx 0;
	}

	.keywords .item {
		margin-right: 20rpx;
		padding: 10rpx 26rpx;
		display: inline-block;
		border-radius: 30px;
		border: 2rpx solid $uni-text-color-inverse;
		color: $uni-text-color-inverse;
	}

	.keywords .paddLeft {
		margin-left: 30rpx;
	}

	.userYour {
		position: relative;
	}

	.user {
		position: relative;
		bottom: 0rpx;
		right: 0rpx;
	}

	.user .user-text {
		font-size: 24rpx;
		color: #888888;
	}

	.avatar {
		width: 92rpx !important;
		height: 92rpx !important;
		border-radius: 6rpx;
		float: left;
		border-radius: 50%;
	}

	.questions {
		max-width: 460rpx;
	}

	.title {
		padding-bottom: 28rpx;
		border-bottom: 1px solid #e5e5e5;
	}

	.title .left {
		font-weight: 700;
	}

	.title image {
		margin-right: 12rpx;
		vertical-align: bottom;
	}

	.title .left image {
		width: 40rpx;
		height: 40rpx;
	}

	.title .right {
		font-size: 24prx;
		color: #888;
	}

	.title .right image {
		width: 32rpx;
		height: 30rpx;
	}

	.content {

		color: #418acf;
		font-size: 28rpx;
		line-height: 40rpx;
	}

	.content .item {
		width: 100%;
		padding-bottom: 20rpx;
	}

	.content .item:last-child {
		padding-bottom: 0;
	}

	page,
	uni-app,
	.questionChat {
		background: $uni-bg-color-grey;
		height: 100%;
		width: 100%;
	}

	.radioReset .uni-radio-wrapper .uni-radio-input {
		background: red;
	}

	.msgCenter {
		margin-top: 50rpx;
		padding-bottom: 80rpx;
	}

	.singleBox {
		padding: 40rpx 34rpx;

		.item {
			margin-bottom: 30rpx;
			padding-left: 36rpx;
			padding-right: 36rpx;
		}

		.item0 {
			width: 324rpx;
			text-align: center;
		}
	}

	.itemPublic {
		display: inline-block;
		background: rgba(94, 181, 169, 0.08);
		border-radius: 12rpx;
		color: $uni-text-color-inverse1;
		padding-top: 15rpx;
		padding-bottom: 15rpx;
		margin-right: 30rpx;
	}

	.itemPublic:last-child {
		margin-right: 0;
		margin-bottom: 0;
	}

	.confirm_btn {
		display: inline-block;
		width: 690rpx;
		height: 80rpx;
		text-align: center;
		line-height: 80rpx;
		background: $uni-text-color-inverse;
		color: #fff;
		border-radius: 12rpx;
	}

	.daysBox {
		.right {}

		// height: 132rpx;line-height: 132rpx;
		.daysBoxTop {
			height: 132rpx;
			line-height: 132rpx;
			padding: 0 30rpx;
		}

		.publicBtn {
			margin-right: 20rpx;
			width: 36rpx;
			color: $uni-text-color-inverse;
			height: 36rpx;
			border: 2rpx solid $uni-text-color-inverse;
		}

		.reduce {}

		.rightInput {
			text-align: center;
			width: 120rpx;
			height: 60rpx;
			background: rgba(94, 181, 169, 0.08);
			border-radius: 12rpx;
		}

		.add {
			margin-left: 20rpx;
		}
	}

	.disabled {
		color: #656565;
		background: rgba(28, 37, 42, 0.07);
	}

	.chatAnswer {
		background: #fff;
		max-height: 900rpx;
		overflow-y: auto;
	}

	.answerContent {
		height: 300rpx;

		.item {
			line-height: 50px;
			text-align: center;
		}
	}

	.label {
		text-align: right;
		color: $uni-text-color-inverse;
		font-size: 24rpx;
	}

	.submit {
		text-align: right;

		view {
			color: $uni-text-color-inverse;
			padding: 30rpx 40rpx;
		}
	}

	.imgTop {
		width: 100%;
	}

	.scroll_view {
		margin-top: 60rpx;
		margin-bottom: 174rpx;
	}

	.scroll_view_change {
		margin-top: 60rpx;
		margin-bottom: 174rpx;
	}

	.paddTop {
		padding-top: 90rpx;
	}

	.paddNone {
		padding: 0;
	}

	.scroll_view_X,
	.scroll_view_change_X {
		margin-bottom: 244rpx;
	}

	.scroll_view_change {
		/*bottom: 440rpx;*/
		margin-bottom: 590rpx;
	}

	.message {
		// margin-top: 40rpx;
		width: 100%;
		height: auto;
		padding: 0 30rpx;
		position: relative;
	}

	// 发送的消息非img

	.msg {
		display: inline-block;
		// max-width: calc(85% - 80rpx);
		min-height: 40rpx;
		font-size: 32rpx;
		/*overflow: hidden;*/
		text-align: left;
		word-break: break-all;
		// background-color: #fff;
		// border-radius:0 40rpx 40rpx 40rpx;
		position: relative;
		margin-top: 20rpx;
	}

	.msg .msg-text {
		line-height: 40rpx;
		font-size: 32rpx;
		margin: 0;
	}

	.msgBg {
		box-shadow: 0px 0px 12rpx 2rpx rgba(204, 227, 244, 0.5);
		// border-radius:40rpx 0px 40rpx 40rpx;
		padding: 30rpx 30rpx;
		background-color: #fff;
		border-radius: 0 40rpx 40rpx 40rpx;
	}

	.textRight {
		text-align: right;
	}

	.colorRight {
		background: $uni-text-color-inverse;
		border-radius: 40rpx 0rpx 40rpx 40rpx;
		color: #fff;
	}

	.colorLeft {
		background: #fff;
	}

	.self .msg:before {
		right: inherit;
		left: 100%;
		border-right-color: transparent;
		border-left-color: #b2e281;
	}

	.template {
		display: inline;
	}
</style>