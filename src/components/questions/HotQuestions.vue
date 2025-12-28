<script setup>
import {FireFilled} from "@ant-design/icons-vue";
import {getHotQuestionList} from "@/http.js";
import {onBeforeMount, ref} from "vue";
import {useRouter} from "vue-router";
//热门题目
const hotQuestionsData = ref([])
onBeforeMount(() => {
  getHotQuestionList().then(response => {
    hotQuestionsData.value = response.data.data
  })
})

const router = useRouter()
const handleQuestionClick = (item) => {
  console.log(item)
  router.push(`/coding/${item.id}`)
}
</script>

<template>
  <div class="hot-questions">
    <h2 style="text-align: center ;margin:0 0 12px;padding-top:10px;font-size: 18px">热门题目</h2>
    <a-list item-layout="horizontal" :data-source="hotQuestionsData" :split="false">
      <template #renderItem="{ item }">
        <a-list-item @click="handleQuestionClick(item)" >
          <div style="display: flex; align-items: center; gap: 15px;">
            <FireFilled style="color: #FF5809; font-size: large;"/>
            <span style="font-size: 15px; min-width: 30px; text-align: center;">{{ item.id }}</span>
            <span style="font-size: 15px">{{ item.title }}</span>
          </div>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<style scoped>
.hot-questions {
  background-color: white;
  margin-left: 6%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
}
</style>