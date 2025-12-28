<script setup>
import QuestionList from "@/components/questions/QuestionList.vue"
import HotQuestions from "@/components/questions/HotQuestions.vue"
import RankingList from "@/components/questions/RankingList.vue"

</script>

<template>
  <h2 style="margin-left: 6%">算法题库</h2>
  <div class="questions-container">
    <div class="questions">
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
  flex-wrap: wrap;
  margin: 0 5%;
}

.questions {
  background-color: white;
  width: 65%;
  margin-bottom: 3%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
}

.side-content {
  width: 35%;
}
</style>