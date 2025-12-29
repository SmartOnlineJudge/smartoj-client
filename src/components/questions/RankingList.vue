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
    <h3 style="text-align: center;margin: 0;">刷题排行榜</h3>
    <a-list item-layout="horizontal" :data-source="rankingData" :split="false">
      <template #renderItem="{ item }">
        <a-list-item>
          <div style="display: flex;align-items: center;gap: 10px;">
            <FireFilled style="color: #FF5809; font-size: large"/>
            <a-avatar :src="MINIO_URL + item.user_avatar" :size="30"/>
            <span style="font-size: 15px;color: gray;">{{ item.user_name }}</span>
            <span style="font-size: 15px;">{{ item.submit_count }} 次</span>
          </div>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<style scoped>
.ranking-list {
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 10px 5px;
}
</style>