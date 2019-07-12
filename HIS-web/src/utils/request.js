import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// 创建一个axios实例 封装所有api调用
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // 发送请求时携带token
  timeout: 5000 // 请求超时实践
})
// request拦截器
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      // 在头部Authorization携带token，以供后端验证
      config.headers['Authorization'] = getToken()
    }
    return config
  },
  error => {
    // 打印错误信息
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 20000&&res.code!==200) {
      // Message({
      //   message: res.message || 'error',
      //   type: 'error',
      //   duration: 5 * 1000
      // })
      // if(res.code==500){
      //   Message({
      //     message: res.message || 'error',
      //     type: 'error',
      //     duration: 5 * 1000
      //   })
      // }
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // 重新登录
        MessageBox.confirm('你已经登出，请重新登录！', '确认登出', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(res.message || 'error')
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    // Message({
    //   message: error.message,
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    return Promise.reject(error)
  }
)

export default service
