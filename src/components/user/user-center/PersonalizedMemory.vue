<template>
  <div class="personalized-memory">
    <div v-if="memoryList.length > 0" style="text-align: center;">
      <span style="font-weight: bold;">
        个性化记忆
        <a-tooltip>
          <template #title>
            在与智能刷题助手对话时，系统会根据对话内容总结相关记忆并保存。同时会将记忆发送给智能刷题助手，使得它的回答更加符合用户需求。
          </template>
          <a-button shape="circle" size="small" type="text">
            <template #icon>
              <QuestionCircleOutlined />
            </template> 
          </a-button>
        </a-tooltip>
      </span>
    </div>
    <!-- 记忆列表 -->
    <div v-if="memoryList.length > 0" class="memory-list">
      <div 
        v-for="memory in memoryList" 
        :key="memory.id" 
        class="memory-item"
      >
        <a-card hoverable>
          <div class="memory-header">
            <a-tag :color="getTagColor(memory.type)">{{ getTypeText(memory.type) }}</a-tag>
            <span class="memory-date">{{ formatDate(memory.updated_at) }}</span>
          </div>
          <div class="memory-content">{{ memory.content }}</div>
          <div class="memory-actions">
            <a-popconfirm
              title="确定要删除这条记忆吗？"
              ok-text="确定"
              cancel-text="取消"
              @confirm="deleteMemoryItem(memory.id)"
            >
              <a-button type="primary" danger size="small">删除</a-button>
            </a-popconfirm>
          </div>
        </a-card>
      </div>
    </div>
    <!-- 空状态 -->
    <div v-else class="empty-state">
      <a-empty description="暂无个性化记忆内容" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { getMemoryList, deleteMemory } from '@/http';
import { message } from 'ant-design-vue';
import { QuestionCircleOutlined } from '@ant-design/icons-vue';

// 记忆列表
const memoryList = ref([]);

// 获取记忆列表
const fetchMemoryList = async () => {
  try {
    const response = await getMemoryList();
    memoryList.value = response.data.memories || [];
  } catch (error) {
    console.error('获取记忆列表失败:', error);
    message.error('获取记忆列表失败');
  }
};

// 删除记忆
const deleteMemoryItem = async (id) => {
  try {
    await deleteMemory(id);
    // 从列表中移除已删除的项
    memoryList.value = memoryList.value.filter(item => item.id !== id);
    message.success('删除成功');
  } catch (error) {
    console.error('删除记忆失败:', error);
    message.error('删除失败');
  }
};

// 获取标签颜色
const getTagColor = (type) => {
  switch (type) {
    case 'level':
      return 'blue';
    case 'ability':
      return 'green';
    case 'preference':
      return 'red';
    default:
      return 'default';
  }
};

// 将英文类型转换为中文
const getTypeText = (type) => {
  switch (type) {
    case 'level':
      return '水平';
    case 'ability':
      return '能力';
    case 'preference':
      return '偏好';
    default:
      return type;
  }
};

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

onMounted(() => {
  fetchMemoryList();
});
</script>

<style scoped>
.personalized-memory {
  padding: 10px;
}
.memory-list {
  margin-top: 10px;
}
.memory-item {
  margin-bottom: 10px;
}
.memory-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.memory-content {
  margin-bottom: 12px;
  color: #333;
}
.memory-actions {
  text-align: right;
}
.empty-state {
  text-align: center;
}
</style>