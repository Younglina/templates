import axios from "axios";
import { doLogout, getCookie } from "./auth.js";

const _axios = axios.create({
  // baseURL: "http://localhost:3000/",
  baseURL: "https://dev.usemock.com/65e8005d48882231b5644106/",
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
    if (getCookie("MUSIC_U") !== null) {
      config.params.cookie = `MUSIC_U=${getCookie("MUSIC_U")};`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error.message);
  }
);

// 后置拦截器（获取到响应时的拦截）
_axios.interceptors.response.use(
  (response) => {
    const res = response.data;
    return res;
  },
  async (error) => {
    let response;
    let data;
    if (error === "TypeError: baseURL is undefined") {
      response = error;
      data = error;
      console.error("You must set up the baseURL in the service's config");
    } else if (error.response) {
      response = error.response;
      data = response.data;
    }

    if (
      response &&
      typeof data === "object" &&
      data.code === 301 &&
      data.msg === "需要登录"
    ) {
      console.warn("Token has expired. Logout now!");

      // doLogout();
      router.push({ name: "login" });
    }
    throw error;
  }
);

export default _axios;
