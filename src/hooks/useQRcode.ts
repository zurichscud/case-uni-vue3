import * as TeamAPI from '@/apis/team'
import { base64ToPath } from '@/utils/image'

export function useQRcode() {
  const loading = ref(false)
  const QRURL = ref<string>('')
  const saveLoading = ref(false)

  // 下载/保存二维码
  async function handleSave() {
    if (!QRURL.value) {
      uni.showToast({ title: '二维码生成中...' })
      return
    }
    try {
      saveLoading.value = true
      const { tempFilePath } = await uni.downloadFile({ url: QRURL.value })
      await uni.saveImageToPhotosAlbum({ filePath: tempFilePath })
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
    QRURL.value = data.qrcode
    loading.value = false
  }

  return {
    loading,
    QRURL,
    saveLoading,
    handleSave,
    getMyQRcodeData,
  }
}
