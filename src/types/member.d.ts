export type LoginRes = {
  tokenAccess: string
  tokenRefresh: string
  user: Member
}
export type Member = {
  /** 用户id */
  id: string
  /** 用户名 */
  fullname: string
  /** 头像id */
  avatarId: string
  /** 手机号 */
  phone: string
  /** 余额 */
  balance: number
  /** 积分 */
  score: number
  /** 加入时间 */
  joinTime: string
  /** 微信openId */
  openId?: string
  /** 登录token */
  tokenAccess?: string
  /** 刷新token */
  tokenRefresh?: string
}
