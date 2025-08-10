<script setup>
import { ref } from 'vue'
import Terminal from './Terminal.vue';
import CodeEditor from './CodeEditor.vue';

// 上方面板高度百分比，默认70%
const topHeight = ref(70)
const isDragging = ref(false)

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
</script>

<template>
  <div id="workspace">
    <div class="panel top-panel" :style="{ height: topHeight + '%' }">
      <CodeEditor />
    </div>
    
    <!-- 水平拖拽条 -->
    <div class="horizontal-resizer" @mousedown="startDrag"></div>
    
    <div class="panel bottom-panel" :style="{ height: (100 - topHeight) + '%' }">
      <Terminal />
    </div>
  </div>
</template>

<style scoped>
#workspace {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.panel {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.horizontal-resizer {
  height: 2px;
  width: 100%;
  cursor: row-resize;
  position: relative;
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
</style>