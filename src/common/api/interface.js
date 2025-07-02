import store from "@/store/index.js";

export default {
  // 配置初始化
  config: {
    baseUrl: import.meta.env.VITE_BASE_URL,
    header: {
      "Content-Type": "application/json;charset=UTF-8",
    },
  },
  //拦截器初始化
  interceptor: {
    request(config) {
      // const user = store.state.user
      // console.log('[ token ]-20', user.token)
      const user = uni.getStorageSync("user");
      config.header.Authorization = `Bearer ${user?.token}`
    },
    response(res) {
      uni.hideLoading({
        noConflict: true,
      });
      switch (res.statusCode) {
        case 200:
          if (res.code && res.code != 0) {
            if (res.message != "未签名" || res.message != "已签名") {
              uni.showToast({
                title: res.data.message,
                icon: "none",
                duration: 2000,
              });
            }
          }
          return res.data;
          break;
        case 400:
          uni.showToast({
            title: "抱歉，网络开小差啦~",
            icon: "none",
            duration: 2000,
          });
          break;
        case 401:
          uni.showToast({
            title: "未授权，请重新登录",
            icon: "none",
            duration: 2000,
          });
          break;
        case 403:
          uni.showToast({
            title: "拒绝访问",
            icon: "none",
            duration: 2000,
          });
          break;
        case 404:
          uni.showToast({
            title: "拒绝访问",
            icon: "none",
            duration: 2000,
          });
          break;
        case 405:
          uni.showToast({
            title: "拒绝访问",
            icon: "none",
            duration: 2000,
          });
          break;
        case 408:
          uni.showToast({
            title: "拒绝访问",
            icon: "none",
            duration: 2000,
          });
          break;
        case 500:
          uni.showToast({
            title: "抱歉，网络开小差啦~",
            icon: "none",
            duration: 2000,
          });
          break;
        case 501:
          uni.showToast({
            title: "抱歉，网络开小差啦~",
            icon: "none",
            duration: 2000,
          });
          break;
        case 502:
          uni.showToast({
            title: "抱歉，网络开小差啦~",
            icon: "none",
            duration: 2000,
          });
          break;
        case 503:
          uni.showToast({
            title: "抱歉，网络开小差啦~",
            icon: "none",
            duration: 2000,
          });
          break;
        case 504:
          uni.showToast({
            title: "网络超时，请稍后重试",
            icon: "none",
            duration: 2000,
          });
          break;
        case 505:
          uni.showToast({
            title: "http版本不支持该请求",
            icon: "none",
            duration: 2000,
          });
          break;
        default: //跳转程序员错误也并重试
          uni.showToast({
            title: "抱歉，网络开小差啦~",
            icon: "none",
            duration: 2000,
          });
          break;
      }
    },
  },
  /**
   * uni.request请求配置封装，把回调封装成promise 7个平台都支持的只有get和post1
   */
  async apiRequest(method, url, data) {
    // 调用请求拦截器
    const config = {
      method: method,
      url: this.config.baseUrl + url,
      data,
      header: this.config.header,
    };
    this.interceptor.request(config);

    let [error, res] = await uni.request(config);
    let res1 = this.interceptor.response(res);
    // reslog(url, data, res1)
    return res1;
  },
  get(url, data) {
    return this.apiRequest("get", url, data);
  },
  //发送数据
  post(url, data) {
    return this.apiRequest("POST", url, data);
  },
  //发送数据
  put(url, data) {
    return this.apiRequest("put", url, data);
  },
  del(url, data) {
    return this.apiRequest("DELETE", url, data);
  },
};
