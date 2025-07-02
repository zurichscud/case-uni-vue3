/** 菜单DOM位置 */
export type Position = {
  top?: number
  bottom?: number
}
export type Menu = {
  /** 菜单id */
  id: string
  /** 菜单名称 */
  name: string
  /** 菜单图标 */
  icon: string
  /** 菜单商品列表 */
  productList: Goods[]
} & Position

export type Goods = {
  id: string
  /** 商品名称 */
  name: string
  /** 商品价格 */
  retailPrice: number
  /** 商品单位 */
  unit: string
  /** 商品封面图 */
  externalUrl: string
  /** 商品详情图片 */
  imageArr: string[]
  /** 商品描述 */
  content: string
  /** 是否使用SKU属性，不使用将不弹出SKU模态框 */
  use_property: number
  /** 商品规格属性 */
  property?: SKU[]
}
export type SKU = {
  /** 属性名称 */
  name: string
  /** 属性描述 */
  desc: string
  /** 属性值 */
  values: SKUValue[]
}
export type SKUValue = {
  /** 属性值id */
  id: string
  /** 属性值，用于前端展示 */
  value: string
  /** 是否默认 */
  is_default: 0 | 1
  /** 属性值编码 */
  code: string
}
export type CartItem = {
  /** 商品id */
  id: string
  /** 商品名称 */
  name: string
  /** 商品价格 */
  retailPrice: Big
  /** 商品数量 */
  number: number
  /** 商品封面图 */
  externalUrl: string
  /** 是否使用SKU属性，不使用将不弹出SKU模态框 */
  use_property: number
  /** 商品规格 */
  props_text?: string
  /** 商品规格id */
  props?: string[]
  /** 小计 */
  price: Big
}
export type ModalGood = Goods & {
  number: number
  /** 商品规格 */
  props_text?: string
  /** 商品规格id */
  props?: string[]
}
