
import http from './interface'
export default {
	requestPath: {
		getSysDictData: 'sysDictData/list?isAsc=asc&orderByColumn=dict_sort&pageNum=1&pageSize=20', //查询字典
		getDictData: "sysDictData/getDictData", //字典
		register: "iclaim/login/register", //注册、登录
		decryptPhone: 'iclaim/login/decryptPhone', //微信 根据sessionKey等解密手机号
		fetchVcode: 'iclaim/login/lpgsFetchVcode', //获取手机验证码
		getSessionKey: 'iclaim/login/getSessionKey2', //微信 获取openid和sessionKey
		getCaseAnswer: 'CastList/CaseAnswer/list', //查询答案列表
		addMsg: 'iclaim/UserExpertMsg/addOrUpdate', //新增了聊天记录（不生成订单）
		getMsg: 'iclaim/UserExpertMsg/list', //查询聊天记录
		getCastList: 'CastList/case/list', //查询案件列表
		updateCase: 'CastList/case/addOrUpdate', //修改案件（修改案件状态）
		getCaseDetails: 'CastList/CaseDetails/list', //查询案件的时间记录
		getCaseUser: 'CastList/caseUser/list', //获取用户
		updateCaseUser: 'CastList/caseUser/addOrUpdate', //修改用户
		addMsgOrder: 'CastList/userExpertMsg/add', //新增了聊天记录（生成订单）
		getMsgOrder: 'CastList/userExpertMsg/list', //查询（生成订单）
		checkPerson: 'iclaim/user/checkPerson', //认证
		getAnalysis: 'CastList/case/analysis', //获取信息
		file: 'iclaim/user/upload/file',
		photoUploadByChat: 'iclaim/mewExpert/photoUploadByChat',
		CaseDetail: 'CastList/case/getCaseDetails', //获取用户信息
		inviteRecord: 'lpgsUser/inviteRecord',
		getChat: 'iclaim/UserExpertMsg/list', //用户专家聊天记录
		getimgs: 'iclaim/mewExpert/photoUploadByCaseChat',
		getFile: 'iclaim/mewExpert/fileUploadByCaseChat',
		listData: 'iclaim/UserExpertMsg/getCount',
		pillList: 'iclaim/UserExpertMsg/pillList',
		getMessageTypeList: 'iclaim/caseMessage/getMessageTypeList',
		deletedMessage: '/iclaim/caseMessage/deletedMessage',
		getCaseStatusMessage: "iclaim/caseMessage/getCaseStatusMessage",
		deletedStepMessage: 'iclaim/caseMessage/deletedStepMessage',
		selectUser: 'lpgsUser/selectUserIdentity',
		getMyTeam: 'lpgsUser/getMyTeam',
		getMyPoints: 'lpgsPoints/getMyPoints',
		getSystemMessage: 'iclaim/caseMessage/getSystemMessage',
		getBanner: 'iclaim/homePage/getBanner',
		getMeetingList: 'iclaim/meeting/getMeetingList',
		getMeetingById: 'iclaim/meeting/getMeetingById',
		updateMeetingStatus: 'iclaim/meeting/updateMeetingStatus',
		baoMinUpgrade: 'lpgsUser/baoMinUpgrade',
		getUpgradeByUserId: 'lpgsUser/getUpgradeByUserId',
		getUpgradeStatus: 'lpgsUser/getUpgradeStatus',
		lpgsOrderPayment: 'iclaim/thirdPay/v3/lpgsOrderPayment',
		getQuestionAndAnswer: 'CastList/getQuestionAndAnswer',
		getUserCaseInfo: "lpgsUser/getUserCaseInfo",
		baominUpgradeWarn: 'lpgsUser/baominUpgradeWarn',
		caselist: 'iclaim/lpgsArticle/list?isAsc=desc&orderByColumn=updateTime&pageSize=20&pageNum=',
		getArticle: 'iclaim/lpgsArticle/getArticle',
		userInviteRecord: 'lpgsUser/userInviteRecord',
		inviteMemberByLeader: 'lpgsUser/inviteMemberByLeader',
		getBonus: 'CastList/getBonus',
		getCaseMessage: 'iclaim/caseInfo/getCaseMessage', //根据caseid获取案件信息
		getListAll: 'iclaim/LpgsReadingClass/listAll', //获取所有讲师列表
		getSingleList: "iclaim/LpgsReadingSingleClass/getSingleList",
		getMyOrder: 'orders/getMyOrder', //获取我的订单
		getOrderInfo: "orders/getOrderInfo", //获取订单详细信息
		getGameWarsList: 'gameWars/list?pageNum=1&pageSize=100&isAsc=desc&orderByColumn=createTime', //获取兵棋推演活动列表
		getGameWarsInfo: 'gameWars/getInfo?gameCaseId=', //获取兵棋推演详情
		getIdentityList: "gameComment/getIdentityList", //红军蓝军
		setSelectIdentity: "gameWars/selectIdentity", //选择身份
		getUserIdentity: "gameComment/getUserIdentity", //获取当前案件身份
		getGameCommentList: 'gameComment/list', //获取案件评论列表
		setUserComment: 'gameComment/userComment', //评论
		getUserLike: 'gameUserLike/getUserLike', //获取用户自己是否点赞
		setUserLike: 'gameUserLike/userLike', //用户给评论点赞
		getUserComment:'gameComment/getUserLike',//获取用户自己的评论
		modifyComment:'gameComment/modifyComment',//用户修改评论
		userRecord:'gameWars/userRecord',//埋点，查看用户情况
		getDynamicEntries:'gameWars/getDynamicEntries',//获取兵棋推演滚动通知
		setSaveSendId:'gameWars/saveSendId',//添加订阅消息
		questionList:'newCase/question/list',//获取第一次问题
		addCase:'newCase/addCase',//进入页面获取caseId
		newMessageList:'newCase/message/list',//获取聊天记录
		selectPhotoUploadByCaseChat:'newCase/message/selectPhotoUploadByCaseChat',//获取聊天记录图片接口
		selectFileUploadByCaseChat:'newCase/message/selectFileUploadByCaseChat',//获取聊天记录图片接口
		newGetCount:'newCase/message/getCount',//获取聊天记录总数
		batchSave:'newCase/message/batchSave',//聊天记录批量添加
		newGetCaseInfo:'newCase/getCaseInfo',//新案件列表
		newMessageSave:'newCase/message/save',//新案件列表
		newInviteRecord:'newCase/newInviteRecord',//获取我的邀请记录人数
		isExist:'lpgsUser/isExist',//判断用户是否注册
		photoUploadByCaseChat:'newCase/photoUploadByCaseChat',//聊天添加图片记录
		fileUploadByCaseChat:'newCase/fileUploadByCaseChat',//聊天添加文件记录
		getNewPillList:'newCase/message/pillList',//上拉聊天记录
		getExpertPhone: '/newCase/getExpertPhone',//专家联系电话
		verifyTicket: 'lpgsUser/verifyTicket',//峰会门票核销
		getTicket: 'lpgsUser/getTicket',//获得门票信息
		allSession: '/chat-room/all-session',//会话记录列表
		sessionMessages: '/chat-room/session',//或者会话内容
		deleteSession: '/chat-room/delete',//删除会话
		addQuestion: 'chat-room/addQuestion',//添加反馈
		getQuestionList: '/chat-room/getQuestionList',//获取所有反馈
	},
	getQuestionList(data) {
		return http.post(this.requestPath.getQuestionList, data)
	},
	addQuestion(data) {
		return http.post(this.requestPath.addQuestion, data)
	},
	deleteSession(data) {
		return http.del(`${this.requestPath.deleteSession}?sessionId=${data}`)
	},
	getSessionMessages(data) {
		return http.get(this.requestPath.sessionMessages, data)
	},
	getAllSession(data) {
		return http.get(this.requestPath.allSession, data)
	},
	getTicket(data) {
		return http.get(this.requestPath.getTicket, data)
	},
	verifyTicket(ticketCode, userId){
		return http.put(this.requestPath.verifyTicket + `?ticketCode=${ticketCode}&userId=${userId}`)
	},
	getNewPillList(data){
		return http.get(this.requestPath.getNewPillList, data)
	},
	fileUploadByCaseChat(data){
		return http.post(this.requestPath.fileUploadByCaseChat, data)
	},
	photoUploadByCaseChat(data){
		return http.post(this.requestPath.photoUploadByCaseChat, data)
	},
	isExist(phone){
		return http.get(this.requestPath.isExist+"?phone="+phone)
	},
	newInviteRecord(data){
		return http.post(this.requestPath.newInviteRecord, data)
	},
	newMessageSave(data){
		return http.post(this.requestPath.newMessageSave, data)
	},
	newGetCaseInfo(data){
		return http.get(this.requestPath.newGetCaseInfo,data)
	},
	batchSave(data){
		return http.post(this.requestPath.batchSave, data)
	},
	newGetCount(caseId){
		return http.get(this.requestPath.newGetCount+'?caseId='+caseId)
	},
	selectFileUploadByCaseChat(data) {
		return http.post(this.requestPath.selectFileUploadByCaseChat, data)
	},
	selectPhotoUploadByCaseChat(data) {
		return http.post(this.requestPath.selectPhotoUploadByCaseChat, data)
	},
	newMessageList(query,data){
		return http.post(this.requestPath.newMessageList+query, data)
	},
	newAddCase(userId){
		return http.get(this.requestPath.addCase+'?userId='+userId)
	},
	questionList(type){
		return http.get(this.requestPath.questionList+'?type='+type)
	},setSaveSendId(data){
		return http.post(this.requestPath.setSaveSendId, data)
	},
	getDynamicEntries(caseId){
	return http.post(this.requestPath.getDynamicEntries+`?caseId=${caseId}`)	
	},
	userRecord(userId,gameCaseId){
	return http.get(this.requestPath.userRecord+`?userId=${userId}&gameCaseId=${gameCaseId}`)	
	},
	modifyComment(data){
		return http.post(this.requestPath.modifyComment, data)
	},
	getUserComment(userId, gameCaseId){
		return http.post(this.requestPath.getUserComment+ `?userId=${userId}&gameCaseId=${gameCaseId}`)
	},
	setUserLike(data) {
		return http.post(this.requestPath.setUserLike, data)
	},
	getUserLike(userId, gameCaseId) {
		return http.post(this.requestPath.getUserLike + `?userId=${userId}&gameCaseId=${gameCaseId}`)
	},
	setUserComment(data) {
		return http.post(this.requestPath.setUserComment, data)
	},
	getGameCommentList(query, data) {
		return http.post(this.requestPath.getGameCommentList + query, data)
	},
	getUserIdentity(userId, gameCaseId) {
		return http.post(this.requestPath.getUserIdentity + `?userId=${userId}&gameCaseId=${gameCaseId}`)
	},
	setSelectIdentity(data) {
		return http.post(this.requestPath.setSelectIdentity, data)
	},
	getIdentityList() {
		return http.post(this.requestPath.getIdentityList)
	},
	getGameWarsInfo(gameCaseId) {
		return http.get(this.requestPath.getGameWarsInfo + gameCaseId)
	},
	getGameWarsList(data) {
		return http.post(this.requestPath.getGameWarsList, data)
	},
	getClassType(data) {
		return http.get(this.requestPath.getClassType, data)
	},
	getOrderInfo(data) {
		return http.get(this.requestPath.getOrderInfo, data)
	},
	getMyOrder(data) {
		return http.get(this.requestPath.getMyOrder, data)
	},
	getSingleList(data) {
		return http.get(this.requestPath.getSingleList, data)
	},
	getListAll(data) {
		return http.get(this.requestPath.getListAll, data)
	},
	getDictData(data) {
		return http.post(this.requestPath.getDictData, data)
	},
	getCaseMessage(data) {
		return http.get(this.requestPath.getCaseMessage, data)
	},
	getBonus(data) {
		return http.post(this.requestPath.getBonus, data)
	},
	inviteMemberByLeader(data) {
		return http.post(this.requestPath.inviteMemberByLeader, data)
	},
	userInviteRecord(data) {
		return http.post(this.requestPath.userInviteRecord, data)
	},
	getArticle(data) {
		return http.post(this.requestPath.getArticle + '?articleId=' + data)
	},
	caselist(data, pageNum) {
		return http.post(this.requestPath.caselist + pageNum, data)
	},
	baominUpgradeWarn(data) {
		return http.get(this.requestPath.baominUpgradeWarn, data)
	},
	getUserCaseInfo(data) {
		return http.get(this.requestPath.getUserCaseInfo, data)
	},
	getQuestionAndAnswer(data) {
		return http.get(this.requestPath.getQuestionAndAnswer, data)
	},
	lpgsOrderPayment(data) {
		return http.post(this.requestPath.lpgsOrderPayment, data)
	},
	getUpgradeStatus(data) {
		return http.get(this.requestPath.getUpgradeStatus, data)
	},
	getUpgradeByUserId(data) {
		return http.get(this.requestPath.getUpgradeByUserId, data)
	},
	baoMinUpgrade(data) {
		return http.post(this.requestPath.baoMinUpgrade, data)
	},
	updateMeetingStatus(data) {
		return http.post(this.requestPath.updateMeetingStatus, data)
	},
	getMeetingById(data) {
		return http.get(this.requestPath.getMeetingById, data)
	},
	getMeetingList(data) {
		return http.get(this.requestPath.getMeetingList, data)
	},
	getBanner(data) {
		return http.get(this.requestPath.getBanner, data)
	},
	getSystemMessage(data) {
		return http.get(this.requestPath.getSystemMessage, data)
	},
	getMyPoints(data) {
		return http.post(this.requestPath.getMyPoints, data)
	},
	getMyTeam(data) {
		return http.get(this.requestPath.getMyTeam, data)
	},
	inviteRecord(data) {
		return http.post(this.requestPath.inviteRecord, data)
	},
	selectUser(data) {
		return http.post(this.requestPath.selectUser, data)
	},
	CaseDetail(data) {
		return http.get(this.requestPath.CaseDetail, data)
	},
	deletedStepMessage(data) {
		return http.get(this.requestPath.deletedStepMessage, data)
	},
	getCaseStatusMessage(data) {
		return http.get(this.requestPath.getCaseStatusMessage, data)
	},
	deletedMessage(data) {
		return http.get(this.requestPath.deletedMessage, data)
	},
	photoUploadByChat(data) {
		return http.post(this.requestPath.photoUploadByChat, data)
	},
	FilePhoto(data) {
		return http.post(this.requestPath.getFile, data)
	},
	file(data) {
		return http.post(this.requestPath.file, data)
	},
	getMsgOrder(data) {
		return http.post(this.requestPath.getMsgOrder, data)
	},
	getSysDictData(data) {
		return http.post(this.requestPath.getSysDictData, data)
	},
	getCaseDetails(data) {
		return http.post(this.requestPath.getCaseDetails, data)
	},
	getAnalysis(data) {
		return http.post(this.requestPath.getAnalysis, data)
	},
	updateCaseUser(data) {
		return http.put(this.requestPath.updateCaseUser, data)
	},
	checkPerson(data) {
		return http.post(this.requestPath.checkPerson, data)
	},
	addMsgOrder(data) {
		return http.put(this.requestPath.addMsgOrder, data)
	},
	expertInfoDetails(data) {
		return http.get(this.requestPath.expertInfoDetails, data)
	},
	listData(data) {
		return http.get(this.requestPath.listData, data)
	},
	pillList(data) {
		return http.get(this.requestPath.pillList, data)
	},
	//根据userid查询用户信息
	getCaseUser(data) {
		return http.post(this.requestPath.getCaseUser, data)
	},
	updateCase(data) {
		return http.put(this.requestPath.updateCase, data)
	},
	getCastList(data) {
		return http.post(this.requestPath.getCastList, data)
	},
	getMsg(data) {
		return http.post(this.requestPath.getMsg, data)
	},
	addMsg(data) {
		return http.put(this.requestPath.addMsg, data)
	},
	getCaseAnswer(data) {
		return http.post(this.requestPath.getCaseAnswer, data)
	},
	register(data) {
		return http.post(this.requestPath.register, data)
	},
	//解密手机号
	getDecryptPhone(data) {
		return http.get(this.requestPath.decryptPhone, data)
	},
	//获取手机验证码 回调的方式
	getFetchVcode(data, doSuccess) {
		let res = http.get(this.requestPath.fetchVcode, data)
		if (doSuccess && typeof doSuccess == 'function') {
			res.then(res => {
				doSuccess(res)
			})
		} else {
			return res
		}
	},
	//获取openid
	getSessionKey(data) {
		return http.get(this.requestPath.getSessionKey, data)
	},
	chatWith(url, data) {
		return http.post(this.requestPath.getChat + url, data)
	},
	photoImg(data) {
		return http.post(this.requestPath.getimgs, data)
	},
	// 获取案件具体消息
	getMessageTypeList(data) {
		return http.get(this.requestPath.getMessageTypeList, data)
	},
	// 获取专家联系电话
	getExpertPhone(data) {
		return http.get(this.requestPath.getExpertPhone, data)
	},
}