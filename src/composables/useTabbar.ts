/*
 * @Author: weisheng
 * @Date: 2024-10-29 22:12:54
 * @LastEditTime: 2025-06-25 13:33:39
 * @LastEditors: weisheng
 * @Description:
 * @FilePath: /wot-demo/src/composables/useTabbar.ts
 * 记得注释
 */

/**
 * 标签栏项目接口定义
 */
export interface TabbarItem {
  /** 标签名称 */
  name: string
  /** 标签值（可选数字） */
  value: number | null
  /** 是否激活状态 */
  active: boolean
  /** 标签显示标题 */
  title: string
  /** 标签图标 */
  icon: string
  /** 激活状态下的图标 */
  activeIcon: string
}

/**
 * 标签栏数据项列表
 */
const tabbarItems = ref<TabbarItem[]>([
  { name: 'index', value: null, active: true, title: '首页', icon: 'icon-shouye', activeIcon: 'icon-shouye' },
  { name: 'workplace', value: null, active: false, title: '工作室', icon: 'icon-hezuo', activeIcon: 'icon-hezuo' },
  { name: 'message', value: null, active: false, title: '消息', icon: 'icon-xiaoxi1', activeIcon: 'icon-xiaoxi1' },
  { name: 'user', value: null, active: false, title: '我的', icon: 'icon-wode', activeIcon: 'icon-wode' },
])

/**
 * 标签栏管理组合式函数
 * @returns 返回标签栏相关的响应式数据和操作方法
 */
export function useTabbar() {
  /**
   * 获取标签栏列表
   * @returns 标签栏项目列表的计算属性
   */
  const tabbarList = computed(() => tabbarItems.value)

  /**
   * 获取当前激活的标签栏项目
   * @returns 当前激活的标签栏项目，如果没有找到则返回第一个项目
   */
  const activeTabbar = computed(() => {
    const item = tabbarItems.value.find(item => item.active)
    return item || tabbarItems.value[0]
  })

  /**
   * 根据标签名称获取标签的值
   * @param name 标签名称
   * @returns 标签的值，如果不存在或值为空则返回 null
   */
  const getTabbarItemValue = (name: string) => {
    const item = tabbarItems.value.find(item => item.name === name)
    return item && item.value ? item.value : null
  }

  /**
   * 设置指定标签的值
   * @param name 标签名称
   * @param value 要设置的数值
   */
  const setTabbarItem = (name: string, value: number) => {
    const tabbarItem = tabbarItems.value.find(item => item.name === name)
    if (tabbarItem) {
      tabbarItem.value = value
    }
  }

  /**
   * 设置指定标签为激活状态，其他标签设为非激活状态
   * @param name 要激活的标签名称
   */
  const setTabbarItemActive = (name: string) => {
    tabbarItems.value.forEach((item) => {
      if (item.name === name) {
        item.active = true
      }
      else {
        item.active = false
      }
    })
  }

  return {
    tabbarList,
    activeTabbar,
    getTabbarItemValue,
    setTabbarItem,
    setTabbarItemActive,
  }
}
