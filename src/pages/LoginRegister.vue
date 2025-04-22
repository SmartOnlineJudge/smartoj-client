<script setup>
import { ref } from "vue";
import { Modal } from "ant-design-vue";
import { QqOutlined, GithubFilled } from "@ant-design/icons-vue";
import Register from "@/components/Register.vue";
import LoginByPassword from "@/components/login/LoginByPassword.vue";
import LoginByVerificationCode from "@/components/login/LoginByVerificationCode.vue";

const GitHubClientID = import.meta.env.VITE_GITHUB_CLIENT_ID
const GitHubRedirectUri = import.meta.env.VITE_GITHUB_REDIRECT_URI
const componentType = ref(1)  // 1 登录，2 注册
const loginType = ref(1);  // 1 密码登录，2 验证码登录

const redirectToOAuthApp = appName => {
  Modal.confirm({
    title: '警告',
    content: "您正在尝试使用第三方平台授权的方式登录到系统，是否确认跳转到第三方平台应用？",
    okText: "确认",
    cancelText: '取消',
    onOk: () => {
      let OAuthUrl
      if (appName === 'github') {
        OAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GitHubClientID}&redirect_uri=${GitHubRedirectUri}&scope=user:email`;
      }
      // window.location.href = OAuthUrl;
      console.log(OAuthUrl);
    },
    centered: true
  })
}
</script>

<template>
  <div class="login-box">
    <!-- 登录框标题 -->
    <div class="login-box-title">
      <img src="/favicon.svg" alt="logo" width="50">
      <h2>欢迎来到 智能算法刷题平台👋</h2>
    </div>
    <!-- 登录框主体内容 -->
    <div class="main-content">
      <!-- 登录 -->
      <div v-if="componentType === 1">
        <div class="login-type">
          <a-radio-group v-model:value="loginType" button-style="solid">
            <a-radio-button :value="1">验证码登录</a-radio-button>
            <a-radio-button :value="2">密码登录</a-radio-button>
          </a-radio-group>
        </div>
        <div class="login-form">
          <LoginByVerificationCode v-if="loginType === 1"/>
          <LoginByPassword v-else/>
        </div>
        <div style="text-align: center">
          <span style="color: gray">还没有账号？</span>
          <a @click="componentType = 2">创建账号</a>
        </div>
      </div>
      <!-- 注册 -->
      <div v-else-if="componentType === 2">
        <div class="login-form">
          <Register/>
        </div>
        <div style="text-align: center">
          <span style="color: gray">已经有账号了？</span>
          <a @click="componentType = 1">前往登录</a>
        </div>
      </div>
      <!-- 其它登录方式 -->
      <div style="width: 320px;margin: 18px auto 0 auto">
        <a-divider :plain="true">第三方平台授权登录</a-divider>
        <div style="font-size: 23px;text-align: center">
          <a-tooltip placement="bottom">
            <template #title>使用 GitHub 登录</template>
            <GithubFilled style="margin-right: 7px" @click="() => { redirectToOAuthApp('github') }"/>
          </a-tooltip>
          <a-tooltip placement="bottom">
            <template #title>使用 QQ 登录</template>
            <QqOutlined @click="() => { redirectToOAuthApp('qq') }"/>
          </a-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-box {
  background: #fff;
  margin: 50px auto 0 auto;
  padding: 35px 0 15px 0;
  width: 530px;
  border-radius: 15px;
}
.login-box-title {
  text-align: center;
}
.login-box-title h2 {
  margin-top: 5px;
  font-weight: normal;
}
.login-type {
  text-align: center;
  margin: 0 auto;
}
.login-form {
  margin: 20px auto;
  width: 300px;
}
</style>