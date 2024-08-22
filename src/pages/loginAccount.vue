<script setup>
import md5 from "crypto-js/md5";
import { loginWithEmail, loginWithPhone } from "@/api/auth.js";
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
    if (validateEmail(email.value, password.value)) {
      loginFn = loginWithEmail;
      loginData.email = email.value.replace(/\s/g, "");
    } else {
      logingLoading.value = false;
    }
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
  <div class="mt-32px flex flex-col items-center justify-center">
    <img class="m-26px h-64px w-64px" src="/imgs/netease-music.png" alt="" />
    <p class="title">登录网易云账号</p>
    <div class="email">
      <TheInput v-if="loginType === 0" v-model="email" placeholder="邮箱">
        <div class="i-material-symbols-mail-rounded" />
      </TheInput>
      <TheInput v-if="loginType === 1" v-model="phone" placeholder="手机号">
        <div class="i-material-symbols-phone-android-rounded" />
      </TheInput>
      <TheInput v-model="password" placeholder="密码" type="password">
        <div class="i-material-symbols-password-rounded" />
      </TheInput>
    </div>
    <button v-loading="logingLoading" @click="handleLogin">登录</button>
    <div class="footer">
      <a
        v-for="item in loginTypes"
        :key="item.value"
        @click="loginType = item.value"
        :class="{ active: loginType === item.value }"
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
  .active {
    color: var(--color-primary);
    opacity: 0.95;
  }
}
</style>
