<template>
  <div id="question-solution-area">
    <div class="solution-list" :hidden="shouldOpenSolution">
      <div class="create-solution">
        <a-button type="dashed" style="width: 100%;" @click="createSolution"><PlusCircleTwoTone />创建题解</a-button>
      </div>
      <div class="solution-area">
        <div v-for="solution in solutionData" class="solution" @click="() => { openSoultion(solution.id) }">
          <div class="solution-left">
            <a-avatar :src="MINIO_URL + solution.avatar" alt="avatar" :size="35"/>
          </div>
          <div class="solution-right">
            <span class="username">{{ solution.username }}</span>
            <span class="solution-title">{{ solution.title }}</span>
            <span class="solution-partial-content">{{ solution.content }}</span>
            <div class="relative-info">
              <div class="statistics">
                <a-tooltip>
                  <template #title>浏览数量</template>
                  <span><EyeOutlined /> {{ solution.views }}</span>
                </a-tooltip>
                <a-tooltip>
                  <template #title>评论数量</template>
                  <span style="margin-left: 15px;"><CommentOutlined /> {{ solution.comments }}</span>
                </a-tooltip>
              </div>
              <span style="margin-left: auto;margin-right: 15px;">{{ solution.created_at }}</span>
            </div>
            <a-divider/>
          </div>
        </div>
        <div class="load-more-solution" @click="loadMoreSolutions"><a-button>加载更多</a-button></div>
      </div>
    </div>
    <div class="solution-detail">
      <a-drawer
        v-model:open="shouldOpenSolution"
        :get-container="false"
        style="position: absolute;"
        :contentWrapperStyle="{ boxShadow: 'unset' }"
        width="100%"
        title="返回题解"
        placement="right"
        destroyOnClose
      >
        <template #closeIcon>
          <ArrowLeftOutlined />
        </template>
        <div class="solution-detail-content">
          <div><h2 class="detail-title">第一题，让我来闲扯一下</h2></div>
          <div class="solution-detail-header">
            <div class="detail-user-avatar">
              <a-avatar :src="MINIO_URL + '/user-avatars/sOFQK2CZGNfIQVa6hgFKngTM8jp5u53h.jpg'" alt="avatar" :size="40"/>
            </div>
            <div class="detail-statistics-box">
              <div><span class="detail-username">先杀我队友</span></div>
              <div class="detail-statistics">
                <span><EyeOutlined /> 6747</span>
                <span style="margin-left: 10px;"><CalendarOutlined /> 2025-11-30 14:03:45</span>
              </div>
            </div>
          </div>
          <div class="detail-markdown-content">
            <v-md-editor v-model="solutionMarkdownContent" mode="preview"/>
          </div>
          <a-divider/>
          <Comment/>
        </div>
      </a-drawer>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { 
  PlusCircleTwoTone, 
  EyeOutlined, 
  CommentOutlined, 
  ArrowLeftOutlined, 
  CalendarOutlined
} from "@ant-design/icons-vue";

import Comment from "@/components/comment/Comment.vue";
import { useQuestionStore } from "@/stores";

const questionStore = useQuestionStore();
const MINIO_URL = import.meta.env.VITE_MINIO_URL
const shouldOpenSolution = ref(false);
const solutionData = ref([
  {
    id: 1,
    username: "张胜男",
    avatar: "/user-avatars/sOFQK2CZGNfIQVa6hgFKngTM8jp5u53h.jpg",
    title: "第一题，让我来闲扯一下",
    content: "标记了一个（或封装一组）操作命令，响应用户点击行为，触发相应的业务逻辑。标记了一个（或封装一组）操作命令，响应用户点击行为，触发相应的业务逻辑。",
    created_at: "2025-11-30 14:03:45",
    views: 456,
    comments: 878
  },
  {
    id: 2,
    username: "李四",
    avatar: "/user-avatars/sOFQK2CZGNfIQVa6hgFKngTM8jp5u53h.jpg",
    title: "第一题，让我来闲扯一下",
    content: "标记了一个（或封装一组）操作命令，响应用户点击行为，触发相应的业务逻辑。标记了一个（或封装一组）操作命令，响应用户点击行为，触发相应的业务逻辑。",
    created_at: "2025-11-30 14:03:45",
    views: 378,
    comments: 324
  },
  {
    id: 3,
    username: "王麻子",
    avatar: "/user-avatars/sOFQK2CZGNfIQVa6hgFKngTM8jp5u53h.jpg",
    title: "第一题，让我来闲扯一下",
    content: "标记了一个（或封装一组）操作命令，响应用户点击行为，触发相应的业务逻辑。标记了一个（或封装一组）操作命令，响应用户点击行为，触发相应的业务逻辑。",
    created_at: "2025-11-30 14:03:45",
    views: 7853,
    comments: 234
  },
  {
    id: 4,
    username: "先杀我队友",
    avatar: "/user-avatars/sOFQK2CZGNfIQVa6hgFKngTM8jp5u53h.jpg",
    title: "第一题，让我来闲扯一下",
    content: "标记了一个（或封装一组）操作命令，响应用户点击行为，触发相应的业务逻辑。标记了一个（或封装一组）操作命令，响应用户点击行为，触发相应的业务逻辑。",
    created_at: "2025-11-30 14:03:45",
    views: 456,
    comments: 187
  },
  {
    id: 5,
    username: "Rainbow",
    avatar: "/user-avatars/sOFQK2CZGNfIQVa6hgFKngTM8jp5u53h.jpg",
    title: "第一题，让我来闲扯一下",
    content: "标记了一个（或封装一组）操作命令，响应用户点击行为，触发相应的业务逻辑。标记了一个（或封装一组）操作命令，响应用户点击行为，触发相应的业务逻辑。",
    created_at: "2025-11-30 14:03:45",
    views: 456,
    comments: 234
  }
])
const solutionMarkdownContent = ref("### 1111")

const openSoultion = solutionID => {
  shouldOpenSolution.value = true;
}
const loadMoreSolutions = () => {
  solutionData.value.push({
    id: 6,
    username: "唐大帅哥",
    avatar: "/user-avatars/sOFQK2CZGNfIQVa6hgFKngTM8jp5u53h.jpg",
    title: "第一题，让我来闲扯一下",
    content: "标记了一个（或封装一组）操作命令，响应用户点击行为，触发相应的业务逻辑。标记了一个（或封装一组）操作命令，响应用户点击行为，触发相应的业务逻辑。",
    created_at: "2025-11-30 14:03:45",
    views: 456,
    comments: 234
  },
  {
    id: 7,
    username: "刘昊然",
    avatar: "/user-avatars/sOFQK2CZGNfIQVa6hgFKngTM8jp5u53h.jpg",
    title: "第一题，让我来闲扯一下",
    content: "标记了一个（或封装一组）操作命令，响应用户点击行为，触发相应的业务逻辑。标记了一个（或封装一组）操作命令，响应用户点击行为，触发相应的业务逻辑。",
    created_at: "2025-11-30 14:03:45",
    views: 456,
    comments: 234
  },
  {
    id: 8,
    username: "刘浩存",
    avatar: "/user-avatars/sOFQK2CZGNfIQVa6hgFKngTM8jp5u53h.jpg",
    title: "第一题，让我来闲扯一下",
    content: "标记了一个（或封装一组）操作命令，响应用户点击行为，触发相应的业务逻辑。标记了一个（或封装一组）操作命令，响应用户点击行为，触发相应的业务逻辑。",
    created_at: "2025-11-30 14:03:45",
    views: 456,
    comments: 234
  },
  {
    id: 9,
    username: "王楚然",
    avatar: "/user-avatars/sOFQK2CZGNfIQVa6hgFKngTM8jp5u53h.jpg",
    title: "第一题，让我来闲扯一下",
    content: "标记了一个（或封装一组）操作命令，响应用户点击行为，触发相应的业务逻辑。标记了一个（或封装一组）操作命令，响应用户点击行为，触发相应的业务逻辑。",
    created_at: "2025-11-30 14:03:45",
    views: 456,
    comments: 234
  },
  {
    id: 10,
    username: "张若楠",
    avatar: "/user-avatars/sOFQK2CZGNfIQVa6hgFKngTM8jp5u53h.jpg",
    title: "第一题，让我来闲扯一下",
    content: "标记了一个（或封装一组）操作命令，响应用户点击行为，触发相应的业务逻辑。标记了一个（或封装一组）操作命令，响应用户点击行为，触发相应的业务逻辑。",
    created_at: "2025-11-30 14:03:45",
    views: 456,
    comments: 234
  })
}
const createSolution = () => {
  window.open('/create-solution/' + questionStore.question.id)
}
</script>

<style scoped>
#question-solution-area {
  position: relative;  /* 让抽屉被渲染在该容器内 */
  min-height: 80vh;
}
.question-solution-area {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.create-solution {
  padding: 20px;
}
.solution-area {
  padding: 0 5px;
  overflow-x: hidden; /* 隐藏横向滚动条 */
}
.solution {
  display: flex;
  padding: 0 20px 0 10px;
}
.solution:hover {
  cursor: pointer;
}
.solution .solution-left {
  padding: 5px;
}
.solution .solution-right {
  display: flex;
  flex-direction: column;
  margin-left: 5px;
  font-size: 16px;
  width: calc(100% - 40px);  /* 减去头像的宽度 */
}
.solution-right .username {
  color: gray;
}
.solution-right .solution-title {
  font-weight: bold;
  margin-top: 5px;
}
.solution-right .solution-partial-content {
  color: gray;
  margin-top: 5px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  display: block;  /* 改为 block 以便正确应用省略号 */
}
.solution-right .relative-info {
  margin-top: 10px;
  display: flex;
  color: gray;
}
.load-more-solution {
  text-align: center;
  margin-bottom: 10px;
}

/* 抽屉内部样式 */
.detail-title {
  margin-top: 0;
}
.solution-detail-header {
  display: flex;
}
.detail-user-avatar {
  padding: 5px 0;
}
.detail-statistics-box {
  margin-left: 10px;
  display: flex;
  flex-direction: column;
}
.detail-username {
  font-weight: 500;
  font-size: 16px;
}
.detail-statistics {
  color: gray;
  margin-top: 5px;
}
.detail-markdown-content {
  margin-top: 20px;
}
</style>
