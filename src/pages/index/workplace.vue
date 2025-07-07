<script setup lang="ts">
import router from '@/utils/router'

// 定义菜单项类型
interface MenuItem {
  icon: string
  text: string
  url: string
}

// 定义菜单分类类型
interface MenuSection {
  title: string
  list: MenuItem[]
}

// 定义整个菜单的类型
interface Menus {
  case: MenuSection
  team: MenuSection
  policy: MenuSection
  article: MenuSection
}

const menus: Menus = {
  case: {
    title: '案件',
    list: [
      {
        icon: 'icon-read',
        text: '全部案件',
        url: '/pages/case/all-case',
      },
    ],
  },
  team: {
    title: '团队',
    list: [
      {
        text: '我的团队',
        icon: 'icon-team',
        url: '/pages/deprecated/myteam',
      },
      {
        text: '邀请记录',
        icon: 'icon-paper',
        url: '/pages/invite/record',
      },
      {
        text: '邀请二维码',
        icon: 'icon-erweima',
        url: '/pages/invite/qrcode',
      },
    ],
  },
  policy: {
    title: '政策',
    list: [
      {
        text: '奖励政策',
        icon: 'icon-purse',
        url: '/pages/policy/file',
      },
      {
        text: '晋升办法',
        icon: 'icon-gift',
        url: '/pages/policy/file',
      },
    ],
  },
  article: {
    title: '文章',
    list: [
      {
        text: '赔案快报',
        icon: 'icon-newspaper',
        url: '/pages/public/webview?url=https://mp.weixin.qq.com/s/PMXUwjwkiwRKID-DA9eEIQ&title=赔案快报',
      },
    ],
  },
}

function handleItemClick(url: string) {
  console.log(url)
  router.go(url)
}
</script>

<template>
  <view v-for="menu in menus" :key="menu.title">
    <!-- 标题 -->
    <view class="section-title">{{ menu.title }}</view>
    <!-- 菜单 -->
    <wd-grid clickable :column="4">
      <wd-grid-item
        v-for="item in menu.list"
        :key="item.text"
        :text="item.text"
        use-icon-slot
        @itemclick="handleItemClick(item.url)"
      >
        <template #icon>
          <i class="iconfont" :class="item.icon"></i>
        </template>
      </wd-grid-item>
    </wd-grid>
  </view>
</template>

<style scoped lang="scss">

.iconfont {
  font-size: 50rpx;
}

.section-title {
  font-size: 36rpx;
  font-weight: bold;
  font-family: '钉钉进步体 Regular';
  color: #333;
  margin: 30rpx 0 20rpx 0;
  padding: 0 30rpx;
  position: relative;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 30rpx;
  bottom: -8rpx;
  width: 40rpx;
  height: 4rpx;
  background: linear-gradient(90deg, #4a90e2 0%, #7ed321 100%);
  border-radius: 2rpx;
}
</style>
