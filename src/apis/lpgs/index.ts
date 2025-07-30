import http from '@/utils/http'

interface ApplyParams {
  photoUrl: string
  userId: number
  id?: number
  profession: string
  company: string
}

//isShow:0不展示
//isShow:1展示
//status:0待审核
//status:1审核不通过
//status:2审核通过
//checkTime
//获取自己申请成为社员的记录
export function getApplyDataByUserId(data: { userId: number }) {
  return http({
    url: 'lpgsUser/getUpgradeByUserId',
    method: 'GET',
    data,
  })
}


//申请成为社员
export function applyUpgard(data: ApplyParams) {
  return http({
    url: 'lpgsUser/baoMinUpgrade',
    method: 'POST',
    data,
  })
}

//提醒补齐资料
export function remindBaoMin(data: { userId: number }) {
  return http({
    url: 'lpgsUser/remindUser',
    method: 'GET',
    data,
  })
}
