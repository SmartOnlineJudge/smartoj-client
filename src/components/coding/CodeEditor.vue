<script setup>
import { ref } from "vue";
import MonacoEditor from "@/components/MonacoEditor.vue";
import { 
  EditTwoTone,
  PlayCircleTwoTone, 
  UploadOutlined
 } from "@ant-design/icons-vue";

// 该题目支持的编程语言，需要从后端获取
const validLanguages = [
  {name: "Python", value: "python"},
  {name: "JavaScript", value: "javascript"},
  {name: "C++", value: "cpp"},
  {name: "Java", value: "java"},
  {name: "C", value: "c"},
  {name: "Golang", value: "go"},
]
// 有效编程语言对应的解题框架，需要从后端获取
const solvingFrameworks = {
  python: "print('Hello World')",
  javascript: "console.log('Hello World')",
  cpp: "#include <iostream>\n\nint main() {\n\tstd::cout << \"Hello World\" << std::endl;\n\treturn 0;\n}",
  java: "public class Main {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println(\"Hello World\");\n\t}\n}",
  c: "#include <stdio.h>\n\nint main() {\n\tprintf(\"Hello World\");\n\treturn 0;\n}",
  go: "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tfmt.Println(\"Hello World\")\n}",
}

const currentLanguage = ref("python");
const solvingFramework = ref(solvingFrameworks[currentLanguage.value]);
const theme = ref("vs");
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
      <a-button type="default" style="margin-left: auto;">
        <PlayCircleTwoTone/>测试
      </a-button>
      <a-button type="primary" style="margin: 0 15px 0 10px;">
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
