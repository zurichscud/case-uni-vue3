export interface UserState {
  id?: number
  token?: string
  nickName?: string
  photo?: string
  remark?: string
  mobile?: string
  openid?: string
  pid?: string //  推荐人id
  subNumber:number//订阅微信消息的次数
}
