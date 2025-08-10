<script setup>
import { ref } from "vue";
import { LockOutlined, MailOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { userLogin } from "@/http.js";
import router from "@/router/index.js";
import { requestAndUpdateUser } from "@/utils.js";

const spinning = ref(false);
const rules = {
  emailRule: [{ required: true, message: '请输入邮箱' }],
  passwordRule: [{ required: true, message: '请输入密码' }]
}
const formState = ref({
  email: "",
  password: "",
});

const onFinish = async item => {
  const formData = {
    email: item.email,
    password: item.password,
    auth_type: "password"
  }
  try {
    const response = await userLogin(formData)
    if (response.data.code !== 300) {
      message.error('登录失败')
    } else {
      await requestAndUpdateUser()
      await router.push('/user/user-center')
    }
  } catch {
    message.error('登录失败')
  } finally {
    spinning.value = false
  }
}
</script>

<template>
  <div>
    <a-spin :spinning="spinning">
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
        <!-- 密码 -->
        <a-form-item name="password" :rules="rules.passwordRule">
          <a-input-password v-model:value="formState.password" placeholder="请输入密码" allow-clear>
            <template #prefix>
              <LockOutlined/>
            </template>
          </a-input-password>
        </a-form-item>
        <!-- 登录 -->
        <a-form-item>
          <a-button type="primary" html-type="submit" style="width: 100%">登录</a-button>
        </a-form-item>
      </a-form>
    </a-spin>
  </div>
</template>
