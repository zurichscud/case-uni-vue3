import * as TeamAPI from '@/apis/team'
import { base64ToPath } from '@/utils/image'

export function useQRcode() {
  const loading = ref(false)
  const QRImg = ref<string>('')
  const saveLoading = ref(false)

  // 下载/保存二维码
  async function handleSave() {
    if (!QRImg.value) {
      uni.showToast({ title: '二维码生成中...' })
      return
    }
    try {
      saveLoading.value = true
      const tempPath = await getTempPath()
      await uni.saveImageToPhotosAlbum({ filePath: tempPath })
      uni.showToast({ title: '保存成功' })
    } catch (error) {
      console.log(error)
      uni.showToast({ title: '保存失败', icon: 'none' })
    } finally {
      saveLoading.value = false
    }
  }

  async function getTempPath() {
    return await base64ToPath(QRImg.value)
  }

  async function getMyQRcodeData() {
    loading.value = true
    const { data } = await TeamAPI.getMyQrcode()
    QRImg.value = data.qrcode
    loading.value = false
  }

  return {
    loading,
    QRImg,
    getTempPath,
    saveLoading,
    handleSave,
    getMyQRcodeData,
  }
}
