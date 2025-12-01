<template>
  <div id="comment">
    <div class="new-comment">
      <div class="comment-title">
        <span class="comment-statistics"> <CommentOutlined /> 评论 · 4242</span>
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
              @click="createComment"
            >发布</a-button>
          </div>
        </div>
      </div>
    </div>
    <div class="comment-list">
      <CommentItem
        v-for="comment in commentList"
        :key="comment.comment_id"
        :avatar="comment.avatar"
        :username="comment.username"
        :created-at="comment.createdAt"
        :content="comment.content"
        :reply-count="comment.replyCount"
        :parent-comment-id="comment.comment_id"
      />
      <div>
        <a-pagination 
          v-model:current="currentPage" 
          :total="50" 
          show-less-items
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { CommentOutlined } from "@ant-design/icons-vue";

import CommentItem from './CommentItem.vue';

const MINIO_URL = import.meta.env.VITE_MINIO_URL
const inputComment = ref('');
const inputMaxLength = 200
const isFocused = ref(false)
const currentPage = ref(1)

const commentList = ref([
  {
    avatar: MINIO_URL + '/user-avatars/sOFQK2CZGNfIQVa6hgFKngTM8jp5u53h.jpg',
    username: '先杀我队友',
    createdAt: '2025-11-30 13:56:12',
    content: '因为没刷过贪心的题，',
    replyCount: 235,
    comment_id: 1
  },
  {
    avatar: 'https://picsum.photos/800/600',
    username: 'Miku01',
    createdAt: '2025-11-30 11:06:45',
    content: '刚刚学学长说来力扣刷题，第一题我就看不懂了',
    replyCount: 12,
    comment_id: 2
  },
  {
    avatar: MINIO_URL + '/user-avatars/sOFQK2CZGNfIQVa6hgFKngTM8jp5u53h.jpg',
    username: '先杀我队友',
    createdAt: '2025-11-30 13:56:12',
    content: '因为没刷过贪心的题，',
    replyCount: 235,
    comment_id: 3
  },
  {
    avatar: 'https://picsum.photos/800/600',
    username: 'Miku01',
    createdAt: '2025-11-30 11:06:45',
    content: '刚刚学学长说来力扣刷题，第一题我就看不懂了',
    replyCount: 12,
    comment_id: 4
  }
])

const createComment = () => {
  commentList.value.unshift({
    avatar: 'https://picsum.photos/800/600',
    username: 'Miku01',
    createdAt: '2025-11-30 11:06:45',
    content: inputComment.value,
    replyCount: 0,
    comment_id: commentList.value.length + 1
  })
  inputComment.value = ''
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
