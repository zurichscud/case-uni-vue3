/** 通用分页结果类型 */
export type PageResult<T> = {
  list: T[]
  /** 总条数 */
  total: number
  /** 当前页码 */
}
/** 通用分页参数类型 */
export type PageParams = {
  /** 页码：默认值为 1 */
  page?: number
  /** 页大小：默认值为 10 */
  pageSize?: number
}
