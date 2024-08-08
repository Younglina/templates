import Cookies from "js-cookie";
import { logout } from "@/api/auth";
import { useMainStore } from "@/store";

export function setCookies(string) {
  const cookies = string.split(";;");
  cookies.map((cookie) => {
    document.cookie = cookie;
    const cookieKeyValue = cookie.split(";")[0].split("=");
    localStorage.setItem(`cookie-${cookieKeyValue[0]}`, cookieKeyValue[1]);
  });
}
export function getCookie(key) {
  return Cookies.get(key) ?? localStorage.getItem(`cookie-${key}`);
}

export function removeCookie(key) {
  Cookies.remove(key);
  localStorage.removeItem(`cookie-${key}`);
}

export function isLoggedIn() {
  return getCookie("MUSIC_U") !== undefined;
}

export function isAccountLoggedIn() {
  const store = useMainStore();
  return (
    getCookie("MUSIC_U") !== undefined && store.baseData.loginMode === "account"
  );
}

export function doLogout() {
  logout();
  removeCookie("MUSIC_U");
  removeCookie("__csrf");
  // // 更新状态仓库中的用户信息
  // store.commit('updateData', { key: 'user', value: {} });
  // // 更新状态仓库中的登录状态
  // store.commit('updateData', { key: 'loginMode', value: null });
  // // 更新状态仓库中的喜欢列表
  // store.commit('updateData', { key: 'likedSongPlaylistID', value: undefined });
}
