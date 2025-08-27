<script setup>
import { ref, onMounted, watch } from "vue";
import { 
  EditTwoTone,
  PlayCircleTwoTone, 
  UploadOutlined
} from "@ant-design/icons-vue";
import MonacoEditor from "@/components/MonacoEditor.vue";
import { useQuestionStore } from '@/stores';
import { 
  judgeQuestion, 
  getSubmitRecord, 
  getJudgeRecord, 
  getLanguageList 
} from "@/http";

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
// "python" => 4
let languageIDMapping = {}
// 提交、测试按钮的状态
const testButtonLoading = ref(false)
const submitButtonLoading = ref(false)
const testButtonDisabled = ref(false)
const submitButtonDisabled = ref(false)
// 当前题目有效的编程语言
const validLanguages = ref([])
// 有效编程语言对应的解题框架
const solvingFrameworks = ref({})
// 当前正在使用的解题框架
const solvingFramework = ref("");

onMounted(() => {
  watch(() => questionStore.question, () => {
    let _validLanguages = []
    let _solvingFrameworks = {}
    questionStore.question.solving_frameworks.forEach(lang => {
      let languageName = lang.language.name
      _validLanguages.push({
        name: languageName,
        value: languageValueMapping[languageName]
      })
      const key = languageValueMapping[languageName]
      const value = lang.code_framework
      _solvingFrameworks[key] = value
    })
    validLanguages.value = _validLanguages
    solvingFrameworks.value = _solvingFrameworks
    // 页面首次加载的时候需要先更新解题框架
    solvingFramework.value = _solvingFrameworks[currentLanguage.value] || "";
  })
  getLanguageList().then(response => {
    const languageList = response.data.data
    languageList.forEach(lang => {
      languageIDMapping[languageValueMapping[lang.name]] = lang.id
    })
  })
})

// 提交代码
const submit = async judgeType => {
  let loadingStaus = judgeType === "test" ? testButtonLoading : submitButtonLoading
  let disabledStaus = judgeType === "test" ? submitButtonDisabled : testButtonDisabled
  loadingStaus.value = true
  disabledStaus.value = true
  const questionID = questionStore.question.id
  const languageID = languageIDMapping[currentLanguage.value]
  const code = solvingFramework.value
  try {
    let response = await judgeQuestion(questionID, code, languageID, judgeType)
    const submitRecordID = response.data.data.submit_record_id
    while (true) {
      response = await getSubmitRecord(submitRecordID)
      if (response.data.data.status !== 0) {
        break
      }
    }
    response = await getJudgeRecord(submitRecordID)
    const judgeRecords = response.data.data
    // 存储判题结果
    questionStore.setJudgeRecords(judgeRecords)
    questionStore.setJudgeType(judgeType)
  } finally {
    loadingStaus.value = false
    disabledStaus.value = false
  }
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
      <a-button 
        type="default" 
        style="margin-left: auto;" 
        @click="() => { submit('test') }"
        :loading="testButtonLoading"
        :disabled="testButtonDisabled"
      >
        <PlayCircleTwoTone />测试
      </a-button>
      <a-button 
        type="primary" 
        style="margin: 0 15px 0 10px;" 
        @click="() => { submit('submit') }"
        :loading="submitButtonLoading"
        :disabled="submitButtonDisabled"
      >
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
