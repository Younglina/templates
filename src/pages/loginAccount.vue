<script setup>
import {
  loginWithPhone,
  loginWithEmail,
  loginQrCodeKey,
  loginQrCodeCheck,
} from "@/api/auth.js";
import md5 from "crypto-js/md5";
import { validateEmail } from "@/utils/common.js";
import { setCookies } from "@/utils/auth.js";

const store = useMainStore();
const email = ref("");
const phone = ref("");
const password = ref("");
const logingLoading = ref(false);
const loginType = ref(0);
const loginTypes = [
  { value: 0, label: "邮箱登录" },
  { value: 1, label: "手机号登录" },
  { value: 2, label: "二维码登录" },
];

function handleLogin() {
  let loginFn;
  const loginData = {
    password: "fakePassword",
    md5_password: md5(password.value).toString(),
  };
  if (loginType.value === 0) {
    validateEmail(email.value, password.value);
    loginFn = loginWithEmail;
    loginData.email = email.value.replace(/\s/g, "");
  } else {
    if (!phone.value || !password.value) {
      MessageBox({
        title: "登录失败",
        message: "手机号不正确",
        showFooter: true,
      });
      return;
    }
    loginData.phone = phone.value.replace(/\s/g, "");
    loginFn = loginWithPhone;
  }
  logingLoading.value = true;
  loginFn(loginData)
    .then(handleLoginResponse)
    .catch((error) => {
      logingLoading.value = false;
      processing = false;
      MessageBox({
        title: "登录失败",
        message: `请检查你的账号密码是否正确\n${error}`,
        showFooter: true,
      });
    });
}

const router = useRouter();
function handleLoginResponse(data) {
  if (!data) {
    logingLoading.value = false;
    return;
  }
  if (data.code === 200) {
    setCookies(data.cookie);
    store.updateData("loginMode", "account");
    logingLoading.value = false;
    store.fetchUserProfile().then(() => {
      store.fetchLikedPlaylist().then(() => {
        router.push({ path: "/library" });
      });
    });
  } else {
    logingLoading.value = false;
    MessageBox({
      title: "登录失败",
      message: `账号或密码错误`,
    });
  }
}
</script>
<template>
  <div class="flex justify-center flex-col items-center mt-32px">
    <img class="w-64px h-64px m-26px" src="/imgs/netease-music.png" alt="" />
    <p class="title">登录网易云账号</p>
    <div class="email">
      <TheInput v-if="loginType === 0" placeholder="邮箱" v-model="email">
        <div class="i-material-symbols-mail-rounded"></div>
      </TheInput>
      <TheInput v-if="loginType === 1" placeholder="手机号" v-model="phone">
        <div class="i-material-symbols-phone-android-rounded"></div>
      </TheInput>
      <TheInput placeholder="密码" v-model="password" type="password">
        <div class="i-material-symbols-password-rounded"></div>
      </TheInput>
    </div>
    <button v-loading="logingLoading" @click="handleLogin">登录</button>
    <div class="footer">
      <a
        v-for="item in loginTypes"
        :key="item.value"
        @click="loginType = item.value"
      >
        {{ item.label }}
      </a>
    </div>
  </div>
</template>
<style scoped lang="scss">
.title {
  margin-bottom: 48px;
}
button {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 600;
  background-color: var(--color-primary-bg);
  color: var(--color-primary);
  border-radius: 8px;
  margin-top: 24px;
  transition: 0.2s;
  padding: 8px;
  width: 300px;
  animation: all 0.3s;
  &:hover {
    transform: scale(1.02);
  }
}
.footer {
  display: flex;
  font-size: 13px;
  color: var(--color-text);
  opacity: 0.68;
  margin-top: 24px;
  a + a {
    &::before {
      content: "|";
      margin: 0 6px;
    }
  }
}
</style>
