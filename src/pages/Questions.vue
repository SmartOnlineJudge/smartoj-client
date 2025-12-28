<script setup>
import QuestionList from "@/components/questions/QuestionList.vue"
import HotQuestions from "@/components/questions/HotQuestions.vue"
import RankingList from "@/components/questions/RankingList.vue"

</script>

<template>
  <div class="questions-container">
    <div class="questions">
      <h2 style="margin: 0;">算法题库</h2>
      <QuestionList/>
    </div>
    <div class="side-content">
      <RankingList />
      <HotQuestions />
    </div>
  </div>
</template>

<style scoped>
.questions-container {
  display: flex;
  margin: 20px auto 10px auto;
  width: 75vw;
}
.questions {
  background-color: white;
  width: 80%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 15px 20px;
}
.side-content {
  margin-left: 15px;
}
</style>