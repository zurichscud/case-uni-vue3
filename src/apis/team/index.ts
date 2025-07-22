import http from '@/utils/http'

export function getTeamList() {
  return http({
    url: 'claims-business/app/case/myTeam',
    method: 'GET',
  })
}
