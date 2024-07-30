import Cookies from "js-cookie";
import { useMainStore } from "@/store";
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
