import axios from 'axios'

const _axios = axios.create({
  timeout: 20000, // 请求超时 20s
  withCredentials: true,
})
class CustomError extends Error {
  constructor(code, message) {
    super(message)
    this.code = code
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

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
      return Promise.reject(new CustomError(response.data.code))
    else return response.data
  },
  (error) => {
    return new CustomError(error.response.status, error.message)
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
      else return { code: res.code, message: res.message }
    }
    catch (error) {
      console.log(error)
      return error
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
