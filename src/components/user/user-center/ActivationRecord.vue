<template>
  <div class="content">
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="1" tab="提交记录">
        <SubmitRecord/>
      </a-tab-pane>
      <a-tab-pane key="2" tab="我的题解">
        <MySolution/>
      </a-tab-pane>
      <a-tab-pane key="3" tab="我的讨论">
        <MyDiscussion/>
      </a-tab-pane>
      <a-tab-pane key="4" tab="我创建的题目">
        <MyCreatedQuestion/>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import MyCreatedQuestion from './activation-record/MyCreatedQuestion.vue';
import MyDiscussion from './activation-record/MyDiscussion.vue';
import MySolution from './activation-record/MySolution.vue';
import SubmitRecord from './activation-record/SubmitRecord.vue';

const activeKey = ref('1')
</script>

<style scoped>
.content {
  padding: 0 10px 5px 10px;
}
</style>
