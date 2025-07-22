import http from '@/utils/http'
import type { PageParams } from '@/types/global'

interface CaseListParams extends PageParams {
  userId:number
}

export function getCaseList(data: CaseListParams) {
  return http({
    url: 'claims-business/app/case/allCase',
    method: 'GET',
    data,
  })
}

export function getCaseProcess(caseId: string ) {
  return http({
    url: `claims-business/app/case/caseProgress/${caseId}`,
    method: 'GET',
  })
}
