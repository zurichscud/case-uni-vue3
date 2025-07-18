import http from '@/utils/http'

export interface InviteListByIdParams {
  userId: number
  pageNum: number
  pageSize: number
}

//获取邀请列表
export function getInviteListById(data: InviteListByIdParams) {
  return http({
    url: 'lpgsUser/myUsersByUserId',
    method: 'GET',
    data,
  })
}

//获取升级信息
export function getUpgardMSg(){
  return http({
    url: 'lpgsUser/getMyUsersNum',
    method: 'GET',
  })
}
