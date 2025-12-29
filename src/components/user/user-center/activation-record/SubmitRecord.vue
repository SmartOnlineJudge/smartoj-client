<template>
  <div v-if="total > 0" class="submit-record">
    <a-spin :spinning="spinning">
      <div
        v-for="quetion in pageData" 
        class="record-container" 
        @click="() => { goToCoding(quetion.question_id) }"
      >
        <div class="title">
          <span class="question-name">{{ quetion.question_id }}.{{ quetion.title }}</span>
          <div class="difficulty">
            <a-tag v-if="quetion.difficulty === 'hard'" color="error">困难</a-tag>
            <a-tag v-else-if="quetion.difficulty === 'easy'" color="success">简单</a-tag>
            <a-tag v-else-if="quetion.difficulty === 'medium'" color="warning">中等</a-tag>
          </div>
        </div>
        <div class="footer">
          <span style="margin-right: 10px;">{{ quetion.created_at }}</span>
          <CheckCircleOutlined v-if="quetion.is_passed" style="color: #52c41a;"/>
          <CloseCircleOutlined v-else style="color: red;"/>
          <div class="tags">
            <a-tag v-for="tag in quetion.tags" color="processing">{{ tag }}</a-tag>
          </div>
        </div>
        <a-divider style="margin-top: 15px;margin-bottom: 15px;"/>
      </div>
    </a-spin>
    <div class="pagination">
      <a-pagination 
        v-model:current="currentPage"
        v-model:pageSize="pageSize"
        :total="total" 
        :defautPageSize="pageSize"
        @change="pageChangeHandler"
        size="small"
        style="margin-left: auto;"
      />
    </div>
  </div>
  <a-empty v-else/>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons-vue";
import { message } from 'ant-design-vue';

import { getSubmitRecords } from "@/http";

const pageSize = 5;
const currentPage = ref(1);
const pageData = ref([])
const total = ref(0);
const spinning = ref(true);

onMounted(async () => {
  try {
    const response = await getSubmitRecords(currentPage.value, pageSize)
    const responseData = response.data.data;
    pageData.value = responseData.results;
    total.value = responseData.total;
  } catch (error) {
    console.log(error)
    message.error("数据获取异常")
    return
  } finally {
    spinning.value = false;
  }
})

const pageChangeHandler = async page => {
  spinning.value = true;
  try {
    const response = await getSubmitRecords(page, pageSize)
    const responseData = response.data.data;
    pageData.value = responseData.results;
  } catch (error) {
    console.log(error)
    message.error("数据获取异常")
    return
  } finally {
    spinning.value = false;
  }
}
const goToCoding = questionID => {
  window.open(`/coding/${questionID}`)
}
</script>

<style scoped>
.record-container {
  display: flex;
  flex-direction: column;
}
.record-container:hover {
  cursor: pointer;
}
.record-container:hover .question-name {
  color: #1677ff;
}
.title {
  display: flex;
}
.question-name {
  font-weight: bold;
  font-size: 15px;
  color: black;
}
.difficulty {
  margin-left: auto;
}
.footer {
  margin-top: 10px;
  color: gray;
  display: flex;
  align-items: center;
}
.tags {
  margin-left: auto;
}
.pagination {
  margin-bottom: 10px;
  display: flex;
}
</style>
