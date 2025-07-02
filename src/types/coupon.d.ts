export interface CouponTemplate {
  id: number
  name: string
  description: string
  /** 优惠券状态（0-开启，1-关闭） */
  status: number
  //发放数量, -1 - 则表示不限制
  totalCount: number
  //优惠券门槛
  usePrice: number
  //商品范围类型（1-全部商品，2-指定商品）
  productScope: number
  //商品范围值
  productScopeValues: string[]
  //生效日期类型（1-固定日期，2-领取之后）
  validityType: number
  //固定日期-生效开始时间
  validStartTime: string
  //固定日期-生效结束时间
  validEndTime: string
  //领取日期-开始天数
  fixedStartTerm: string
  //领取日期-结束天数
  fixedEndTerm: string
  //优惠类型：1-代金卷；2-折扣卷
  discountType: string
  //折扣百分比
  discountPercent: number
  //优惠券面值，仅在 discount_type 等于 1 时生效
  discountPrice: number
  //折扣金额上限，仅在 discount_type 等于 2 时生效
  discountLimitPrice: number
  //领取优惠券的数量
  takeCount: number
  //优惠券使用数量
  useCount: number
}
export interface TakeCouponTemplate {
  id: number
  name: string
  status: number
  usePrice: number
  productScope: number
  productScopeValues: number[]
  validStartTime: number
  validEndTime: number
  discountType: number
  discountPercent: number | null
  discountPrice: number
  discountLimitPrice: number
  description: string
  //是否允许领取
  canTake: boolean
}
export interface UserCoupon {
  id: number
  name: string
  status: number
  usePrice: number
  productScope: number
  productScopeValues: string[]
  validStartTime: string
  validEndTime: string
  match: boolean
  discountType: 1 | 2
  discountPercent?: number
  discountPrice: number
  discountLimitPrice: number
  mismatchReason?: string
}
