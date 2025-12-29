<script setup>
import { reactive, ref } from "vue";
import { message } from "ant-design-vue";

import { verifyCode, updatePassword, checkVerifyCode, updateEmail } from "@/http.js";
import { useUserStore } from "@/stores.js";

const userStore = useUserStore();
const user = userStore.user;

const dataSource = [
  {
    title: '账号邮箱',
    description: '用于密码登录和验证码登录。',
    key: 'email',
    content: user['email'],
  },
  {
    title: '账号密码',
    description: '用于该账号的密码登录。',
    key: 'password',
    content: '当前平台不支持展示用户密码',
  },
  {
    title: 'GitHub Token',
    description: '通过 OAuth2 的方式从 GitHub 中获取的登录授权凭证，只能用于普通用户登录且不可修改。',
    key: 'githubToken',
    content: user['github_token'] || '暂未绑定'
  },
  {
    title: 'QQ Token',
    description: '通过 OAuth2 的方式从 QQ 中获取的登录授权凭证，只能用于普通用户登录且不可修改。',
    key: 'qqToken',
    content: user['qq_token'] || '暂未绑定'
  }
]

const currentAction = ref('');
const sendButtonText = ref('发送验证码');

const updateInfo = (key) => {
  currentAction.value = key;
  openEmailVerification.value = true;
}

// 验证邮箱
const openEmailVerification = ref(false)
const verifyEmailCode = ref(null)

// 发送验证码
const sendVerifyCode = recipient => {
  verifyCode(recipient).then(response => {
    if (response.data.code === 200) {
      message.success("验证码发送成功！");
      sendButtonText.value = '60s'
      let countdown = 59
      const timer = setInterval(() => {
        sendButtonText.value = String(countdown) + 's'
        countdown--
      }, 1000)
      setTimeout(() => {
        clearInterval(timer)
        sendButtonText.value = '发送验证码'
      }, 1000 * 60)
    } else {
      message.error(response.data.message);
    }
  }).catch(() => {
    message.error("请求失败");
  });
}

// 检验验证码
const verifyEmailHandle = (code) => {
  checkVerifyCode(code).then(response => {
    if (response.data.code === 200) {
      message.success("验证成功！");
      openEmailVerification.value = false;
      openUpdating.value = true;
    } else {
      message.error(response.data.message);
    }
  }).catch(() => {
    message.error("请求失败");
  })
}

// 修改邮箱、密码
const formState = reactive({
  newpassword: null,
  newEmail: null,
  confirmNewPassword: null,
  confirmNewEmail: null,
  updateVerifyEmailCode: null
});
const update = ref()
const resetUpdating = () => {
  update.value.resetFields()
}

// 修改密码
const openUpdating = ref(false)
const updatePassword_ = () => {
  if (formState.newpassword !== formState.confirmNewPassword) {
    message.error("两次输入的密码不一致");
    return;
  }
  updatePassword(formState.newpassword, verifyEmailCode.value).then(response => {
    if (response.data.code === 200) {
      message.success("密码修改成功！请重新登录");
      setTimeout(() => {
        location.href = "/login"
      }, 2000)
    } else {
      message.error(response.data.message);
    }
  }).catch(() => {
    message.error("请求失败");
  }).finally(() => {
    openUpdating.value = false;
  })
}

// 修改邮箱
const updateEmail_ = () => {
  if (formState.newEmail !== formState.confirmNewEmail) {
    message.error("两次输入的邮箱不一致");
    return;
  }
  updateEmail(formState.newEmail, formState.updateVerifyEmailCode).then(response => {
    if (response.data.code === 200) {
      message.success("邮箱修改成功！请重新登录");
      setTimeout(() => {
        location.href = "/login"
      }, 2000)
    } else {
      message.error(response.data.message);
    }
  }).catch(() => {
    message.error("请求失败");
  }).finally(() => {
    openUpdating.value = false;
  })
}
</script>

<template>
  <div class="user-account">
    <h2 style="margin-bottom: 0;margin-left: 10px;">账号信息管理</h2>
    <a-divider style="margin-top: 15px;margin-bottom: 0;"/>
    <a-list item-layout="horizontal" :dataSource="dataSource">
      <template #renderItem="{ item }">
        <a-list-item>
          <template #actions>
            <a v-if="item.key === 'email' || item.key === 'password'"
              type="primary"
              @click="() => { updateInfo(item.key) }"
            >修改</a>
            <a v-else disabled>修改</a>
          </template>
          <a-list-item-meta :description="item.description">
            <template #title>
              {{ item.title }}
            </template>
          </a-list-item-meta>
          <div>{{ item.content }}</div>
        </a-list-item>
      </template>
    </a-list>
    <!--  验证当前邮箱  -->
    <a-modal v-model:open="openEmailVerification"
      title="验证邮箱"
      okText="提交"
      cancelText="取消"
      :closable="false"
      :maskClosable="false"
      style="width: 400px"
      @ok="() => { verifyEmailHandle(verifyEmailCode) }"
      @cancel="() => { verifyEmailCode = null }"
    >
      <a-form>
        <a-form-item label="邮箱">
          {{ user['email'] }}
        </a-form-item>
        <a-form-item label="验证码">
          <a-input v-model:value="verifyEmailCode" style="width: 130px;margin-right: 20px"/>
          <a-button 
            type="primary" 
            @click="() => { sendVerifyCode('') }"
            :disabled="sendButtonText !== '发送验证码'"
          >
            {{ sendButtonText }}
          </a-button>
        </a-form-item>
      </a-form>
    </a-modal>
    <!--  修改邮箱、密码 -->
    <a-modal v-model:open="openUpdating"
      :title="currentAction === 'password'?'修改密码': '修改邮箱'"
      okText="更换"
      cancelText="取消"
      :closable="false"
      @ok="currentAction === 'password'? updatePassword_() : updateEmail_()"
      @cancel="resetUpdating"
    >
      <a-form :model="formState" ref="update">
        <a-form-item
          :label="currentAction === 'password'?'新密码': '新邮箱'"
          :name="currentAction === 'password'?'newpassword':'newEmail'"
        >
          <a-input-password
            v-if="currentAction === 'password'"
            v-model:value="formState.newpassword"
          />
          <a-input v-else v-model:value="formState.newEmail"/>
        </a-form-item>
        <a-form-item
          :label="currentAction === 'password'?'重复新密码': '重复新邮箱'"
          :name="currentAction === 'password'?'confirmNewPassword':'confirmNewEmail'"
        >
          <a-input-password
            v-if="currentAction === 'password'"
            v-model:value="formState.confirmNewPassword"
          />
          <a-input v-else v-model:value="formState.confirmNewEmail"/>
        </a-form-item>
        <a-form-item v-if="currentAction === 'email'" label="验证码" name="updateVerifyEmailCode">
          <a-input v-model:value="formState.updateVerifyEmailCode" style="width: 150px;margin-right: 20px"/>
          <a-button 
            type="primary" 
            @click="() => { sendVerifyCode(formState.newEmail) }"
            :disabled="sendButtonText !== '发送验证码'"
          >
            {{ sendButtonText }}
          </a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<style scoped>
.user-account {
  margin: 20px auto 0 auto;
  background-color: white;
  width: 80%;
  border-radius: 10px;
  padding: 10px;
}
</style>
