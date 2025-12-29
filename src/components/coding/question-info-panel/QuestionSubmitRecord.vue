<template>
  <div id="submit-record">
    <a-skeleton :loading="submitRecordTableLoading" :paragraph="{ rows: 15 }" active :title="false">
      <a-table
        :columns="submitRecordColumns"
        :dataSource="submitRecordDataSource"
        :pagination="false"
        :customRow="onClickRow"
        size="small"
        bordered
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'passStatus'">
            <CheckCircleOutlined v-if="record.pass_test_quantity === record.total_test_quantity" style="color: #52c41a;"/>
            <CloseCircleOutlined v-else style="color: red;"/>
          </template>
          <template v-else-if="column.dataIndex === 'max_time_consumed'">
            <span>{{ record.max_time_consumed }}ms</span>
          </template>
          <template v-else-if="column.dataIndex === 'max_memory_consumed'">
            <span>{{ record.max_memory_consumed }}MB</span>
          </template>
        </template>
      </a-table>
    </a-skeleton>
    <a-modal 
      v-model:open="open" 
      title="提交记录概览"
      :footer="null"
      width="55%"
      style="max-height: 80vh;"
      :destroyOnClose="true"
      :maskClosable="false"
      @cancel="closeModal"
    >
      <div class="modal-content">
        <a-tabs v-model:activeKey="tabActiveKey" size="small">
          <a-tab-pane key="test-status" tab="所有测试用例通过状态">
            <a-table
                :columns="testColumns"
                :dataSource="testDataSource"
                :pagination="false"
                :loading="modalTestTableLoading"
                size="small"
                bordered
              >
                <template #bodyCell="{ column, record }">
                  <template v-if="column.dataIndex === 'is_success'">
                    <CheckCircleOutlined v-if="record.is_success" style="color: #52c41a;"/>
                    <CloseCircleOutlined v-else style="color: red;"/>
                  </template>
                  <template v-else-if="column.dataIndex === 'input_output'">
                    <pre style="text-align: left;">{{ record.test.input_output }}</pre>
                  </template>
                  <template v-else-if="column.dataIndex === 'time_consumed'">
                    <span>{{ record.time_consumed }}ms</span>
                  </template>
                  <template v-else-if="column.dataIndex === 'memory_consumed'">
                    <span>{{ record.memory_consumed }}MB</span>
                  </template>
                </template>
              </a-table>
          </a-tab-pane>
          <a-tab-pane key="last-code" tab="最后提交的代码">
            <monaco-editor
              v-model:code="modalCode"
              v-model:language="modalLanguage"
              theme="vs"
              editorContainerID="editor-submit-record"
              :readOnly="true"
              fontSize="18px"
            />
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { 
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons-vue";

import MonacoEditor from '@/components/MonacoEditor.vue';
import { useQuestionStore } from '@/stores';
import { getSubmitRecord, getLanguageList, getJudgeRecord } from '@/http';

const questionStore = useQuestionStore();
const tabActiveKey = ref('test-status');

const submitRecordTableLoading = ref(true);
const modalTestTableLoading = ref(true);

// 编程语言相关映射表
const languageName2ValueMapping = {
  "Python": "python",
  "JavaScript": "javascript",
  "C++": "cpp",
  "Java": "java",
  "C": "c",
  "Golang": "go"
}
const languageID2NameMapping = {}

// 提交记录表格相关数据
const submitRecordColumns = [
  {
    title: '通过状态',
    dataIndex: 'passStatus',
    align: 'center',
  },
  {
    title: '编程语言',
    dataIndex: 'language',
    align: 'center',
  },
  {
    title: '提交时间',
    dataIndex: 'created_at',
    align: 'center',
  },
  {
    title: '最大消耗时间',
    dataIndex: "max_time_consumed",
    align: 'center',
  },
  {
    title: '最大消耗内存',
    dataIndex: 'max_memory_consumed',
    align: 'center',
  },
  {
    title: '提交类型',
    dataIndex: 'type',
    align: 'center',
  }
];
const submitRecordDataSource = ref([])

// Modal 对话框相关数据
const open = ref(false)
const testColumns = [
  {
    title: '原始输入输出',
    dataIndex: 'input_output',
    align: 'center'
  },
  {
    title: '消耗时间',
    dataIndex: 'time_consumed',
    align: 'center',
  },
  {
    title: '消耗内存',
    dataIndex: 'memory_consumed',
    align: 'center',
  },
  {
    title: '预期结果',
    dataIndex: 'criterion',
    align: 'center',
  },
  {
    title: '实际结果',
    dataIndex: 'answer',
    align: 'center',
  },
  {
    title: '代码运行状态',
    dataIndex: 'result',
    align: 'center',
  },
  {
    title: '通过状态',
    dataIndex: 'is_success',
    align: 'center',
  },
]
const modalCode = ref("")
const modalLanguage = ref("")
const testDataSource = ref([])
const closeModal = () => {
  testDataSource.value = []  // 清空上次的数据
  modalTestTableLoading.value = true
}

onMounted(async () => {
  const questionID = questionStore.question.id;
  try {
    const tasks = Promise.all([getLanguageList(), getSubmitRecord(null, questionID)])
    const [languageListResponse, submitRecordResponse] = await tasks
    const submitRecords = submitRecordResponse.data.data
    const languageList = languageListResponse.data.data
    languageList.forEach(language => {
      languageID2NameMapping[language.id] = language.name
    })
    submitRecords.forEach(record => {
      record.language = languageID2NameMapping[record.language_id]
    })
    submitRecords.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    submitRecordDataSource.value = submitRecords
  } finally {
    submitRecordTableLoading.value = false
  }
});

const onClickRow = record => {
  return {
    onClick: async () => {
      open.value = true;
      modalCode.value = record.code
      modalLanguage.value = languageName2ValueMapping[record.language]
      try {
        const response = await getJudgeRecord(record.id, true)
        testDataSource.value = response.data.data
      } finally {
        modalTestTableLoading.value = false
      }
    },
    onMouseenter: () => {
      document.body.style.cursor = 'pointer';
    },
    onMouseleave: () => {
      document.body.style.cursor = '';
    }
  }
}
</script>

<style scoped>
#submit-record {
  padding: 15px;
}
.modal-content :deep(.ant-table-tbody) td {
  white-space: normal;
  word-wrap: break-word;
  max-width: 150px; /* 可选：设置最大宽度 */
}

.modal-content pre {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 10px;
}
</style>
