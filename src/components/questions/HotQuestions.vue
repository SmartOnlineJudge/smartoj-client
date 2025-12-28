<script setup>
import {FireFilled} from "@ant-design/icons-vue";
import {getHotQuestionList} from "@/http.js";
import {onBeforeMount, ref} from "vue";

//热门题目
const hotQuestionsData = ref([])
onBeforeMount(() => {
  getHotQuestionList().then(response => {
    hotQuestionsData.value = response.data.data
  })
})

const handleQuestionClick = (item) => {
  window.open(`/coding/${item.id}`)
}
</script>

<template>
  <div class="hot-questions">
    <h3 style="text-align: center;margin:0;">热门题目</h3>
    <a-list item-layout="horizontal" :data-source="hotQuestionsData" :split="false">
      <template #renderItem="{ item }">
        <a-list-item>
          <div style="display: flex; align-items: center; gap: 15px;">
            <FireFilled style="color: #FF5809; font-size: large;"/>
            <span style="font-size: 15px; min-width: 30px; text-align: center;">{{ item.id }}</span>
            <span class="title" @click="handleQuestionClick(item)">{{ item.title }}</span>
          </div>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<style scoped>
.hot-questions {
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  margin-top: 15px;
  padding: 10px 5px;
}
.hot-questions .title {
  transition: 0.5s ease;
  font-size: 15px;
}
.hot-questions .title:hover {
  color: #1677ff;
  cursor: pointer;
}
</style>