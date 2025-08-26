<script setup>
import { ref, computed, watch } from "vue";
import MonacoEditor from "@/components/MonacoEditor.vue";
import { 
  EditTwoTone,
  PlayCircleTwoTone, 
  UploadOutlined
} from "@ant-design/icons-vue";
import { useQuestionStore } from '@/stores';


const questionStore = useQuestionStore();

const currentLanguage = ref("python");
const theme = ref("vs");
const languageValueMapping = {
  "Python": "python",
  "JavaScript": "javascript",
  "C++": "cpp",
  "Java": "java",
  "C": "c",
  "Golang": "go"
}

// 该题目支持的编程语言，需要从后端获取
const validLanguages = computed(() => {
  if (!questionStore.question || !questionStore.question.solving_frameworks) {
    return []
  }
  return questionStore.question.solving_frameworks.map(lang => {
    return {
      name: lang.language.name,
      value: languageValueMapping[lang.language.name]
    }
  })
})

// 有效编程语言对应的解题框架，需要从后端获取
const solvingFramework = ref("");
const solvingFrameworks = computed(() => {
  if (!questionStore.question || !questionStore.question.solving_frameworks) {
    return {}
  }
  const result = {}
  questionStore.question.solving_frameworks.forEach(lang => {
    const key = languageValueMapping[lang.language.name]
    const value = lang.code_framework
    result[key] = value
  })
  return result
})

watch(solvingFrameworks, newFrameworks => {
  solvingFramework.value = newFrameworks[currentLanguage.value] || "";
});

const submit = submitType => {
  console.log(solvingFramework.value)
}
</script>

<template>
  <div id="code-editor">
    <div class="code-editor-header">
      <span style="margin-left: 15px;font-size: 16px;font-weight: bold;">
        <EditTwoTone />
        代码编辑器
      </span>
      <a-select 
        v-model:value="currentLanguage" 
        style="margin-left: 20px;width: 100px;"
        size="small"
        :options="validLanguages"
        :field-names="{ label: 'name', value: 'value' }"
        @select="v => { solvingFramework = solvingFrameworks[v] }"
      />
      <a-button type="default" style="margin-left: auto;" @click="submit('test')">
        <PlayCircleTwoTone />测试
      </a-button>
      <a-button type="primary" style="margin: 0 15px 0 10px;" @click="submit('submit')">
        <UploadOutlined />提交
      </a-button>
    </div>
    <a-divider style="margin: 0 0 20px 0;"/>
    <div style="margin-top: 10px;">
      <MonacoEditor
        v-model:code="solvingFramework"
        v-model:language="currentLanguage"
        :theme="theme"
        fontSize="16px"
      />
    </div>
  </div>
</template>

<style scoped>
.code-editor-header {
  height: 45px;
  display: flex;
  align-items: center;
}
</style>
