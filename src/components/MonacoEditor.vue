<script setup>
import { onMounted, watch, onUnmounted } from "vue";
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
  editorContainerID: String,
  readOnly: Boolean,
})

let editorInstance = null; // 保存编辑器实例的引用
const editorContainerID = props.editorContainerID || 'monaco-editor-container'

onMounted(() => {
  editorInstance = monaco.editor.create(document.getElementById(editorContainerID), {
    automaticLayout: true,  // 窗口自适应
    value: code.value,
    language: language.value,
    theme: props.theme,
    fontSize: props.fontSize,
    minimap: { enabled: false },
    scrollbar: {
      vertical: 'hidden'
    },
    readOnly: props.readOnly || false,
  });
  // 编辑器内容改变事件
  editorInstance.onDidChangeModelContent(() => {
    code.value = editorInstance.getValue();
  })
  // 监听 language 变化，变化之后修改编辑器的语言类型
  watch(language, new_language => {
    monaco.editor.setModelLanguage(editorInstance.getModel(), new_language);  // 更新编辑器语言类型
    editorInstance.setValue(code.value)  // 更新编辑器代码
  })

  // 监听 code 变化，变化之后修改编辑器的代码
  watch(code, newCode => {
    // 避免由编辑器内部修改触发的 watch 回调（可选优化）
    if (editorInstance && newCode !== editorInstance.getValue()) {
        editorInstance.setValue(newCode || ''); // 确保是字符串
    }
  }, { flush: 'post' }); // 在 DOM 更新后执行，确保编辑器已就绪
})

onUnmounted(() => {
  if (editorInstance) {
    editorInstance.dispose();
  }
})
</script>

<template>
  <div :id="editorContainerID" style="width: 100%; height: 50vh;z-index: -1;"></div>
</template>
