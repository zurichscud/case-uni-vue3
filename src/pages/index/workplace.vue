<script setup lang="ts">
import router from '@/utils/router'
import { useUserStore } from '@/stores'
import { REMARK } from '@/enums/remark'

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
const userStore = useUserStore()
const isLogin = computed(() => userStore.isLogin)
const menus: Menus = {
  case: {
    title: '案件',
    list: [
      {
        icon: '/static/workplace/case.png',
        text: '全部案件',
        url: '/pages/case/list',
      },
    ],
  },
  team: {
    title: '团队',
    list: [
      {
        text: '我的团队',
        icon: '/static/workplace/team.png',
        url: '/pages/team/list',
      },
      {
        text: '邀请记录',
        icon: '/static/workplace/invite.png',
        url: '/pages/invite/list',
      },
      {
        text: '邀请二维码',
        icon: '/static/workplace/qrcode.png',
        url: '/pages/team/qrcode',
      },
    ],
  },
  policy: {
    title: '政策',
    list: [
      {
        text: '社员奖励政策',
        icon: '/static/workplace/file.png',
        url: '/pages/policy/sheyuan',
      },
      {
        text: '分社社长政策',
        icon: '/static/workplace/file.png',
        url: '/pages/policy/fengshe',
      },
      {
        text: '联社社长政策',
        icon: '/static/workplace/file.png',
        url: '/pages/policy/fengshe',
      },
      {
        text: '晋升办法',
        icon: '/static/workplace/up.png',
        url: '/pages/policy/upgrade',
      },
    ],
  },
  article: {
    title: '文章',
    list: [
      {
        text: '赔案快报',
        icon: '/static/workplace/news.png',
        url: '/pages/public/webview?url=https://mp.weixin.qq.com/s/PMXUwjwkiwRKID-DA9eEIQ&title=赔案快报',
      },
    ],
  },
}

function handleItemClick(url: string, text: string) {
  if (text === '邀请二维码' && userStore.remark === REMARK.BaoMin) {
    uni.showToast({
      title: '请先成为社员',
      icon: 'none',
    })
    return
  }
  router.push(url)
}
</script>

<template>
  <view>
    <NoLogin text="登录后可查看您的工作室" v-if="!isLogin" />
    <view v-else v-for="menu in menus" :key="menu.title">
      <!-- 标题 -->
      <view class="section-title">
        {{ menu.title }}
      </view>
      <!-- 菜单 -->
      <wd-grid clickable :column="4">
        <wd-grid-item
          v-for="item in menu.list"
          :key="item.text"
          :text="item.text"
          use-icon-slot
          @itemclick="handleItemClick(item.url,item.text)"
        >
          <template #icon>
            <image :src="item.icon" style="width: 50rpx; height: 50rpx" mode="scaleToFill" />
          </template>
        </wd-grid-item>
      </wd-grid>
    </view>
  </view>
</template>

<style scoped lang="scss">
.container {
  overflow: hidden; /* 解决margin collapse问题 */
}

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
  font-family: '钉钉进步体 Regular';
  left: 30rpx;
  bottom: -8rpx;
  width: 40rpx;
  height: 4rpx;
  background: linear-gradient(90deg, #4a90e2 0%, #7ed321 100%);
  border-radius: 2rpx;
}
</style>

<route lang="json">
{
  "name": "workplace",
  "layout": "tabbar",
  "style": {
    "navigationBarTitleText": "工作室"
  }
}
</route>
