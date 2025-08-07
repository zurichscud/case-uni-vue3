<script setup>
import { useUserStore } from '@/stores'
import * as InviteAPI from '@/apis/invite'
import * as TeamAPI from '@/apis/team'
import router from '@/utils/router'

const userStore = useUserStore()
const isLogin = computed(() => userStore.isLogin)
const pid = ref(null)
const teamInfo = ref({
  teamName: '未知团队',
  userName: '未知名称',
})

function getPidByScene(scene) {
  // scene 格式: "pid=xxxx"
  if (!scene) {
    return null
  }
  try {
    // 解析 scene 参数，提取 pid
    const params = scene.split('&').reduce((acc, param) => {
      const [key, value] = param.split('=')
      if (key && value) {
        acc[key] = value
      }
      return acc
    }, {})

    const pid = params.pid
    console.log('[ getPidByScene ] pid:', pid)

    if (pid) {
      return pid
    } else {
      console.warn('[ getPidByScene ] 未找到有效的 pid')
      return null
    }
  } catch (error) {
    console.error('[ getPidByScene ] 解析 scene 失败:', error)
    return null
  }
}

async function getTeamInfoData() {
  const {data} = await TeamAPI.getTeamInfo({ userId: pid.value })
  teamInfo.value = data
}

function handleContinue() {
  if (!pid.value) {
    uni.showToast({
      title: '您没有可以加入的团队',
      icon: 'none',
    })
    return
  }
  if (!isLogin.value) {
    uni.showModal({
      title: '提示',
      content: '您需要先登录才能加入他的团队',
      success: ({ confirm }) => {
        if (confirm) {
          router.push('/pages/login/login', { redirect: `/pages/invite/inviteYou` })
        }
      },
    })
    return
  }
  uni.showModal({
    title: '提示',
    content: `确定加入${teamInfo.value.userName}的团队吗？`,
    success: async ({ confirm }) => {
      if (confirm) {
        await InviteAPI.addGroup({ pid: pid.value })
        uni.removeStorageSync('pid')
        uni.showToast({
          title: '加入成功',
          icon: 'success',
          success: () => {
            setTimeout(() => {
              router.redirect('/pages/index/index')
            }, 1000)
          },
        })
      }
    },
  })
}
onLoad((query) => {
  console.log('[ query ]-10', query) // pid%3Dxxxx
  // 如果存在scene，说明是扫码的
  if (query.scene) {
    const decodeScene = decodeURIComponent(query.scene) // pid=xxxx
    pid.value = getPidByScene(decodeScene)
    uni.setStorageSync('pid', pid.value)
  } else if (query.pid) {
    pid.value = query.pid
    uni.setStorageSync('pid', pid.value)
  } else {
    pid.value = uni.getStorageSync('pid')
  }
  if (pid.value) {
    getTeamInfoData()
  }
})
</script>

<template>
  <view class="w-full h-screen bg-white flex flex-col overflow-hidden">
    <!-- 主体内容 -->
    <view class="flex-1 flex flex-col pb-16 relative">
      <!-- 插画区域 -->
      <view class="flex-1 flex justify-center items-center px-13 pt-10 pb-5">
        <image class="w-68" src="/static/team.png" mode="aspectFit" />
      </view>

      <!-- 文案区域 -->
      <view class="px-13 pb-10">
        <view class="mb-8">
          <text
            class="block w-68 font-['Poppins'] font-bold text-6 leading-9 text-center gradient-text"
          >
            {{ teamInfo.userName }}
          </text>
          <text
            class="block w-68 font-['Poppins'] font-bold text-6 leading-9 text-center gradient-text"
          >
            邀请您加入他的团队
          </text>
        </view>

        <view>
          <!-- <text class="block w-71 font-['Poppins'] font-normal text-4 leading-5.5 text-center text-[#333333]">
            提示文字
          </text> -->
        </view>
      </view>

      <!-- 继续按钮 -->
      <view class="flex justify-center px-23">
        <view
          class="w-48 h-11 bg-gradient-to-br from-[#FD749B] to-[#281AC8] rounded shadow-lg flex justify-center items-center"
          @click="handleContinue"
        >
          <text class="font-['Poppins'] font-bold text-4 leading-6 text-[#FFFBF7] tracking-wide">
            加入他的团队
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
/* 渐变文字效果 */
.gradient-text {
  background: linear-gradient(135deg, #fd749b 0%, #281ac8 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;

  /* 降级处理 */
  @supports not (background-clip: text) {
    color: #281ac8;
  }
}
</style>

<route lang="json">
{
  "name": "inviteYou",
  "layout": "default",
  "auth": true,
  "style": {
    "navigationBarTitleText": "邀请加入"
  }
}
</route>
