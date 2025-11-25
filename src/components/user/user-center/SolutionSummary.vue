<template>
  <div class="solution-summary">
    <div class="content">
      <a-progress 
        type="dashboard"
        class="progress-font"
        :percent="80" 
        strokeColor="#52c41a"
        :format="percent => pregressFormat(percent, 'easy')"
      />
      <a-progress 
        type="dashboard"
        class="progress-font"
        :percent="70" 
        strokeColor="#faad14"
        :format="percent => pregressFormat(percent, 'medium')"
      />
      <a-progress 
        type="dashboard" 
        class="progress-font"
        :percent="67" 
        strokeColor="#ff4d4f"
        :format="percent => pregressFormat(percent, 'hard')"
      />
    </div>
  </div>
</template>

<script setup>
const difficultyMappiing = {
  easy: "简单",
  medium: "中等",
  hard: "困难"
};
const pregressFormat = (percent, difficulty) => {
  return `${difficultyMappiing[difficulty]} ${percent} / 100`;
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
