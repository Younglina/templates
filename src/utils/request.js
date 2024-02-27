/*
 * @Author: younglina younglina0409@gmail.com
 * @Date: 2024-01-07 09:35:02
 * @Description: 
 */
import router from '@/router';
import { doLogout, getCookie } from '@/utils/auth';
import axios from 'axios';

let baseURL = import.meta.env.VITE_NETEASE_API_URL;

const service = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 15000,
});

service.interceptors.request.use(function (config) {
  if (!config.params) config.params = {};
  if (baseURL.length) {
    if (
      baseURL[0] !== '/' &&
      getCookie('MUSIC_U') !== null
    ) {
      config.params.cookie = `MUSIC_U=${getCookie('MUSIC_U')};`;
    }
  } else {
    console.error("You must set up the baseURL in the service's config");
  }

  if (!config.url.includes('/login')) {
    config.params.realIP = '121.40.220.158';
  }

  // if (process.env.VUE_APP_REAL_IP) {
  //   config.params.realIP = process.env.VUE_APP_REAL_IP;
  // }

  const proxy = JSON.parse(localStorage.getItem('settings') || "{}").proxyConfig || {};
  if (['HTTP', 'HTTPS'].includes(proxy.protocol)) {
    config.params.proxy = `${proxy.protocol}://${proxy.server}:${proxy.port}`;
  }

  return config;
});

service.interceptors.response.use(
  response => {
    const res = response.data;
    return res;
  },
  async error => {
    console.log(error)
    const response = error.response || {};
    const data = response.data;

    if (
      response &&
      typeof data === 'object' &&
      data.code === 301 &&
      data.msg === '需要登录'
    ) {
      console.warn('Token has expired. Logout now!');

      doLogout();

      router.push({ name: 'login' });
    }
  }
);

export default service