const chat={
  state: {
   chatMsg:[],//type：1用户 2，专家 3，机器人 chatType：1文字 2图片 3按钮
   	  chatInputH:0,//底部距离
  },
  mutations: {
	    initChatMsg(state,target){
	  	state.chatMsg=[
			{type:3,msg:'尊敬的用户，欢迎使用理赔公社！',chatType:1},
			{type:3,msg:'如果你遇到保险公司拒赔或者少赔，可以找我们免费评估。',chatType:1},
			{type:3,msg:'我们的服务涵括重疾险、医疗险、意外险、寿险、雇主责任险、车险人伤、工伤保险。',chatType:1},
			{type:3,msg:'你可以联系理赔公社客服，微信与他们沟通案情',chatType:1},
			{type:3,msg:'https://app.y9net.cn/data/01/47/wKgBNmZVMTSAJdfvAAHyEYFTH8k979.jpg',chatType:2},
			{type:3,msg:'https://app.y9net.cn/data/01/47/wKgBNmZVTgCAHxQ8AAJGY8sYbNQ37.jpeg',chatType:2},
			{type:3,msg:'或者直接跟专家交流',chatType:1},
			{type:3,msg:'<div style="color: #3F9CFF;text-decoration: underline;">问专家>></div>',chatType:3,path:'/pages/chat/chatroom'},
	    ]
	  },
	  pushChatMsg(state,target){
	  	state.chatMsg.push(target)
	  },
  
  },
  actions:{
	
  },
  getters:{
  	  
  },
  	namespaced:true,
}
export default chat