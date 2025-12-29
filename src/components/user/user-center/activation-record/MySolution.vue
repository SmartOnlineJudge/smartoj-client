<template>
  <div class="my-solution">
    <a-skeleton :loading="loading" :paragraph="{ rows: 5 }" active>
      <div v-if="solutions.length > 0">
        <div v-for="solution in solutions" :key="solution.id" class="solution-item">
          <div class="solution-header">
            <div class="solution-title">
              <a :href="'/coding/' + solution.question.id">
                [{{ solution.question.title }}]
              </a>
              {{ solution.title }}
            </div>
            <div class="solution-actions">
              <a-button type="link" @click="() => { editSolution(solution.question.id) }">修改</a-button>
              <a-popconfirm title="确定要删除这个题解吗？" @confirm="() => { deleteSolutionHandler(solution.id) }">
                <a-button type="link" danger>删除</a-button>
              </a-popconfirm>
            </div>
          </div>
          <div class="solution-meta">
            <span class="meta-item">
              <EyeOutlined /> 浏览: {{ solution.view_count }}
            </span>
            <span class="meta-item">
              <CommentOutlined /> 评论: {{ solution.comment_count }}
            </span>
            <span class="meta-item">
              <CalendarOutlined /> 创建时间: {{ solution.created_at }}
            </span>
          </div>
        </div>
        <div class="pagination">
          <a-pagination
            v-model:current="currentPage"
            :pageSize="pageSize"
            :total="total"
            @change="handlePageChange"
          />
        </div>
      </div>
      <a-empty v-else />
    </a-skeleton>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { EyeOutlined, CommentOutlined, CalendarOutlined } from '@ant-design/icons-vue';
import { getUserSolutions, deleteSolution } from '@/http';

const loading = ref(false);
const solutions = ref([]);
const currentPage = ref(1);
const pageSize = 5;
const total = ref(0);

// 获取题解列表
const fetchSolutions = async () => {
  loading.value = true;
  try {
    const response = await getUserSolutions(currentPage.value, pageSize);
    solutions.value = response.data.data.results || [];
    total.value = response.data.data.total || 0;
  } catch (error) {
    message.error('获取题解列表失败: ' + error.message);
  } finally {
    loading.value = false;
  }
};

// 处理分页变化
const handlePageChange = (page) => {
  currentPage.value = page;
  fetchSolutions();
};

// 删除题解
const deleteSolutionHandler = async (solutionId) => {
  try {
    await deleteSolution(solutionId);
    message.success('删除成功');
    // 重新获取数据
    fetchSolutions();
  } catch (error) {
    message.error('删除失败: ' + error.message);
  }
};

// 修改题解 - 跳转到编辑页面
const editSolution = (questionId) => {
  window.open(`/create-solution/${questionId}`);
};

onMounted(() => {
  fetchSolutions();
});
</script>

<style scoped>
.solution-item {
  border-bottom: 1px solid #f0f0f0;
  padding: 10px 0;
}
.solution-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.solution-title {
  font-size: 16px;
  font-weight: 500;
}
.solution-title a {
  color: #1890ff;
  text-decoration: none;
}
.solution-actions {
  white-space: nowrap;
}
.solution-meta {
  display: flex;
  gap: 16px;
  color: #666;
}
.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}
.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  margin-bottom: 10px;
}
</style>