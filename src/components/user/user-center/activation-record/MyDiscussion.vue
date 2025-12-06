<template>
  <div class="my-discussion">
    <a-skeleton :loading="loading" :paragraph="{ rows: 5 }" active>
      <div v-if="comments.length > 0">
        <div v-for="comment in comments" :key="comment.id" class="comment-item">
          <div class="comment-content">{{ comment.content }}</div>
          <div class="comment-meta">
            <span class="meta-item">
              <MessageOutlined /> 类型: {{ comment.type === 'solution' ? '题解' : '题目' }}
            </span>
            <span class="meta-item">
              <CommentOutlined /> 回复: {{ comment.reply_count }}
            </span>
            <span class="meta-item">
              <CalendarOutlined /> 创建时间: {{ comment.created_at }}
            </span>
            <div class="comment-actions">
              <a-popconfirm title="确定要删除这条评论吗？" @confirm="deleteCommentHandler(comment.id)">
                <a-button type="link" danger>删除</a-button>
              </a-popconfirm>
            </div>
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
import { MessageOutlined, CommentOutlined, CalendarOutlined } from '@ant-design/icons-vue';
import { getUserComments, deleteComment } from '@/http';

const loading = ref(false);
const comments = ref([]);
const currentPage = ref(1);
const pageSize = 5;
const total = ref(0);

// 获取评论列表
const fetchComments = async () => {
  loading.value = true;
  try {
    const response = await getUserComments(currentPage.value, pageSize);
    comments.value = response.data.data.results || [];
    total.value = response.data.data.total || 0;
  } catch (error) {
    message.error('获取评论列表失败: ' + error.message);
  } finally {
    loading.value = false;
  }
};

// 处理分页变化
const handlePageChange = (page) => {
  currentPage.value = page;
  fetchComments();
};

// 删除评论
const deleteCommentHandler = async (commentId) => {
  try {
    await deleteComment(commentId);
    message.success('删除成功');
    // 重新获取数据
    fetchComments();
  } catch (error) {
    message.error('删除失败: ' + error.message);
  }
};

onMounted(() => {
  fetchComments();
});
</script>

<style scoped>
.comment-item {
  border-bottom: 1px solid #f0f0f0;
  padding: 10px 0;
}
.comment-content {
  margin-bottom: 8px;
  white-space: pre-wrap;
  word-break: break-all;
}
.comment-meta {
  display: flex;
  gap: 16px;
  color: #666;
  align-items: center;
  flex-wrap: wrap;
}
.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}
.comment-actions {
  margin-left: auto;
}
.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  margin-bottom: 10px;
}
</style>