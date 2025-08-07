import * as TeamAPI from '@/apis/team'
import { base64ToPath } from '@/utils/image'

export function useQRcode() {
  const loading = ref(false)
  const QRImg = ref<string>('')
  const saveLoading = ref(false)
  const tempPath = ref<string | null>(null)

  // 下载/保存二维码
  async function handleSave() {
    if (!QRImg.value) {
      uni.showToast({ title: '二维码生成中...' })
      return
    }
    try {
      saveLoading.value = true
      tempPath.value = await base64ToPath(QRImg.value)
      await uni.saveImageToPhotosAlbum({ filePath: tempPath.value })
      uni.showToast({ title: '保存成功' })
    } catch (error) {
      console.log(error)
      uni.showToast({ title: '保存失败', icon: 'none' })
    } finally {
      saveLoading.value = false
    }
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
    tempPath,
    saveLoading,
    handleSave,
    getMyQRcodeData,
  }
}
