import http from '@/utils/http'
import { appendQueryParams } from '@/utils/url'
interface PageParam {
  isAsc: string
  orderByColumn: string
  pageSize: number
  pageNum: number
}

export function getArticleList(param: PageParam, data: any) {
  return http({
    url: appendQueryParams('iclaim/lpgsArticle/list', param),
    method: 'POST',
    data,
  })
}

export function getArticle(data: { articleId: string }) {
  return http({
    url: 'iclaim/lpgsArticle/getArticle',
    method: 'GET',
    data,
  })
}
