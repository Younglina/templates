/*
 * @Author: younglina younglina0409@gmail.com
 * @Date: 2024-01-07 09:35:02
 * @Description: 
 */
import axios from 'axios'

const _axios = axios.create({
  // baseURL: 'http://127.0.0.1:8000/api',
  timeout: 20000, // 请求超时 20s
  withCredentials: true,
})

// 前置拦截器（发起请求之前的拦截）
_axios.interceptors.request.use(
  (config) => {
    if (!config.params)
      config.params = {}
    return config
  },
  (error) => {
    return Promise.reject(error.message)
  },
)

// 后置拦截器（获取到响应时的拦截）
_axios.interceptors.response.use(
  (response) => {
    if (response.data.code !== 200)
      return Promise.reject({ code: response.data.code })
    else
      return response.data
  },
  (error) => {
    return Promise.reject({ code: 500, message: error.message })
  },
)

export default class Http {
  static async request(method, url, data) {
    const param = {
      url,
      method,
      data: method === 'GET' ? null : data,
      params: method === 'GET' ? data : null,
    }
    try {
      const res = await _axios(param)
      if (res.code === 200)
        return res
    } catch (error) {
      throw error
    }
  }

  static get(url, data) {
    return this.request('GET', url, data)
  }

  static post(url, data) {
    return this.request('POST', url, data)
  }
  static delete(url, data) {
    return this.request('DELETE', url, data)
  }
}
