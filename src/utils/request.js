import axios from "axios";

const _axios = axios.create({
  baseURL: "http://localhost:3000/",
  // baseURL: "https://dev.usemock.com/65e8005d48882231b5644106/",
  timeout: 20000, // 请求超时 20s
  withCredentials: true,
});
class CustomError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// 前置拦截器（发起请求之前的拦截）
_axios.interceptors.request.use(
  (config) => {
    if (!config.params) config.params = {};
    return config;
  },
  (error) => {
    return Promise.reject(error.message);
  }
);

// 后置拦截器（获取到响应时的拦截）
_axios.interceptors.response.use(
  (response) => {
    if (response.data.code !== 200 && response.status !== 200)
      return Promise.reject(new CustomError(response.data.code));
    else return response.data;
  },
  (error) => {
    if (error.response.status === 401) window.location.href = "/login";
    return new CustomError(error.response.status, error.message);
  }
);

export default _axios;
