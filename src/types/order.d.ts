export type OrderList = {
  orderAmount: number // 订单金额
  orderStatus: number // 订单状态
  quantity: number // 数量
  shopName: string // 店铺名称
  voucherCode: string // 优惠券码
  voucherStatus: number // 优惠券核销状态
  products: Product[] // 商品数组
}

type Product = {
  productName: string // 商品名称
  productImg: string // 商品图片链接
}
