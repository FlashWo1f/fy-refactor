import axios from 'axios'
import store from '@/store'
import storage from 'store'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
import { messages } from '@/utils/resetMessage'
import { ACCESS_TOKEN, ACCESS_TYPE, ADMIN_ACCESS_ACTIVITYID } from '@/store/mutation-types'

const env = import.meta.env

let source = getCancelToken()

function getCancelToken() {
  return axios.CancelToken.source()
}

const request = axios.create({
  baseURL: env.VITE_APP_BASE_API,
  timeout: 6000 // 请求超时时间
})

// 异常拦截处理器
const errorHandler = error => {
  if (error.response) {
    const data = error.response.data
    // 从 localstorage 获取 token
    const token = storage.get(ACCESS_TOKEN)
    if (error.response.status === 403) {
      notification.error({
        message: 'Forbidden',
        description: data.message
      })
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      notification.error({
        message: 'Unauthorized',
        description: 'Authorization verification failed'
      })
      if (token) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        })
      }
    }
  }
  return Promise.reject(error)
}

// request interceptor
request.interceptors.request.use(config => {
  log('HHHh', config)
  const url = config.url;
  // config.url = `/api${url}`;
  // config.url = `http://111.231.87.127:18081${url}`
  const info = JSON.parse(localStorage.getItem("hr-system")) || {};
  const isLogin = url === "/hr/user/login";
  if (!isLogin) {
    config.headers["x-access-token"] = info.token;
    config.headers["x-user-id"] = info.userId;
    config.headers["x-user-type"] = info.userType;
  }
  return config;
}, errorHandler)

// response interceptor
request.interceptors.response.use(response => {
  const { success, error, code } = response.data
  if (response.data instanceof Blob) {
    if (response.data.size > 200) {
      return Promise.resolve(response.data)
    } else {
      const reader = new FileReader()
      reader.onload = e => {
        const json = JSON.parse(e.target.result)
        !json.success && messages('error', json.error || '导出失败')
      }
      reader.readAsText(response.data)
      return Promise.reject()
    }
  }
  if (!success) {
    if (code === '-20099') {
      messages.error(response.data.error || '系统开小差啦~')
      return Promise.reject(response)
    }
    if (code === '-20001' || code === '-20002') {
      // source.cancel(response.data.error || '用户token错误或过期')
      store.dispatch('Logout').then(() => {
        // setTimeout(() => {
        //   // source = getCancelToken()
        // }, 1500);
      })
    }
    messages.error(error || '系统异常，请联系管理员')
    return Promise.reject(response)
  }
  return response.data
}, errorHandler)

const installer = {
  vm: {},
  install(Vue) {
    Vue.use(VueAxios, request)
  }
}

const post = (url, data = {}) => {
  return request({
    method: 'post',
    url,
    data: {
      ...data
    },
    responseType: data && data.responseType ? 'blob' : '',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    }
  })
}

const get = (url, params = {}) => {
  return request({
    method: 'get',
    url,
    headers: {},
    responseType: params && params.responseType ? 'blob' : '',
    params
  })
}

export default request

export { installer as VueAxios, request as axios, post, get }
