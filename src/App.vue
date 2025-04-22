<template>
  <a-layout class="layout">
    <!-- 导航栏信息 -->
    <a-layout-header class="header">
      <div class="logo">
        <img src="/favicon.svg" alt="logo" width="40">
        <h2>智能算法刷题平台</h2>
      </div>
      <a-menu
          :selectedKeys="[$route.path]"
          theme="light"
          mode="horizontal"
          :style="{ lineHeight: '64px', marginLeft: '17px', fontSize: '15px', fontWeight: 'bold' }"
          @click="item => { router.push(item.key) }"
      >
        <a-menu-item key="/">首页</a-menu-item>
        <a-menu-item key="/questions">题库</a-menu-item>
        <a-menu-item key="/coding">在线刷题</a-menu-item>
        <a-menu-item key="/about">关于我们</a-menu-item>
      </a-menu>
      <div class="more">
        <div class="search-bar">
          <a-input-search
              placeholder="全站搜索"
              v-model:value="searchContent"
              @search="onSearch"
              enter-button
          />
        </div>
        <div v-if="userStore.isLogin" class="bell">
          <a href="#" @click="() => { router.push('/user/my-message') }">
            <a-tooltip placement="bottom">
              <template #title>
                <span>我的消息</span>
              </template>
              <a-badge count="5" size="small">
                <BellOutlined style="font-size: 16px"/>
              </a-badge>
            </a-tooltip>
          </a>
        </div>
        <div class="user-info">
          <!-- 未登录状态 -->
          <div v-if="!userStore.isLogin">
            <a-tooltip placement="bottom">
              <template #title>登录以获得更好的体验</template>
              <a-button style="font-size: 15px;" @click="() => { router.push('/login') }">登录</a-button>
            </a-tooltip>
          </div>
          <!-- 已登录状态 -->
          <a-dropdown v-else placement="bottom" :align="{offset: [0, 12]}">
            <div class="avatar">
              <a-avatar :src="MINIO_URL + userStore.user['avatar']" alt="avatar" width="35"/>
              <span style="font-size: 16px;margin-left: 5px">{{ userStore.user['name'] }}</span>
            </div>
            <template #overlay>
              <a-menu @click="item => {router.push(item.key)}">
                <a-menu-item key="/user/user-center">
                  <span>
                    <IdcardOutlined />
                    <span>个人中心</span>
                  </span>
                </a-menu-item>
                <a-menu-item key="/user/user-account">
                  <span>
                    <UserOutlined />
                    <span>账号管理</span>
                  </span>
                </a-menu-item>
                <a-menu-item key="/user/new-question">
                  <span>
                    <CodeOutlined />
                    <span>创建题目</span>
                  </span>
                </a-menu-item>
                <a-menu-item key="/user/my-message">
                  <span>
                    <BellOutlined />
                    <span>我的消息</span>
                  </span>
                </a-menu-item>
                <a-menu-item @click="logout">
                  <span>
                    <LogoutOutlined />
                    <span>退出登录</span>
                  </span>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </div>
    </a-layout-header>

    <!-- 主体内容 -->
    <a-layout-content>
      <router-view/>
    </a-layout-content>

    <!-- 底部内容 -->
    <a-layout-footer style="text-align: center">
      <span>2025 智能算法刷题平台 桂ICP备8888888-1号</span>
    </a-layout-footer>

  </a-layout>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { Modal } from "ant-design-vue";
import {
  BellOutlined,
  IdcardOutlined,
  LogoutOutlined,
  UserOutlined,
  CodeOutlined
} from "@ant-design/icons-vue";
import { RouterView } from "vue-router";
import router from "@/router/index.js";
import { useUserStore } from "@/stores.js";
import { userLogout } from "@/http.js";
import { requestAndUpdateUser } from "@/utils.js";

const userStore = useUserStore();
const MINIO_URL = import.meta.env.VITE_MINIO_URL
const searchContent = ref('');

onBeforeMount(requestAndUpdateUser)

const logout = async () => {
  Modal.confirm({
    title: '警告',
    content: '是否退出登录？',
    onOk() {
      return userLogout().then(() => {
        userStore.isLogin = false
        router.push('/')
      })
    },
    okText: '确认',
    cancelText: '取消',
  })
}

const onSearch = v => {
  console.log(v);
}
</script>

<style scoped>
.ant-dropdown-menu-item .anticon {
  margin-right: 8px;  /* Ant Design Icon 组件右侧留出 8px 空隙 */
}
.layout {
  min-height: 100vh;
}
.header {
  display: flex;
  background: #fff;
}
.logo {
  display: flex;
  align-items: center;
}
.logo h2 {
  padding-left: 8px;
}
/* 导航栏右边 */
.more {
  margin-left: auto;
  display: flex;
}
.more .search-bar {
  display: flex;
  align-items: center;
  margin-right: 20px
}
.more .bell {
  margin-right: 12px;
}
.more .user-info {
  display: flex;
  align-items: center;
}
.more .avatar {
  display: flex;
  align-items: center;
  line-height: normal;
  padding: 5px 10px;
  border-radius: 10px;
}
.more .avatar:hover {
  background: rgba(0, 0, 0, 0.06);
  cursor: pointer;
}
</style>