export type Retail = {
  shopId: string
  orderAmount: number
  quantity: number
  memberId: string
  discountAmount: Big
  retailOrderProducts: RetailOrderProduct[]
}
export type RetailOrderProduct = {
  productId: string
  //商品名
  name: string
  //单价（不发送后端,后续需要应该需要添加）
  retailPrice?: Big
  discountAmount: Big
  //购买数量
  boughtNum: number
  //小计
  price: number
}
