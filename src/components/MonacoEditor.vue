<script setup>
import { onMounted, watch } from "vue";
import * as monaco from 'monaco-editor'

// 定义双向数据流，父组件通过 v-model 来绑定
// 官方文档：https://cn.vuejs.org/guide/components/v-model.html
const code = defineModel('code')
const language = defineModel('language')

// 定义属性描述符，父组件通过 :<描述符名称> 来传递值
// 官方文档：https://cn.vuejs.org/api/sfc-script-setup.html#defineprops-defineemits
const props = defineProps({
  theme: String,
  fontSize: String,
})

onMounted(() => {
  const editor = monaco.editor.create(document.getElementById('monaco-editor-container'), {
    automaticLayout: true,  // 窗口自适应
    value: code.value,
    language: language.value,
    theme: props.theme,
    fontSize: props.fontSize,
    minimap: { enabled: false },
    scrollbar: {
      vertical: 'hidden',
      horizontal: 'hidden'
    }
  });
  // 编辑器内容改变事件
  editor.onDidChangeModelContent(() => {
    code.value = editor.getValue();
  })
  // 监听 language 变化，变化之后修改编辑器的语言类型
  watch(language, new_language => {
    monaco.editor.setModelLanguage(editor.getModel(), new_language);  // 更新编辑器语言类型
    editor.setValue(code.value)  // 更新编辑器代码
  })
})
</script>

<template>
  <div id="monaco-editor-container" style="width: 100%; height: 50vh;z-index: -1;"></div>
</template>
