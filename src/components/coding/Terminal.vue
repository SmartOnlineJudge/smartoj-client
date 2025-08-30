<script setup>
import { ref, watch } from 'vue'
import { 
  CodeTwoTone,
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined
} from "@ant-design/icons-vue";
import { useQuestionStore } from '@/stores';

const questionStore = useQuestionStore();
const tests = ref([]);
const loading = ref(true);

watch(() => questionStore.question, () => {
  const _tests = []
  questionStore.question.tests.forEach(test => {
    _tests.push({test_id: test.id, input_output: test.input_output})
  })
  _tests.sort((a, b) => a.test_id - b.test_id)
  tests.value = _tests
  loading.value = false
})

watch(() => questionStore.judgeID, () => {
  const judgeType = questionStore.judgeType
  let judgeRecords = questionStore.judgeRecords
  if (judgeType === "test") {
    judgeRecords.sort((a, b) => a.test_id - b.test_id)
    judgeRecords.forEach((judgeRecord, i) => {
      tests.value[i].criterion = judgeRecord.criterion
      tests.value[i].result = judgeRecord.result
      tests.value[i].answer = judgeRecord.answer
      tests.value[i].is_success = judgeRecord.is_success
    })
  } else {
    questionStore.incrementRequireJumpToSolvingHistory()  // 通知对应组件进行跳转
  }
})
</script>

<template>
  <div id="terminal">
    <div class="terminal-header">
      <span style="margin-left: 15px;font-size: 16px;font-weight: bold;">
        <CodeTwoTone />
        测试用例
      </span>
    </div>
    <a-divider style="margin: 0 0 15px 0;"/>
    <div class="terminal-tab">
      <div class="test-case">
        <a-skeleton :loading="loading" :paragraph="{ rows: 5 }" :title="false" active>
          <a-collapse accordion>
            <a-collapse-panel v-for="test, i in tests" :key="test.test_id">
              <template #header>
                <span>
                  {{ `测试用例${i + 1}` }}
                  <a-tooltip placement="top">
                    <template #title>
                      <span>你不需要手动构造输入数据，因为判题器会在运行代码的时候自动将必要的参数注入到你的解题函数中。</span>
                    </template>
                    <InfoCircleOutlined/>
                  </a-tooltip>
                </span>
              </template>
              <template #extra>
                <div v-if="test.is_success !== undefined">
                  <CheckCircleOutlined v-if="test.is_success" style="color: #52c41a;"/>
                  <CloseCircleOutlined v-else style="color: red;"/>
                </div>
              </template>
              <span class="test-case-field">原始输入：</span>
              <pre>{{ test.input_output }}</pre>
              <span class="test-case-field">预期结果：</span>
              <pre>{{ test.criterion || "请先运行代码" }}</pre>
              <span class="test-case-field">代码输出：</span>
              <pre>{{ test.answer || "请先运行代码" }}</pre>
              <span class="test-case-field">代码运行状态：</span>
              <pre>{{ test.result || "请先运行代码" }}</pre>
            </a-collapse-panel>
          </a-collapse>
        </a-skeleton>
      </div>
    </div>
  </div>
</template>

<style scoped>
#terminal {
  border-radius: 10px;
}

.terminal-header {
  height: 45px;
  display: flex;
  align-items: center;
}

.terminal-tab {
  margin: 0 15px 0 15px;
}

.terminal-tab .test-case pre {
  margin: 5px 0;
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 10px;
  overflow-x: overlay;
}

.terminal-tab .test-case .test-case-field {
  font-size: 14px;
  font-weight: bold;
}
</style>
