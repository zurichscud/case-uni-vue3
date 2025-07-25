import http from '@/utils/http'

//isShow:0不展示
//isShow:1展示
//获取自己申请成为社员的记录
export function getApplyDataByUserId(data: { userId: string }) {
  return http({
    url: 'lpgsUser/getUpgradeByUserId',
    method: 'GET',
    data,
  })
}


//申请成为社员
export function applyUpgard(data: { photoUrl: string, userId: string, id: string }) {
  return http({
    url: 'lpgsUser/baoMinUpgrade',
    method: 'POST',
    data,
  })
}
