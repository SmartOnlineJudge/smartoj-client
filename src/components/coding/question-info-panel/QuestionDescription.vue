<script setup>
import { ref, watch, onMounted } from "vue";
import { CaretRightOutlined } from '@ant-design/icons-vue';

import { useQuestionStore, useUserStore } from '@/stores';
import { getRecommendedQuestions } from "@/http";

const questionStore = useQuestionStore()
const userStore = useUserStore()

const title = ref("");
const description = ref("");
const tags = ref([]);
const difficulty = ref("");
const loading = ref(true);
const recommendedQuestions = ref([])
const activeKey = ref("11")
const submissionCount = ref(0)
const passedRate = ref(0)

onMounted(async () => {
  watch(() => questionStore.question, () => {
    title.value = questionStore.question.title;
    description.value = questionStore.question.description;
    tags.value = questionStore.question.tags;
    difficulty.value = questionStore.question.difficulty;
    loading.value = false;
    submissionCount.value = questionStore.question.submission_quantity
    if (submissionCount.value > 0) {
      passedRate.value = questionStore.question.pass_quantity / questionStore.question.submission_quantity
    }
  })
  if (userStore.isLogin) {
    const response = await getRecommendedQuestions()
    recommendedQuestions.value = response.data.data
  }
})

const skipToQuestion = (questionID) => {
  window.open(`/coding/${questionID}`)
}
</script>

<template> 
  <div style="padding: 15px;">
    <a-skeleton :loading="loading" :paragraph="{ rows: 1 }" :title="false" active>
      <h1 class="question-title">{{ title }}</h1>
      <div class="question-info">
        <a-tag v-if="difficulty === 'hard'" color="error">困难</a-tag>
        <a-tag v-else-if="difficulty === 'easy'" color="success">简单</a-tag>
        <a-tag v-else-if="difficulty === 'medium'" color="warning">中等</a-tag>
        
        <a-tag v-for="tag in tags" color="processing">{{ tag.tag.name }}</a-tag>
      </div>
      <div style="margin-top: 15px;color: gray;">
        <span>提交数: <span style="color: black;font-weight: bold;">{{ submissionCount }}</span></span>&nbsp;&nbsp;
        <span>通过率: <span style="color: black;font-weight: bold;">{{ passedRate.toFixed(2) * 100 }}%</span></span>
      </div>
    </a-skeleton>
    <a-divider />
    <a-skeleton :loading="loading" :paragraph="{ rows: 12 }" active :title="false">
      <v-md-editor 
        v-model="description" 
        mode="preview"
      />
      <a-divider />
      <!-- 推荐题目 -->
      <div v-if="recommendedQuestions && recommendedQuestions.length > 0">
        <a-collapse
          v-model:activeKey="activeKey"
          :bordered="false"
          style="background: rgb(255, 255, 255)"
        >
          <template #expandIcon="{ isActive }">
            <CaretRightOutlined :rotate="isActive ? 90 : 0" />
          </template>
          <a-collapse-panel key="1" header="推荐题目" style="background: #f7f7f7;border-radius: 4px;margin-bottom: 24px;border: 0;overflow: hidden">
            <div v-for="question in recommendedQuestions" :key="question.question_id" class="recommendation-question">
              <a-button type="link" @click="() => { skipToQuestion(question.question_id) }">{{ question.question_id }}.{{ question.question_title }}</a-button>
              <div style="margin-left: auto;">
                <a-tag v-if="question.difficulty === 'hard'" color="error">困难</a-tag>
                <a-tag v-else-if="question.difficulty === 'easy'" color="success">简单</a-tag>
                <a-tag v-else-if="question.difficulty === 'medium'" color="warning">中等</a-tag>
              </div>
            </div>
          </a-collapse-panel>
        </a-collapse>
      </div>
    </a-skeleton>
  </div>
</template>

<style scoped>
.question-title {
  margin-top: 2px;
  margin-bottom: 14px;
  font-size: x-large
}

.question-info {
  display: flex;
  align-items: center;
}

.recommendation-question {
  display: flex;
}
</style>