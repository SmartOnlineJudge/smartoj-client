<script setup>
import {FireFilled} from "@ant-design/icons-vue";
import {onBeforeMount, ref} from "vue";
import {getRankingList} from "@/http.js";

//刷题排行榜
const rankingData = ref([])
onBeforeMount(
    () => {
      getRankingList().then(response => {
        rankingData.value = response.data.data
      })
    }
)

//头像
const MINIO_URL = import.meta.env.VITE_MINIO_URL
</script>

<template>
  <div class="ranking-list">
    <h3 style="text-align: center ;margin:0 0 12px;padding-top:10px;font-size: 18px">刷题排行榜</h3>
    <a-list item-layout="horizontal" :data-source="rankingData" :split="false">
      <template #renderItem="{ item }">
        <a-list-item>
          <div style="display: flex; align-items: center; gap: 10px;">
            <FireFilled style="color: #FF5809; font-size: large"/>
            <span style="font-size: 15px">{{ item.user_id }}</span>
            <a-avatar :src="MINIO_URL+item.user_avatar" :size="35"/>
            <span style="font-size: 15px; min-width: 80px">{{ item.user_name }}</span>
            <span style="font-size: 15px">{{ item.submit_count }}题</span>
          </div>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<style scoped>
.ranking-list {
  margin-bottom: 5%;
  background-color: white;
  margin-left: 6%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
}
</style>