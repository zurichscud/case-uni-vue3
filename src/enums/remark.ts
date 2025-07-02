export const REMARK={
  BaoMin: '5',
  SheYuan:'6',
  DaDuiZhang:'7',
  LiShi:'8',
}

export const getRemarkText = (remark:string) => {
  switch(remark){
    case REMARK.BaoMin:
      return '顾问'
      break;
    case REMARK.SheYuan:
      return '社员'
      break;
    case REMARK.DaDuiZhang:
      return '大队长'
      break;
    case REMARK.LiShi:
      return '理事'
      break;
    default:
      return '未知身份'
  }

}
