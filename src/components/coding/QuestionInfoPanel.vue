<script setup>
import { ref, watch, computed, defineAsyncComponent } from 'vue';
import { 
  ProfileOutlined, 
  MessageOutlined, 
  ExperimentOutlined,
  PieChartOutlined,
  FileTextTwoTone
} from '@ant-design/icons-vue';
import { useQuestionStore, useUserStore } from '@/stores';

const QuestionDescription = defineAsyncComponent(() => import('@/components/coding/question-info-panel/QuestionDescription.vue'));
const QuestionSubmitRecord = defineAsyncComponent(() => import('@/components/coding/question-info-panel/QuestionSubmitRecord.vue'));
const QuestionCommunicationArea = defineAsyncComponent(() => import('@/components/coding/question-info-panel/QuestionCommunicationArea.vue'));
const QuestionSolutionArea = defineAsyncComponent(() => import('@/components/coding/question-info-panel/QuestionSolutionArea.vue'));

const questionStore = useQuestionStore()
const userStore = useUserStore()

const radioValue = ref('description');
const submitRecordKey = ref(0); // 专门用于控制提交记录组件重新渲染的key
const components = {
  description: QuestionDescription,
  communication: QuestionCommunicationArea,
  submitRecord: QuestionSubmitRecord,
  solution: QuestionSolutionArea
}
const currentComponent = computed(() => components[radioValue.value]);

watch(() => questionStore.requireJumpToSolvingHistory, () => {
  radioValue.value = "submitRecord"
  submitRecordKey.value += 1  // 强制 QuestionSubmitRecord 重新渲染
})
</script>

<template>
  <div id="question-info-panel-main">
    <div class="question-info-panel-header">
      <span style="margin-left: 15px;font-size: 16px;font-weight: bold;">
        <FileTextTwoTone />
        题目信息面板
      </span>
    </div>
    <a-divider style="margin: 0 0 10px 0;"/>
    <div class="question-info-panel-title">
      <a-radio-group v-model:value="radioValue" button-style="solid">
        <a-radio-button value="description">
          <ProfileOutlined />
          题目描述
        </a-radio-button>
        <a-radio-button value="communication">
          <MessageOutlined />
          评论区
        </a-radio-button>
        <a-radio-button value="solution">
          <ExperimentOutlined />
          题解区
        </a-radio-button>
        <a-radio-button v-if="userStore.isLogin" value="submitRecord">
          <PieChartOutlined />
          提交记录
        </a-radio-button>
      </a-radio-group>
    </div>
    <div class="question-info-panel-content">
      <KeepAlive>
        <component 
        :is="currentComponent" 
        :key="radioValue === 'submitRecord' ? `submit-record-${submitRecordKey}` : undefined"
      ></component>
      </KeepAlive>
    </div>
  </div>
</template>

<style scoped>
.question-info-panel-header {
  height: 45px;
  display: flex;
  align-items: center;
}

.question-info-panel-title {
  width: 100%;
}

/* 让单选按钮组使用flex布局 */
.question-info-panel-title :deep(.ant-radio-group) {
  display: flex;
  width: 100%;
}

/* 让每个单选按钮等分宽度 */
.question-info-panel-title :deep(.ant-radio-button-wrapper) {
  flex: 1;
  text-align: center;
}

.question-info-panel-content :deep(.github-markdown-body) {
  padding: 0;
}
</style>
