<template>
  <div class="solution-summary">
    <div class="content">
      <a-progress 
        type="dashboard"
        class="progress-font"
        :percent="percents.easy" 
        strokeColor="#52c41a"
        :format="percent => pregressFormat(percent, 'easy')"
      />
      <a-progress 
        type="dashboard"
        class="progress-font"
        :percent="percents.medium" 
        strokeColor="#faad14"
        :format="percent => pregressFormat(percent, 'medium')"
      />
      <a-progress 
        type="dashboard" 
        class="progress-font"
        :percent="percents.hard" 
        strokeColor="#ff4d4f"
        :format="percent => pregressFormat(percent, 'hard')"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue';
import { 
  getPassedCountGroupByDifficulty,
  getQuestionCountGroupByDifficulty
} from '@/http';

const passedCount = ref({})
const questionCount = ref({})

onMounted(async () => {
  const tasks = Promise.all([getPassedCountGroupByDifficulty(), getQuestionCountGroupByDifficulty()])
  const [passedCountResponse, questionCountResponse] = await tasks;
  passedCount.value = passedCountResponse.data.data
  questionCount.value = questionCountResponse.data.data
});

const difficultyMappiing = {
  easy: "简单",
  medium: "中等",
  hard: "困难"
};

// 计算每个难度的比例
const percents = computed(() => ({
  easy: (passedCount.value.easy || 0) / (questionCount.value.easy || 1) * 100,
  medium: (passedCount.value.medium || 0) / (questionCount.value.medium || 1) * 100,
  hard: (passedCount.value.hard || 0) / (questionCount.value.hard || 1) * 100
}));

const pregressFormat = (_, difficulty) => {
  return `${difficultyMappiing[difficulty]} ${passedCount.value[difficulty] || 0} / ${questionCount.value[difficulty] || 0}`;
};
</script>

<style scoped>
.solution-summary {
  display: flex;
  justify-content: center;
  flex-direction: column;
}
.progress-font :deep(.ant-progress-text) {
  font-size: 14px !important;
}
.content {
  display: flex;
  justify-content: space-between;
  width: 90%;
  margin: 0 auto;
}
</style>
