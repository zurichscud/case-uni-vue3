/**
 * 公共变量及方法库1
 */
import http from './api/interface'
const doWxStorage = function (type, key, data) {
  //设置或获取微信缓存
  try {
    if (type.includes('get')) {
      var value = uni.getStorageSync(key)
      if (value) {
        return value
      }
    } else {
      wx.setStorageSync(key, data)
    }
  } catch (e) {
    wx.showToast({
      title: '当前微信版本过低，请升级后再使用',
      icon: 'none'
    })
  }
}
//上传图片 返回一个数组
const uploadFiles = async function (filePaths, doSuccess) {
  const that = this
  // setTimeout(() => {
  //   // 设置setTimeout解决uni.showLoading自动关闭的现象
  //   uni.showLoading({
  //     title: '上传中',
  //     mask: true,
  //   })
  // })
  let httpsfilePaths = [] //处理后的数组
  for (const item of filePaths) {
    console.log('类型', filePaths, item)
    const res = await vue.$uniAsync.uploadFile({
      url: `${http.config.baseUrl}iclaim/user/photoUpload2`,
      header: {
        Authorization: `Bearer ${uni.getStorageSync('user')?.token}`
      },
      // file:item,//filePaths[0]|| filePaths,
      name: 'photo',
      filePath: item
    })
    console.log('uni异步化', res)
    let result = JSON.parse(res.data)
    if (result.code == 200) {
      httpsfilePaths.push(result.data)
    } else {
      uni.showToast({
        title: result.msg,
        icon: 'none'
      })
    }
  }
  if (typeof doSuccess == 'function') {
    // showToast自带关闭loading功能
    uni.showToast({
      title: '上传成功',
      icon: 'none'
    })
    doSuccess(httpsfilePaths)
  }
}
//选择并上传图片
const chooseUploadImage = function (count, doSuccess) {
  const that = this
  console.log('count', count)
  uni.chooseImage({
    sizeType: ['compressed'],
    success: async function (res) {
      const len = res.tempFilePaths.length
      let imgcompressList = []
      // 判断选中张数是否超出张数 默认count是3
      if (len > count) {
        uni.showToast({
          title: `图片上传不能超过${count}张`,
          icon: 'none'
        })
        return
      }
      wx.compressImage({
        src: res.tempFiles[0].path, // 图片路径
        quality: 80, // 压缩质量
        success(res) {
          imgcompressList.push(res.tempFilePath)
          uploadFiles(imgcompressList, function (res) {
            if (typeof doSuccess == 'function') {
              doSuccess(res)
            }
          })
        },
        fail() {
          console.log('图片压缩失败')
        }
      })
    }
  })
}
/**预览当前图片
 * @param {Object} index 当前图片的下表
 * @param {Object} imgList 预览图片列表
 */
const previewImage = function (index, imgList) {
  wx.previewImage({
    current: `${imgList[index]}`, // 当前显示图片的http链接
    urls: imgList // 需要预览的图片http链接列表
  })
}
// 按照对象的某一属性排序
const setObSort = function (property) {
  return function (a, b) {
    let val1 = a[property]
    let val2 = b[property]
    return val1 - val2
  }
}
const onShare = function (data, path) {
  return {
    title: data.title,
    path,
    imageUrl: data.imageUrl
  }
}
/**连接环信 开启监听
 *
 */
const onHxChat = async function (_this, myHxname, myHxpwd) {
  /**
	 * 2022.7.22去除环信

  let that = _this
  // console.log('登录环信连接名', myHxname)
  // console.log('登录环信密码', myHxpwd)
  // console.log('登录环信连接名apiURL-->Rest服务器地址', that.$im.config.apiURL)
  that.$conn.open({
    //根据用户名/密码/昵称登录环信 Web IM
    apiUrl: that.$im.config.apiURL,
    user: myHxname, //'vlily',
    pwd: myHxpwd,
    grant_type: 'password',
    appKey: that.$im.config.appkey,
  })
  //每次登陆都要连接环信->每次连接环信的时候 roomList都要更新
  getRoomList(that)
  uni.setStorageSync('myUsername', myHxname)
  */
}

/**剩余日期格式化:2019-12-26 02:28:52到2019-12-30 02:28:52时间差 返回整数（大于24小时=》整天，大于60分=》小时，其余是分钟）
 * endDate 结束日期
 */
const endDateFormat = function (endDate) {
  let endDateTime = new Date(endDate).getTime() //毫秒
  let todayTime = new Date().getTime()
  let diff = endDateTime - todayTime
  // 单位
  var minutes = 1000 * 60
  var hours = minutes * 60
  var days = hours * 24
  var years = days * 365
  let endTimes = diff / days //单位天
  console.log('剩余多少天', endTimes)
  if (endTimes >= 1) {
    //>=1天
    return parseInt(endTimes) + '天'
  } else if (endTimes < 1) {
    endTimes = diff / hours //单位小时
    if (endTimes >= 1) {
      //>=1小时
      return parseInt(endTimes) + '小时'
    } else if (endTimes < 1) {
      endTimes = diff / minutes //单位分钟
      if (endTimes >= 0) {
        //>=1分钟
        return parseInt(endTimes) + '小时'
      } else {
        return -1
      }
    }
  }
}
const getDateDiff = function (time) {
  // 当前时间
  let nowTime = new Date()
  let year = nowTime.getFullYear()
  let month = nowTime.getMonth() + 1
  let day = nowTime.getDate()
  let hours = parseInt(nowTime.getHours())
  let minutes = nowTime.getMinutes()
  // 传来time 2018-05-25 18:14:02 分解
  let timeyear = time.substring(0, 4)
  let timemonth = time.substring(5, 7)
  let timeday = time.substring(8, 10)
  let timehours = parseInt(time.substring(11, 13))
  let timeminutes = time.substring(14, 16)
  let timesecond = time.substring(17, 19)
  let d_year = year - timeyear
  let d_month = Math.abs(month - timemonth)
  let d_day = Math.abs(day - timeday)
  let d_hours = Math.abs(hours - timehours)
  let d_minutes = Math.abs(minutes - timeminutes)
  if (d_month > 1) {
    return d_month + '月前'
  }
  if (d_day > 1) {
    return d_day + '天前'
  } else if (d_day == 0 && d_hours > 0 && d_hours <= 24) {
    return d_hours + '小时前'
  } else if (d_day == 1) {
    if (d_hours > 0 && d_hours <= 24) {
      return hours + (24 - timehours) + '小时前'
    } else {
      console.log(d_hours, timehours)
      return '23小时前'
    }
  } else if (d_minutes > 0 && d_minutes <= 60) {
    return d_minutes + '分钟前'
  } else {
    return '1分钟前'
  }
}
const friendlyDate = function (timestamp) {
  var formats = {
    year: '%n% 年前',
    month: '%n% 月前',
    day: '%n% 天前',
    hour: '%n% 小时前',
    minute: '%n% 分钟前',
    second: '%n% 秒前'
  }

  var now = Date.now()
  var seconds = Math.floor((now - timestamp) / 1000)
  var minutes = Math.floor(seconds / 60)
  var hours = Math.floor(minutes / 60)
  var days = Math.floor(hours / 24)
  var months = Math.floor(days / 30)
  var years = Math.floor(months / 12)

  var diffType = ''
  var diffValue = 0
  if (years > 0) {
    diffType = 'year'
    diffValue = years
  } else {
    if (months > 0) {
      diffType = 'month'
      diffValue = months
    } else {
      if (days > 0) {
        diffType = 'day'
        diffValue = days
      } else {
        if (hours > 0) {
          diffType = 'hour'
          diffValue = hours
        } else {
          if (minutes > 0) {
            diffType = 'minute'
            diffValue = minutes
          } else {
            diffType = 'second'
            diffValue = seconds === 0 ? (seconds = 1) : seconds
          }
        }
      }
    }
  }
  return formats[diffType].replace('%n%', diffValue)
}
//去除表情包
const delEmoti = function (target) {
  let regStr =
    /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/gi
  let result = target.replace(regStr, '')
  return result
}
const onShareApp = function (
  provider,
  scene,
  type,
  href,
  title,
  summary,
  imageUrl,
  miniProgram,
  fn
) {
  uni.share({
    provider: provider || 'weixin', //: "weixin"
    scene: scene || 'WXSceneSession', //WXSceneSession
    type: type || 0,
    href: href || 'https://y9net.cn/',
    title: title || '弈陪',
    summary: summary || '我正在使用HBuilderX开发uni-app，赶紧跟我一起来体验！', //"我正在使用HBuilderX开发uni-app，赶紧跟我一起来体验！"
    imageUrl: imageUrl || 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/uni@2x.png', ///: "https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/uni@2x.png",
    miniProgram: miniProgram || {},
    success: function (res) {
      console.log('success:' + JSON.stringify(res))
      console.log(typeof fn)
      if (typeof fn == 'function') {
        fn(res)
      }
    },
    fail: function (err) {
      console.log('fail:' + JSON.stringify(err))
    }
  })
}
const myshare = function (title, desc, imgUrl, fn) {
  let Url = window.location
  let link = Url.protocol + '//' + Url.host + Url.pathname + Url.hash
  uni.request({
    url: http.config.baseUrl + '/icq/wechat/sgture',
    method: 'GET',
    data: {
      url: link
    },
    success(res) {
      let result = res.data
      // let param=window.location.href.split("#")[1];
      // console.log('param:'+param)
      // link=url+'/?#'+param
      // console.log(link)
      wxj.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: result.appid, // 必填，公众号的唯一标识
        timestamp: result.timestamp, // 必填，生成签名的时间戳
        nonceStr: result.noncestr, // 必填，生成签名的随机串
        signature: result.sgture, // 必填，签名
        jsApiList: [
          'updateAppMessageShareData',
          'updateTimelineShareData',
          'onMenuShareTimeline',
          'onMenuShareAppMessage'
        ] // 必填，需要使用的JS接口列表
        /* 即将废弃	jsApiList: ["onMenuShareAppMessage","onMenuShareTimeline"] // 必填，需要使用的JS接口列表 */
      })
      wxj.ready(function () {
        //需在用钮前就先调用
        // 1.4+ new API
        wxj.updateAppMessageShareData({
          title, // 分享标题
          desc, // 分享描述
          link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl, // 分享图标
          success: function (res) {
            fn()
            console.log('分享成功', res)
          },
          fail: function (err) {
            console.log('分享失败', err)
            //alert("分享失败")
          },
          cancel: function () {
            // 用户取消分享后执行的回调函数
            console.log('我取消了')
          }
        })
        wxj.updateTimelineShareData({
          title, // 分享标题
          link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl, // 分享图标
          success: function (res) {
            console.log(res)
            console.log('分享成功')
            // 设置成功
            fn()
          },
          fail: function (res) {
            console.log('分享失败', res)
          },
          cancel: function () {
            // 用户取消分享后执行的回调函数
          }
        })
        // old API
        wxj.onMenuShareTimeline({
          title, // 分享标题
          link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl, // 分享图标
          success: function (res) {
            // console.log('old',res)
            console.log('分享成功old', res)
            // 设置成功
            fn()
          },
          fail: function (res) {
            console.log('分享失败old', res)
          },
          cancel: function () {
            // 用户取消分享后执行的回调函数
          }
        })
        wxj.onMenuShareAppMessage({
          title, // 分享标题
          desc, // 分享描述
          link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl, // 分享图标
          type: '', // 分享类型,music、video或link，不填默认为link
          dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
          success: function (res) {
            console.log('分享成功old', res)
            // 设置成功
            fn()
          },
          fail: function (res) {
            console.log('分享失败old', res)
          },
          cancel: function () {
            // 用户取消分享后执行的回调函数
          }
        })
      })
    },
    complete(res) {
      // console.log(res)
    }
  })
}

const getImageInfo = function (path) {
  return new Promise(function (resolve, reject) {
    // #ifdef APP-PLUS
    plus.io.getImageInfo({
      src: path,
      success: function (image) {
        // console.log(image.width);
        // console.log(image.height);
        // console.log('orientation=' + image.orientation);
        // console.log('path=' + image.path);
        resolve(image)
      },
      fail: function (err) {
        console.log('getImageInfoErr: ' + JSON.stringify(err))
        reject(err)
      }
    })
    // #endif
    // #ifdef H5 || MP-WEIXIN
    uni.getImageInfo({
      src: path,
      success: function (image) {
        // console.log(image.width);
        // console.log(image.height);
        // console.log('orientation=' + image.orientation);
        // console.log('path=' + image.path);
        resolve(image)
      },
      fail: function (err) {
        console.log('getImageInfoErr: ' + JSON.stringify(err))
        reject(err)
      }
    })
    // #endif
  })
}
const getyyyyMMdd = function () {
  var d = new Date()
  var curr_date = d.getDate()
  var curr_month = d.getMonth() + 1
  var curr_year = d.getFullYear()
  String(curr_month).length < 2 ? (curr_month = '0' + curr_month) : curr_month
  String(curr_date).length < 2 ? (curr_date = '0' + curr_date) : curr_date
  var yyyyMMdd = curr_year + '-' + curr_month + '-' + curr_date
  return yyyyMMdd
}
const uploadFilesAll = function (filePaths, doSuccess) {
  const that = this
  console.log('待上传路径filePaths:', filePaths)
  setTimeout(() => {
    uni.showLoading({
      title: '上传中'
    })
  }, 100)
  let errCount = 0 //失败数量
  let uploadsPromise = []
  let httpsfilePaths = [] //处理后的数组
  let filePathsList = [] //需上传的图片
  //批量上传文件
  for (var i = 0; i < filePaths.length; i++) {
    uploadsPromise[i] = new Promise((resolve, reject) => {
      uni.uploadFile({
        url: `${http.config.baseUrl}iclaim/user/upload/file`,
        filePath: filePaths[i],
        name: 'file',
        success: function (res) {
          let result = JSON.parse(res.data)
          console.log('上传成功', result)
          if (result.code == 0) {
            httpsfilePaths.push(JSON.parse(res.data).datas)
            resolve(res)
          } else {
            uni.showToast({
              title: result.message,
              icon: 'none'
            })
          }
        },
        fail: function (res) {
          errCount++
          console.log('服务器繁忙', res)
        }
      })
    })
  }
  Promise.all(uploadsPromise)
    .then((result) => {
      uni.showToast({
        title: '上传成功',
        icon: 'none'
      })
      if (typeof doSuccess == 'function') {
        doSuccess(httpsfilePaths)
      }
    })
    .catch((reason) => {
      uni.showToast({
        title: `上传失败${errCount}张，请稍后重新上传`,
        icon: 'none'
      })
    })
}
module.exports = {
  uploadFilesAll,
  doWxStorage,
  uploadFiles,
  chooseUploadImage,
  previewImage,
  setObSort,
  onShare,
  onHxChat,
  endDateFormat,
  getDateDiff,
  delEmoti,
  onShareApp,
  getyyyyMMdd
}
