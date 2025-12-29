<template>
  <div class="user-base-info">
    <div class="title">
      <span class="title-text">个人信息</span>
      <a-button 
        class="setting-icon" 
        shape="circle" 
        size="small" 
        type="text"
        @click="() => { open = true }"
      >
        <SettingOutlined />
      </a-button>
    </div>
    <div class="user-info-show">
      <div style="text-align: center;">
        <a-avatar :src="MINIO_URL + userStore.user['avatar']" :size="54" alt="avatar"/>
      </div>
      <div style="text-align: center; margin-top: 10px;overflow: hidden;">
        <span style="font-size: 16px; font-weight: 500;">
          {{ userStore.user["name"] }}
        </span>
      </div>
      <div style="text-align: center; margin-top: 10px;overflow: hidden;">
        <span style="color: gray">
          {{ userStore.user["profile"] }}
        </span>
      </div>
      <div style="display: flex;justify-content: center;margin-top: 10px;">
        <span>LV {{ userStore.user["grade"] }}</span>
        <a-progress 
          :percent="70" 
          status="active"
          :show-info="false"
          size="small"
          style="width: 70%;margin-left: 5px;"
        />
      </div>
      <div style="text-align: center;">
        <span style="color: gray;font-size: 12px;">
          距离 LV2 还需要 66 点经验值
        </span>
      </div>
    </div>
    <a-modal 
      v-model:open="open" 
      title="修改基本信息"
      ok-text="确认" 
      cancel-text="取消"
      :confirmLoading="confirmLoading"
      @ok="handleOk"
    >
      <div class="modify-modal">
        <div class="account-info">
          <div class="info-field">
            <span class="field-name">用户名</span>
            <a-input v-model:value="username" :maxlength="20" allow-clear></a-input>
          </div>
          <div class="info-field">
            <span class="field-name">个人介绍</span>
            <a-textarea v-model:value="profile" :maxlength="30" allow-clear/>
          </div>
        </div>
        <div class="avatar-info">
          <span class="field-name">用户头像</span>
          <a-image :src="MINIO_URL + userStore.user['avatar']" :width="100" alt="favicon.svg"/>
          <a-upload
            name="avatar"
            action="/api/user/avatar"
            :withCredentials="true"
            @change="onChange"
            style="margin-top: 10px;"
          >
            <a-button>
              <UploadOutlined/>
              更换头像
            </a-button>
          </a-upload>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { SettingOutlined, UploadOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue';

import { useUserStore } from '@/stores';
import { updateUserInfo } from '@/http';
import { requestAndUpdateUser } from '@/utils';

const open = ref(false)
const userStore = useUserStore()
const MINIO_URL = import.meta.env.VITE_MINIO_URL
const username = ref('')
const profile = ref('')
const confirmLoading = ref(false);

// 监听open变化，在打开弹窗时初始化输入框的值
watch(open, (newVal) => {
  if (newVal) {
    username.value = userStore.user["name"]
    profile.value = userStore.user["profile"]
  }
})

const handleOk = async () => {
  confirmLoading.value = true;
  try {
    const response = await updateUserInfo(username.value, profile.value);
    if (response.data.code !== 200) {
      message.error(response.data.message);
    } else {
      message.success('用户信息修改成功！');
      userStore.user["name"] = username.value;
      userStore.user["profile"] = profile.value;
    }
  } catch (error) {
    message.error('用户信息修改异常！');
    console.log(error);
  } finally {
    confirmLoading.value = false;
  }
}

const onChange = async info => {
  if (info.file.status === 'done') {
    let response = info.file.response;
    if (response.code !== 200) {
      message.error(response.message);
    } else {
      message.success("头像修改成功！");
      await requestAndUpdateUser();
    }
  }
}
</script>

<style scoped>
.title {
  border-bottom: 1px solid #e5e5e5;
  padding: 10px 0;
  display: flex;
  justify-content: center;
}
.title-text {
  font-size: 16px;
  color: #333;
  font-weight: 600;
}
.user-info-show {
  padding: 15px;
}
.modify-modal {
  display: flex;
}
.info-field {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}
.field-name {
  margin-bottom: 5px;
}
.avatar-info {
  margin-left: 40px;
  display: flex;
  flex-direction: column;
}
</style>
