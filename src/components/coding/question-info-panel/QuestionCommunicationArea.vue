<template>
  <div class="communication-area">
    <Comment comment-type="question" :targetID="questionID"/>
  </div>
</template>

<script setup>
import Comment from '@/components/comment/Comment.vue';
import { useQuestionStore } from '@/stores';

const questionStore = useQuestionStore();
const questionID = questionStore.question.id
</script>

<style scoped>
.communication-area {
  padding: 15px;
}
</style>
