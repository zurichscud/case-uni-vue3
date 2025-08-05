import http from '@/utils/http'

export function getNewsList() {
  return http({
    url: '/newsFlash/getNewsFlashs',
    method: 'GET',
  })
}
