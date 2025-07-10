import http from '@/utils/http'

//登录
export function login(data) {
  return http({
    url: 'iclaim/login/register',
    method: 'POST',
    data,
    custom: {
      successMsg: "登录成功",
      showSuccess: true
    }
  })
}

export function getDecryptPhone(data) {
  return http({
    url: 'iclaim/login/decryptPhone',
    method: 'GET',
    data
  })
}

//获取手机验证码
export function sendSms(data) {
  return http({
    url: 'iclaim/login/lpgsFetchVcode',
    method: 'GET',
    data
  })
}

//获取用户信息，后端会自动处理身份
export function getUserInfo(data) {
  return http({
    url: 'CastList/caseUser/list',
    method: 'POST',
    data
  })
}

//获取sessionKey
export function getSessionKey(data) {
  return http({
    url: 'iclaim/login/getSessionKey2',
    method: 'GET',
    params: data
  })
}

//更新用户信息
export function updateUserInfo(data) {
  return http({
    url: 'CastList/caseUser/addOrUpdate',
    method: 'PUT',
    data
  })
}

export function selectIdentity(data) {
  return http({
    url: 'lpgsUser/selectUserIdentity',
    method: 'POST',
    data
  })
}
