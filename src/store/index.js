
import Vuex from 'vuex'
import uniAsync from '@/common/uni-async.js'

// 获取moudules文件下所有js文件
const context = require.context('./modules', false, /\.js$/)
// context.keys() 返回匹配成功模块的名字组成的数组
const modules = context.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  // 通过context(key)导出文件内容。在文件中时通过export.default导出的，所以后边加.default
  const fileModule = context(modulePath)
  modules[moduleName] = fileModule.default
  return modules
}, {})

const user = uni.getStorageSync('user')
const store = new Vuex.Store({
  namespaces: true,
  state: {
    user: user, //{id:1406,mobile:"13216186546",nickName:'钟悦',remark:7,isAuth:0,photo:'https://app.y9net.cn/data/01/2F/wKgBNmMDJtqAPr1GAAAiYzEmGnU886.png'},
    appid: 'wx7456256bd260ac6f',
    remark: 6, //remark:5默认是保险客户，6推荐人，7团队长，认证时修改//1案件推荐人 2团队长 3用户 默认为用户
    loginInfor: { mobile: '1111' },
    chatMsg: [], //type：1用户 2，专家 3，机器人 answerType：1普通input 2填空 3 单选，4多选//聊天消息
    questionId: [], //'1,2'分开问题id
    answerId: [], //'[1],[1,2,3]' 答案id
    amount: '', //争议金额
    lastQ: {},
    company: {},
    msgTypeShow: false, //底部聊天框,
    datas: {} //消息四个tabbar点击事件
  },
  mutations: {
    setUser(state, target) {
      state.user = target
      uni.setStorageSync('user', target)
    },
    initChatMsg(state, target) {
      state.chatMsg = [{ answerType: 2, type: 3, msg: '尊敬的用户，欢迎使用理赔公社！' }]
    },
    pushChatMsg(state, target) {
      state.chatMsg.push(target)
    },
    getLists(state, datas) {
      state.datas = datas
    },
    setLoginInfor(state, target) {
      state.loginInfor = target
    }
  },
  getters: {},
  modules
})
export default store
