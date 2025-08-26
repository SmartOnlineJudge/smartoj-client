<script setup>
import { ref } from 'vue';
import { 
  ProfileTwoTone, 
  MessageTwoTone, 
  ExperimentTwoTone,
  PieChartTwoTone,
  FileTextTwoTone
} from '@ant-design/icons-vue';
import { useQuestionStore } from '@/stores';

const questionStore = useQuestionStore()

const radioValue = ref('description');
</script>

<template>
  <div id="question-description-main">
    <div class="question-description-header">
      <span style="margin-left: 15px;font-size: 16px;font-weight: bold;">
        <FileTextTwoTone />
        题目信息面板
      </span>
    </div>
    <a-divider style="margin: 0 0 10px 0;"/>
    <div id="question-description-title">
      <a-radio-group v-model:value="radioValue" button-style="solid">
        <a-radio-button value="description">
          <ProfileTwoTone />
          题目描述
        </a-radio-button>
        <a-radio-button value="communication">
          <MessageTwoTone />
          讨论区
        </a-radio-button>
        <a-radio-button value="solving">
          <ExperimentTwoTone />
          题解区
        </a-radio-button>
        <a-radio-button value="history">
          <PieChartTwoTone />
          提交历史
        </a-radio-button>
      </a-radio-group>
    </div>
    <div id="question-description-content">
      <div v-if="radioValue === 'description'">
        <h1 class="question-title">{{ questionStore.question.title }}</h1>
        <div class="question-info">
          <a-tag v-if="questionStore.question.difficulty === 'hard'" color="error">困难</a-tag>
          <a-tag v-else-if="questionStore.question.difficulty === 'easy'" color="success">简单</a-tag>
          <a-tag v-else color="warning">中等</a-tag>
          
          <a-tag v-for="tag in questionStore.question.tags" color="processing">{{ tag.tag.name }}</a-tag>
        </div>
        <a-divider />
        <v-md-editor 
          v-model="questionStore.question.description" 
          mode="preview"
        />
      </div>
      <div v-else-if="radioValue === 'communication'">
        讨论区
      </div>
      <div v-else-if="radioValue === 'solving'">
        题解区
      </div>
      <div v-else-if="radioValue === 'history'">
        提交历史
      </div>
    </div>
  </div>
</template>

<style scoped>
.question-description-header {
  height: 45px;
  display: flex;
  align-items: center;
}

#question-description-title {
  width: 100%;
  /* font-weight: bold; */
}

/* 让单选按钮组使用flex布局 */
#question-description-title :deep(.ant-radio-group) {
  display: flex;
  width: 100%;
}

/* 让每个单选按钮等分宽度 */
#question-description-title :deep(.ant-radio-button-wrapper) {
  flex: 1;
  text-align: center;
  /* line-height: 38px; */
  /* height: 40px; */
}

#question-description-content {
  padding: 17px;
}

#question-description-content .question-title {
  margin-top: 2px;
  margin-bottom: 14px;
  font-size: x-large
}

#question-description-content .question-info {
  display: flex;
  align-items: center;
}

#question-description-content :deep(.github-markdown-body) {
  padding: 0;
}
</style>
