export interface UserState {
  id?: number
  token?: string
  nickName?: string
  photo?: string
  remark?: string
  mobile?: string
  pid?: string//  推荐人id，登录后清除，退出时也清除，最好是做一个邀请页面
}
