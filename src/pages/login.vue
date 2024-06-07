<script setup>
const router = useRouter()
function handleLogin() {
  router.push("/")
}
</script>
<template>
  <main class="login-warp">
    <section class="left">
      <img src="@/assets/images/login_2.svg" />
    </section>
    <section class="right">
      <h1>欢迎回来</h1>
      <div class="login-input">
        <i class="i-ms-account-circle-outline" />
        <input placeholder="用户名" />
      </div>
      <div class="login-input">
        <i class="i-ms-lock-outline" />
        <input placeholder="密码" type="password" />
      </div>
      <p class="forgot">忘记密码</p>
      <div>
        <el-button type="primary" @click="handleLogin">登录</el-button>
      </div>
    </section>
  </main>
</template>
<style scoped lang="scss">
@media (max-width: 800px) {
  .login-warp {
    transform: scale(0.5);
  }
}

@media (max-width: 1000px) {
  .login-warp {
    transform: scale(0.6);
  }
}

@media (max-width: 1200px) {
  .login-warp {
    transform: scale(0.7);
  }
}

.login-warp {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 1000px;
  height: 600px;
  min-width: 1000px;
  min-height: 600px;
  padding: 25px;
  background-color: var(--wy-bg-color);
  box-shadow:
    10px 10px 10px #d1d9e6,
    -10px -10px 10px #f9f9f9;
  border-radius: 12px;
  overflow: hidden;
  box-sizing: border-box;

  .left,
  .right {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    box-sizing: border-box;
    transition: 1.25s;
    background-color: var(--wy-bg-color);
  }

  .left {
    top: 0;
    left: 0;
    height: 100%;
    width: 400px;
    padding: 50px;
    z-index: 200;
    overflow: hidden;
    box-shadow:
      4px 4px 10px #d1d9e6,
      -4px -4px 10px #f9f9f9;

    img {
      width: 100%;
    }
  }

  .right {
    left: calc(100% - 600px);
    top: 0;
    width: 600px;
    height: 100%;
    padding: 25px;
    flex-direction: column;
  }

  .login-input {
    position: relative;
    margin: 6px 0;

    input {
      width: 350px;
      height: 40px;
      padding-left: 40px;
      font-size: 13px;
      letter-spacing: 0.15px;
      border: none;
      outline: none;
      background-color: var(--wy-bg-color);
      transition: 0.25s ease;
      border-radius: 8px;
      box-shadow:
        inset 2px 2px 4px #d1d9e6,
        inset -2px -2px 4px #f9f9f9;
    }

    i {
      position: absolute;
      top: 50%;
      left: 10px;
      font-size: 20px;
      color: var(--el-text-color-placeholder);
      transform: translateY(-50%);
    }
  }

  .forgot {
    font-size: 12px;
    color: var(--el-text-color-placeholder);
    width: 350px;
    text-align: right;
    cursor: pointer;
  }
}

.dark {
  .login-warp {
    box-shadow:
      10px 10px 10px #303842,
      -10px -10px 10px #20262e;
  }

  .left {
    box-shadow:
      inset 2px 2px 4px #303842,
      inset -2px -2px 4px #20262e;
  }

  .login-input {
    input {
      box-shadow:
        inset 2px 2px 4px #303842,
        inset -2px -2px 4px #20262e;
    }
  }
}
</style>
