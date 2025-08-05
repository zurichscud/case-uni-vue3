import http from '@/utils/http'

export function getTeamList() {
  return http({
    url: 'claims-business/app/case/myTeam',
    method: 'GET',
  })
}


export function getMyQrcode() {
  return http({
    url: 'app/poster/qrcode',
    method: 'GET',
  })
}
