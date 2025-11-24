<template>
  <div class="user-base-info">
    <div class="title">
      <span>个人信息</span>
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
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores';

const userStore = useUserStore()
const MINIO_URL = import.meta.env.VITE_MINIO_URL
</script>

<style scoped>
.title {
  border-bottom: 1px solid #e5e5e5;
  text-align: center;
  padding: 10px 0;
  font-size: 16px;
  color: #333;
  font-weight: 600;
}
.user-info-show {
  padding: 15px;
}
</style>
