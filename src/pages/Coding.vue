<script setup>
import { ref, onMounted } from 'vue'
import QuestionInfoPanel from '@/components/coding/QuestionInfoPanel.vue';
import WorkSpace from '@/components/coding/WorkSpace.vue';
import { getOnlineSovlingQuestionInfo } from '@/http';
import { useQuestionStore } from '@/stores';
import router from '@/router/index.js';

const props = defineProps({
  questionID: Number
})
const questionStore = useQuestionStore()

onMounted(() => {
  const questionID = props.questionID
  getOnlineSovlingQuestionInfo(questionID).then(response => {
    if (response.data.code === 255) {
      router.push('/404')
      return
    }
    questionStore.setQuestion(response.data.data)
  })
})

// 左侧宽度百分比，默认35%
const leftWidth = ref(35)
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
  
  const container = document.getElementById('coding-content')
  const rect = container.getBoundingClientRect()
  const x = e.clientX - rect.left
  const percentage = (x / rect.width) * 100
  
  // 限制拖拽范围在 20% 到 80% 之间
  leftWidth.value = Math.min(Math.max(percentage, 20), 80)
}

// 停止拖拽
const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}
</script>

<template>
  <div id="coding-content">
    <!-- 问题信息面板 -->
    <div id="question-description" class="panel" :style="{ width: leftWidth + '%' }">
      <QuestionInfoPanel />
    </div>
    
    <!-- 拖拽条 -->
    <div class="resizer" @mousedown="startDrag"></div>
    
    <!-- 工作区（代码编辑器 + 测试用例 + 提交 / 测试按钮） -->
    <div id="work-space" class="panel" :style="{ width: (100 - leftWidth) + '%' }">
      <WorkSpace />
    </div>
  </div>
</template>

<style scoped>
#coding-content {
  display: flex;
  padding-top: 7px;
  height: calc(100vh - 64px);
  width: 100%;
}

.panel {
  height: 100%;
  overflow: auto;
}

#question-description {
  background: white;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
}

#work-space {
  border-radius: 10px;
  background-color: white;
}

.resizer {
  width: 8px;
  height: 100%;
  cursor: col-resize;
  position: relative;
}

.resizer::before {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  height: 100%;
  transition: background-color 0.3s;
}

.resizer::after {
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

.resizer:hover::after {
  background-color: #1677ff;
}

/* 拖拽时的视觉反馈 */
#coding-content.dragging {
  user-select: none;
}
</style>