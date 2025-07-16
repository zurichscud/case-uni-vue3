import http from '@/utils/http'

export interface InviteListByIdParams {
  userId: number
  pageNum: number
  pageSize: number
}

export function getInviteListById(data: InviteListByIdParams) {
  return http({
    url: 'lpgsUser/getMyUsers',
    method: 'GET',
    data,
  })
}
