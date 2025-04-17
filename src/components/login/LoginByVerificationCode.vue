<script setup>
import { ref } from "vue";
import { SafetyOutlined, MailOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";

const spinning = ref(false);
const rules = {
  emailRule: [{ required: true, message: '请输入邮箱' }],
  verificationCodeRule: [{ required: true, message: '请输入验证码' }]
}
const formState = ref({
  email: "",
  verification_code: ""
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
      <!-- 登录 -->
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%">登录</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped>

</style>