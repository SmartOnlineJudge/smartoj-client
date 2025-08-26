<script setup>
import { computed } from 'vue'
import { 
  CodeTwoTone,
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined
} from "@ant-design/icons-vue";
import { useQuestionStore } from '@/stores';

const questionStore = useQuestionStore();
// const tests = [
//   {test_id: 1, input_output: "5\n1 2 3 4 5\n10", criterion: null, answer: null},
//   {test_id: 2, input_output: "5\n1 2 3 4 5\n10", criterion: null, answer: null},
//   {test_id: 3, input_output: "5\n1 2 3 4 5\n10", criterion: null, answer: null}
// ]
const tests = computed(() => {
  if (!questionStore.question || !questionStore.question.tests) {
    return []
  }
  return questionStore.question.tests.map(test => {
    return {
      test_id: test.id,
      input_output: test.input_output,
    }
  })
})
</script>

<template>
  <div id="terminal">
    <div class="terminal-header">
      <span style="margin-left: 15px;font-size: 16px;font-weight: bold;">
        <CodeTwoTone />
        控制台
      </span>
    </div>
    <a-divider style="margin: 0 0 15px 0;"/>
    <div class="terminal-tab">
      <div class="test-case">
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
              <CheckCircleOutlined style="color: #52c41a;"/>
              <CloseCircleOutlined style="color: red;"/>
            </template>
            <span class="test-case-field">原始输入：</span>
            <pre>{{ test.input_output }}</pre>
            <span class="test-case-field">预期结果：</span>
            <pre>{{ test.criterion || "请先运行代码" }}</pre>
            <span class="test-case-field">代码输出：</span>
            <pre>{{ test.answer || "请先运行代码" }}</pre>
          </a-collapse-panel>
        </a-collapse>
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
}

.terminal-tab .test-case .test-case-field {
  font-size: 14px;
  font-weight: bold;
}
</style>
