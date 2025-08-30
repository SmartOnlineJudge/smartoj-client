<script setup>
import { ref, watch, onMounted } from "vue";
import { useQuestionStore } from '@/stores';

const questionStore = useQuestionStore()

const title = ref("");
const description = ref("");
const tags = ref([]);
const difficulty = ref("");
const loading = ref(true);

onMounted(() => {
  watch(() => questionStore.question, () => {
    title.value = questionStore.question.title;
    description.value = questionStore.question.description;
    tags.value = questionStore.question.tags;
    difficulty.value = questionStore.question.difficulty;
    loading.value = false;
  })
})
</script>

<template> 
  <div>
    <a-skeleton :loading="loading" :paragraph="{ rows: 1 }" :title="false" active>
      <h1 class="question-title">{{ title }}</h1>
      <div class="question-info">
        <a-tag v-if="difficulty === 'hard'" color="error">困难</a-tag>
        <a-tag v-else-if="difficulty === 'easy'" color="success">简单</a-tag>
        <a-tag v-else-if="difficulty === 'medium'" color="warning">中等</a-tag>
        
        <a-tag v-for="tag in tags" color="processing">{{ tag.tag.name }}</a-tag>
      </div>
    </a-skeleton>
    <a-divider />
    <a-skeleton :loading="loading" :paragraph="{ rows: 12 }" active :title="false">
      <v-md-editor 
        v-model="description" 
        mode="preview"
      />
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
</style>