import http from '@/utils/http'

export interface DecryptPhoneParams {
  code: string
  iv: string
  encryptedData: string
}

export interface UserInfoParams {
  nickName?: string
}

export interface IdentityParams {
  type: string
}

export interface LoginParams {
  source: number
  mobile: string
  registerType: number
}

//登录
export function login(data: LoginParams) {
  return http({
    url: 'iclaim/login/register',
    method: 'POST',
    data,
  })
}

export function getDecryptPhone(data:DecryptPhoneParams) {
  return http({
    url: 'iclaim/login/decryptPhone',
    method: 'POST',
    data
  })
}

//获取手机验证码
export function sendSms(data: { mobile: string }) {
  return http({
    url: 'iclaim/login/lpgsFetchVcode',
    method: 'GET',
    data
  })
}

//获取用户信息，后端会自动处理身份
export function getUserInfo() {
  return http({
    url: 'lpgsUser/getUserInfo',
    method: 'POST',
  })
}

//获取sessionKey
export function getSessionKey(data:any) {
  return http({
    url: 'iclaim/login/getSessionKey2',
    method: 'GET',
    params: data
  })
}

//更新用户信息
export function updateUserInfo(data: UserInfoParams) {
  return http({
    url: 'lpgsUser/user/update',
    method: 'PUT',
    data
  })
}

export function selectIdentity(data: IdentityParams) {
  return http({
    url: 'lpgsUser/selectUserIdentity',
    method: 'POST',
    data
  })
}
