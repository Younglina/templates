<script setup>
const inputFocus = ref('')
const pageData = reactive({
  countryCode: '+86',
  phoneNumber: '',
  password: '',
  mode: 'phone',
  processing: false,
})
function login() {
  pageData.processing = validatePhone();
  if (!pageData.processing) return;
  loginWithPhone({
    countrycode: pageData.countryCode.replace('+', '').replace(/\s/g, ''),
    phone: pageData.phoneNumber.replace(/\s/g, ''),
    password: 'fakePassword',
    md5_password: md5(pageData.password).toString(),
  })
    .then(pageData.handleLoginResponse)
    .catch(error => {
      pageData.processing = false;
      ElMessage.error(`发生错误，请检查你的账号密码是否正确\n${error}`);
    });
}
function validatePhone() {
  if (
    pageData.countryCode === '' ||
    pageData.phone === '' ||
    pageData.password === ''
  ) {
    ElMessage.error('请正确填写登录信息');
    pageData.processing = false;
    return false;
  }
  return true;
}
</script>

<template>
  <div class="flex-center flex-col mt-32px">
    <div class="flex-center flex-col">
      <div class="mb-16px flex items-center">
        <img class="h-64px m-20px select-none" src="/img/logos/netease-music.png" />
      </div>
      <div class="text-24px font-700 mb-48px color-text">登录网易云账号</div>
    </div>
    <div class="flex flex-col items-center">
      <div class="input-box">
        <div class="container" :class="{ active: ['countryCode', 'phone'].includes(inputFocus) }">
          <div class="svg-icon i-material-symbols-phone-android-rounded" />
          <div class="inputs">
            <input id="countryCode" v-model="pageData.countryCode" :placeholder="inputFocus === 'countryCode' ? '' : '区号'
          " @focus="inputFocus = 'countryCode'" @blur="inputFocus = ''" @keyup.enter="login" />
            <input id="phoneNumber" v-model="pageData.phoneNumber" :placeholder="inputFocus === 'phone' ? '' : '手机号码'"
              @focus="inputFocus = 'phone'" @blur="inputFocus = ''" @keyup.enter="login" />
          </div>
        </div>
      </div>
      <div v-show="mode !== 'qrCode'" class="input-box">
        <div class="container" :class="{ active: inputFocus === 'password' }">
          <div class="svg-icon i-material-symbols-lock" />
          <div class="inputs">
            <input id="password" v-model="password" type="password" :placeholder="inputFocus === 'password' ? '' : '密码'
          " @focus="inputFocus = 'password'" @blur="inputFocus = ''" @keyup.enter="login" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang='scss'>
.input-box {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
  color: var(--color-text);

  .container {
    display: flex;
    align-items: center;
    height: 46px;
    background: var(--color-secondary-bg);
    border-radius: 8px;
    width: 300px;
  }

  .svg-icon {
    height: 18px;
    width: 18px;
    color: #aaaaaa;

    margin: {
      left: 12px;
      right: 6px;
    }
  }

  .inputs {
    display: flex;
    width: 85%;
  }

  input {
    font-size: 20px;
    border: none;
    background: transparent;
    width: 100%;
    font-weight: 600;
    margin-top: -1px;
    color: var(--color-text);
  }

  input::placeholder {
    color: var(--color-text);
    opacity: 0.38;
  }

  input#countryCode {
    flex: 3;
  }

  input#phoneNumber {
    flex: 12;
  }

  .active {
    background: var(--color-primary-bg);

    input,
    .svg-icon {
      color: var(--color-primary);
    }
  }
}
</style>