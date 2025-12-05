<template>
  <div id="question-solution-area">
    <div class="solution-list" :hidden="shouldOpenSolution">
      <div class="create-solution">
        <a-button type="dashed" style="width: 100%;" @click="createSolution"><PlusCircleTwoTone />创建题解</a-button>
      </div>
      <div class="solution-area">
        <a-skeleton :loading="getSolutionListLoading" :paragraph="{ rows: 8 }" :title="false" active>
          <div 
            v-for="solution in solutionList"
            :key="solution.id"
            class="solution" 
            @click="() => { openSoultion(solution.id) }"
          >
            <div class="solution-left">
              <a-avatar :src="MINIO_URL + solution.user.user_dynamic.avatar" alt="avatar" :size="35"/>
            </div>
            <div class="solution-right">
              <span class="username">{{ solution.user.user_dynamic.name }}</span>
              <span class="solution-title">{{ solution.title }}</span>
              <span class="solution-partial-content">{{ solution.content }}</span>
              <div class="relative-info">
                <div class="statistics">
                  <a-tooltip>
                    <template #title>浏览数量</template>
                    <span><EyeOutlined /> {{ solution.view_count }}</span>
                  </a-tooltip>
                  <a-tooltip>
                    <template #title>评论数量</template>
                    <span style="margin-left: 15px;"><CommentOutlined /> {{ solution.comment_count }}</span>
                  </a-tooltip>
                </div>
                <span style="margin-left: auto;margin-right: 15px;">{{ solution.created_at }}</span>
              </div>
              <a-divider/>
            </div>
          </div>
          <div v-if="hasMore" class="load-more-solution" @click="loadMoreSolutions">
            <a-skeleton :loading="loadMoreLoading" :paragraph="{ rows: 2 }" :title="false" active>
              <a-button>加载更多</a-button>
            </a-skeleton>
          </div>
        </a-skeleton>
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
        <a-skeleton :loading="getSolutionLoading" :paragraph="{ rows: 20 }" :title="false" active>
          <div v-if="currentSolution" class="solution-detail-content">
            <div><h2 class="detail-title">{{ currentSolution.title }}</h2></div>
            <div class="solution-detail-header">
              <div class="detail-user-avatar">
                <a-avatar :src="MINIO_URL + currentSolution.user.user_dynamic.avatar" alt="avatar" :size="40"/>
              </div>
              <div class="detail-statistics-box">
                <div><span class="detail-username">{{ currentSolution.user.user_dynamic.name }}</span></div>
                <div class="detail-statistics">
                  <span><EyeOutlined /> {{ currentSolution.view_count }}</span>
                  <span style="margin-left: 10px;"><CalendarOutlined /> {{ currentSolution.created_at }}</span>
                </div>
              </div>
            </div>
            <div class="detail-markdown-content">
              <v-md-editor v-model="currentSolution.content" mode="preview"/>
            </div>
            <a-divider/>
            <Comment comment-type="solution" :targetID="currentSolution.id"/>
          </div>
        </a-skeleton>
      </a-drawer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { 
  PlusCircleTwoTone, 
  EyeOutlined, 
  CommentOutlined, 
  ArrowLeftOutlined, 
  CalendarOutlined
} from "@ant-design/icons-vue";

import Comment from "@/components/comment/Comment.vue";
import { useQuestionStore } from "@/stores";
import { getSolutionList, getSolution } from "@/http";

const questionStore = useQuestionStore();
const questionID = questionStore.question.id;
const MINIO_URL = import.meta.env.VITE_MINIO_URL
const shouldOpenSolution = ref(false);
const solutionList = ref([])
const currentSolution = ref(null)
const getSolutionLoading = ref(false);
const getSolutionListLoading = ref(false);
const loadMoreLoading = ref(false);
const hasMore = ref(true);
const size = 5
let nextCursor = null;

onMounted(async () => {
  getSolutionListLoading.value = true
  const response = await getSolutionList(questionID, null, size)
  const responseData = response.data.data
  solutionList.value = responseData.results
  hasMore.value = responseData.has_more
  nextCursor = responseData.cursor
  getSolutionListLoading.value = false
})

const openSoultion = async solutionID => {
  getSolutionLoading.value = true
  shouldOpenSolution.value = true;
  const response = await getSolution(solutionID)
  currentSolution.value = response.data.data
  getSolutionLoading.value = false
}
const loadMoreSolutions = async () => {
  loadMoreLoading.value = true
  const response = await getSolutionList(questionID, nextCursor, size)
  const responseData = response.data.data
  hasMore.value = responseData.has_more
  nextCursor = responseData.cursor
  const oldSolutionList = solutionList.value
  solutionList.value = [...oldSolutionList, ...responseData.results]
  loadMoreLoading.value = false
}
const createSolution = () => {
  window.open('/create-solution/' + questionID)
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
