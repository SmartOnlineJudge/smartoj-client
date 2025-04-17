<script setup>
import { ref } from "vue";
import { LockOutlined, MailOutlined, SafetyOutlined, UserOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";

const spinning = ref(false);
const rules = {
  emailRule: [{ required: true, message: '请输入邮箱' }],
  nameRule: [{ required: true, message: '请输入用户名' }],
  password1Rule: [{ required: true, message: '请输入密码' }],
  password2Rule: [{ required: true, message: '请再次输入密码'}],
  verificationCodeRule: [{ required: true, message: '请输入验证码'}]
}
const formState = ref({
  email: "",
  password1: "",
  password2: "",
  name: "",
  verification_code: "",
});
const sendText = ref('发送')

const sendEmail = () => {
  message.success("验证码发送成功！请前往对应邮箱查看验证码")
  sendText.value = '60s'
  let countdown = 59
  const timer = setInterval(() => {
    sendText.value = String(countdown) + 's'
    countdown--
  }, 1000)
  setTimeout(() => {
    clearInterval(timer)
    sendText.value = '发送'
  }, 1000 * 60)
}

const onFinish = item => {
  console.log(item)
}
</script>

<template>
  <div>
    <a-form
        :model="formState"
        autocomplete="off"
        @submit="() => { spinning = true }"
        @finish="onFinish"
        @finishFailed="() => { spinning = false }"
    >
      <!-- 用户名 -->
      <a-form-item name="name" :rules="rules.nameRule">
        <a-input v-model:value="formState.name" placeholder="请输入用户名" allow-clear>
          <template #prefix>
            <UserOutlined />
          </template>
        </a-input>
      </a-form-item>
      <!-- 邮箱 -->
      <a-form-item name="email" :rules="rules.emailRule">
        <a-input v-model:value="formState.email" placeholder="请输入邮箱" allow-clear>
          <template #prefix>
            <MailOutlined />
          </template>
        </a-input>
      </a-form-item>
      <!-- 验证码 -->
      <a-form-item name="verification_code" :rules="rules.verificationCodeRule">
        <a-input
            v-model:value="formState.verification_code"
            placeholder="请输入验证码"
            allow-clear
            style="width: 220px"
        >
          <template #prefix>
            <SafetyOutlined />
          </template>
        </a-input>
        <a-button
            type="primary"
            :disabled="!formState.email || sendText !== '发送'"
            style="width: 73px;margin-left: 7px"
            @click="sendEmail"
        >{{ sendText }}</a-button>
      </a-form-item>
      <!-- 密码 1 -->
      <a-form-item name="password1" :rules="rules.password1Rule">
        <a-input-password v-model:value="formState.password1" placeholder="请输入密码" allow-clear>
          <template #prefix>
            <LockOutlined/>
          </template>
        </a-input-password>
      </a-form-item>
      <!-- 密码 2 -->
      <a-form-item name="password2" :rules="rules.password2Rule">
        <a-input-password v-model:value="formState.password2" placeholder="请再次输入密码" allow-clear>
          <template #prefix>
            <LockOutlined/>
          </template>
        </a-input-password>
      </a-form-item>
      <!-- 注册 -->
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%">注册</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped>

</style>