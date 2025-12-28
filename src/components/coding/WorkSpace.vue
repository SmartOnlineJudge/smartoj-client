<script setup>
import { ref, watch, defineAsyncComponent } from 'vue'

const SolvingAssistantAgent = defineAsyncComponent(() => import('@/components/coding/SolvingAssistantAgent.vue'));
const Terminal = defineAsyncComponent(() => import('@/components/coding/Terminal.vue'));
const CodeEditor = defineAsyncComponent(() => import('@/components/coding/CodeEditor.vue'));

// 上方面板高度百分比，默认70%
const topHeight = ref(70)
const isDragging = ref(false)
// 垂直拖拽相关变量
const codingWithTerminalWidth = ref(100)
const isVerticalDragging = ref(false)
// 打开智能刷题助手面板
const openSolvingAssistant = ref(false)

// 监听openSolvingAssistant变化，调整布局
watch(openSolvingAssistant, (newValue) => {
  if (newValue) {
    // 打开时恢复原来的宽度
    codingWithTerminalWidth.value = 60
  } else {
    // 关闭时codingWithTerminal占满整个宽度
    codingWithTerminalWidth.value = 100
  }
})

// 开始拖拽
const startDrag = (e) => {
  isDragging.value = true
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
  e.preventDefault()
}
// 拖拽过程中
const onDrag = (e) => {
  if (!isDragging.value) return
  
  const container = document.getElementById('workspace')
  const rect = container.getBoundingClientRect()
  const y = e.clientY - rect.top
  const percentage = (y / rect.height) * 100
  
  // 限制拖拽范围在10%到90%之间
  topHeight.value = Math.min(Math.max(percentage, 1), 99)
}
// 停止拖拽
const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}
// 开始垂直拖拽
const startVerticalDrag = (e) => {
  isVerticalDragging.value = true
  document.addEventListener('mousemove', onVerticalDrag)
  document.addEventListener('mouseup', stopVerticalDrag)
  e.preventDefault()
}
// 垂直拖拽过程中
const onVerticalDrag = (e) => {
  if (!isVerticalDragging.value) return
  
  const container = document.getElementById('workspace')
  const rect = container.getBoundingClientRect()
  const x = e.clientX - rect.left
  const percentage = (x / rect.width) * 100
  
  // 限制拖拽范围在 20% 到 80% 之间
  codingWithTerminalWidth.value = Math.min(Math.max(percentage, 20), 80)
}
// 停止垂直拖拽
const stopVerticalDrag = () => {
  isVerticalDragging.value = false
  document.removeEventListener('mousemove', onVerticalDrag)
  document.removeEventListener('mouseup', stopVerticalDrag)
}
</script>

<template>
  <div id="workspace">
    <div class="coding-with-terminal" :style="{ width: codingWithTerminalWidth + '%' }">
      <div class="panel top-panel" :style="{ height: topHeight + '%' }">
        <CodeEditor v-model:openSolvingAssistant="openSolvingAssistant"/>
      </div>
      
      <!-- 水平拖拽条 -->
      <div class="horizontal-resizer" @mousedown="startDrag"></div>
      
      <div class="panel bottom-panel" :style="{ height: (100 - topHeight) + '%' }">
        <Terminal />
      </div>
    </div>

    <!-- 垂直拖拽条 -->
    <div class="vertical-resizer" @mousedown="startVerticalDrag" v-show="openSolvingAssistant"></div>

    <div class="chat" :style="{ width: (100 - codingWithTerminalWidth) + '%' }" v-show="openSolvingAssistant">
      <SolvingAssistantAgent :is-open-chat="openSolvingAssistant"/>
    </div>
  </div>
</template>

<style scoped>
#workspace {
  display: flex;
  height: 100%;
  flex-wrap: nowrap;
  align-items: stretch;
}
.coding-with-terminal {
  display: flex;
  flex-direction: column;
}
.chat {
  width: 40%;
}
.panel {
  width: 100%;
  overflow: hidden;
}
.top-panel,
.bottom-panel {
  overflow: auto;
}
.horizontal-resizer {
  height: 2px;
  width: 100%;
  cursor: row-resize;
  position: relative;
  flex-shrink: 0;
}
.horizontal-resizer::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 8px;
  width: 100%;
  background-color: #f5f5f5;
  transition: background-color 0.3s;
}
.horizontal-resizer::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 2px;
  background-color: #c0c0c0;
  border-radius: 1px;
}
.horizontal-resizer:hover::after {
  background-color: #1677ff;

}

.vertical-resizer {
  width: 8px;
  height: 100%;
  cursor: col-resize;
  position: relative;
  flex-shrink: 0;
  align-self: stretch;
}

.vertical-resizer::before {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 100%;
  background-color: #f5f5f5;
  transition: background-color 0.3s;
}

.vertical-resizer::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 2px;
  height: 30px;
  background-color: #c0c0c0;
  border-radius: 1px;
}

.vertical-resizer:hover::after {
  background-color: #1677ff;
}
</style>