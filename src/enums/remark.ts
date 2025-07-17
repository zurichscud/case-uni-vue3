export const REMARK = {
  BaoMin: '5',
  SheYuan: '6',
  FenSheZhang: '7',
  LianSheZhang: '8',
}

export function getRemarkText(remark: string) {
  switch (remark) {
    case REMARK.BaoMin:
      return '保民'
      break;
    case REMARK.SheYuan:
      return '社员'
      break;
    case REMARK.FenSheZhang:
      return '分社社长'
      break;
    case REMARK.LianSheZhang:
      return '联社社长'
      break;
    default:
      return '未知身份'
  }

}
