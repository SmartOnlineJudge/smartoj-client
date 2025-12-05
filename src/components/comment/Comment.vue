<template>
  <div id="comment">
    <div class="new-comment">
      <div class="comment-title">
        <a-skeleton :loading="pullCommentLoading" :paragraph="{ rows: 1 }" :title="false" active>
          <span class="comment-statistics"> <CommentOutlined /> 评论 · {{ commentTotal }}</span>
        </a-skeleton>
      </div>
      <div class="input-comment">
        <div class="input-comment-box" :class="{ 'focused': isFocused }">
          <a-textarea 
            :auto-size="{ minRows: 3, maxRows: 6 }"
            v-model:value="inputComment"
            placeholder="请输入评论……" 
            :maxlength="inputMaxLength"
            :bordered="false"
            style="font-size: 16px;"
            @focus="isFocused = true"
            @blur="isFocused = false"
          />
          <div class="comment-controller">
            <span style="color: gray;">{{ inputComment.length }} / {{ inputMaxLength }}</span>
            <a-button 
              type="primary" 
              style="margin-left: auto;" 
              :disabled="inputComment.length === 0"
              @click="createCommentHandler"
              :loading="publishCommentLoading"
            >发布</a-button>
          </div>
        </div>
      </div>
    </div>
    <div class="comment-list">
      <a-skeleton :loading="pullCommentLoading" :paragraph="{ rows: 7 }" :title="false" active>
        <div v-if="commentList.length > 0">
          <a-skeleton :loading="paginationLoading" :paragraph="{ rows: 5 }" :title="false" active>
            <CommentItem
              v-for="comment in commentList"
              :key="comment.id"
              :avatar="MINIO_URL + comment.user.user_dynamic.avatar"
              :username="comment.user.user_dynamic.name"
              :created-at="comment.created_at"
              :content="comment.content"
              :reply-count="comment.reply_count"
              :parent-comment-id="comment.id"
              :comment-type="props.commentType"
              :targetID="props.targetID"
            />
          </a-skeleton>
          <a-pagination 
            v-model:current="currentPage"
            :page-size="pageSize"
            :total="pageTotal" 
            show-less-items
            @change="pageChangeHandler"
          />
        </div>
        <a-empty v-else/>
      </a-skeleton>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { CommentOutlined } from "@ant-design/icons-vue";
import { message } from 'ant-design-vue';

import CommentItem from './CommentItem.vue';
import { getRootComments, createComment, getCommentCount } from '@/http';
import { useUserStore } from '@/stores';

const props = defineProps({
  commentType: {
    type: String,
    default: 'question'
  },
  targetID: {
    type: Number,
    default: null
  }
})
const userStore = useUserStore()
const MINIO_URL = import.meta.env.VITE_MINIO_URL
const inputComment = ref('');
const inputMaxLength = 200
const isFocused = ref(false)
const currentPage = ref(1)
const pageTotal = ref(0)
const commentTotal = ref(0)
const pageSize = 5
const commentList = ref([])
const publishCommentLoading = ref(false)
const pullCommentLoading = ref(false)
const paginationLoading = ref(false)

onMounted(async () => {
  pullCommentLoading.value = true
  const tasks = Promise.all([
    getCommentCount(props.targetID, props.commentType),
    getRootComments(props.targetID, props.commentType, 1, pageSize)
  ])
  const [commentTotalResponse, commentListResponse] = await tasks;
  const responseData = commentListResponse.data.data;
  commentList.value = responseData.results;
  pageTotal.value = responseData.total;
  pullCommentLoading.value = false
  commentTotal.value = commentTotalResponse.data.data.count;
})
const pageChangeHandler = async page => {
  paginationLoading.value = true
  const response = await getRootComments(props.targetID, props.commentType, page, pageSize)
  const responseData = response.data.data;
  commentList.value = responseData.results;
  paginationLoading.value = false
}
const createCommentHandler = async () => {
  publishCommentLoading.value = true
  const response = await createComment(inputComment.value, props.commentType, props.targetID)
  const responseData = response.data.data;
  message.success('评论成功！')
  commentList.value.unshift({
    id: responseData.id,
    content: inputComment.value,
    user: {
      user_dynamic: {
        name: userStore.user.name,
        avatar: userStore.user.avatar
      }
    },
    created_at: responseData.created_at,
    reply_count: 0
  })
  commentTotal.value += 1
  inputComment.value = ''
  publishCommentLoading.value = false
}
</script>

<style scoped> 
.comment-title {
  margin-bottom: 10px;
}
.comment-statistics {
  font-size: large;
  font-weight: 600;
}
.input-comment-box {
  border: 1px solid rgb(230, 230, 230);
  border-radius: 10px;
  padding: 5px;
  transition: all 0.3s ease;
}
.input-comment-box.focused {
  border-color: #1677ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}
.comment-controller {
  display: flex;
  align-items: center;
  padding: 0 5px 0 10px
}

.comment-list {
  margin-top: 30px;
}
</style>
