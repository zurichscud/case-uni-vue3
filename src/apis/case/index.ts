import http from '@/utils/http'
import type { PageParams } from '@/types/global'

export function getCaseList(data: PageParams) {
  return http({
    url: 'claims-business/app/case/allCase',
    method: 'GET',
    data,
  })
}
