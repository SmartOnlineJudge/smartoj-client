<script setup>
import { ref } from "vue";
import { LockOutlined, MailOutlined } from "@ant-design/icons-vue";

const spinning = ref(false);
const rules = {
  emailRule: [{ required: true, message: '请输入邮箱' }],
  passwordRule: [{ required: true, message: '请输入密码' }]
}
const formState = ref({
  email: "",
  password: "",
});
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
  </div>
</template>
