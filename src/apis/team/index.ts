import http from '@/utils/http'

//获取我的团队列表
export function getTeamList() {
  return http({
    url: 'claims-business/app/case/myTeam',
    method: 'GET',
  })
}

//获取我的二维码
export function getMyQrcode() {
  return http({
    url: 'app/poster/qrcode',
    method: 'GET',
  })
}

//获取团队信息
export function getTeamInfo(params: { userId: number }) {
  return http({
    url: 'iclaim/login/getMyTeamName',
    method: 'GET',
    params,
  })
}

//修改团队名称
export function updateTeamName(params: { teamName: string; userId: number }) {
  return http({
    url: 'lpgsUser/updateTeamName',
    method: 'PUT',
    params,
  })
}
