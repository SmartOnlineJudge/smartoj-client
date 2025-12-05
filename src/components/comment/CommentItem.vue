<template>
  <div class="comment-item">
    <div class="comment-left">
      <a-avatar :src="props.avatar" alt="avatar" :size="35"/>
    </div>
    <div class="comment-right">
      <span style="font-size: 16px;">{{ props.username }}</span>
      <span style="color: gray;margin-top: 2px;">发表于 {{ props.createdAt }}</span>
      <span style="font-size: 16px;margin-top: 5px;">{{ props.content }}</span>
      <div class="comment-right-controller">
        <span 
          v-if="replyCount > 0" 
          class="controller-interact"
          style="margin-right: 10px;"  
          @click="() => { isShowSubComment = !isShowSubComment }"
        >
          <MessageOutlined /> {{ isShowSubComment ? '隐藏评论' : '共 ' + replyCount + ' 条回复' }}
        </span>
        <span class="controller-interact" @click="() => { isShowReplyMainCommentInput = true }">
          <RollbackOutlined /> 回复
        </span>
        <!-- 回复父评论的输入框 -->
        <div v-if="isShowReplyMainCommentInput" class="reply-main-comment">
          <a-textarea 
            placeholder="请输入回复内容……" 
            style="width: 100%;"
            :auto-size="{ minRows: 1, maxRows: 3 }"
            v-model:value="replyMainCommentContent"
          />
          <div class="reply-main-comment-controller">
            <a-button @click="() => { isShowReplyMainCommentInput = false }" style="margin-right: 10px;">取消</a-button>
            <a-button type="primary" @click="relpyParentComment" :loading="relpyParentCommentLoading">回复</a-button>
          </div>
        </div>
      </div>
      <!-- 子评论列表 -->
      <div v-if="isShowSubComment" class="sub-comment-list">
        <a-skeleton :loading="pullSubCommentLoading" :paragraph="{ rows: 5 }" :title="false" active>
          <div v-for="subComment in subCommentList" class="sub-comment-item" :key="subComment.id">
            <div class="comment-left">
              <a-avatar :src="MINIO_URL + subComment.user.user_dynamic.avatar" alt="avatar" :size="30"/>
            </div>
            <div class="comment-right">
              <span style="font-size: 16px;">{{ subComment.user.user_dynamic.name }}</span>
              <span style="color: gray;margin-top: 2px;">发表于 {{ subComment.created_at }}</span>
              <span style="font-size: 16px;margin-top: 5px;">
                回复<a>@{{ commentID2Username[subComment.to_comment_id] }}</a>：{{ subComment.content }}
              </span>
              <!-- 回复子评论的输入框 -->
              <div class="comment-right-controller">
                <span 
                  class="controller-interact" 
                  @click="() => { replyInputVisible[subComment.id] = true }"
                >
                  <RollbackOutlined /> 回复
                </span>
                <div v-if="replyInputVisible[subComment.id]" class="reply-main-comment">
                  <a-textarea 
                    :placeholder="'回复@' + subComment.user.user_dynamic.name + '：'" 
                    style="width: 100%;" 
                    :auto-size="{ minRows: 1, maxRows: 3 }"
                    v-model:value="subComment.replyContent"
                  />
                  <div class="reply-main-comment-controller">
                    <a-button @click="() => { replyInputVisible[subComment.id] = false }" style="margin-right: 10px;">取消</a-button>
                    <a-button 
                      type="primary" 
                      @click="() => { relpySubComment(subComment.id, subComment.replyContent); subComment.replyContent = '' }"
                      :loading="replyButtonLoading[subComment.id]"
                    >回复</a-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a-skeleton>
        <div class="sub-comment-contoller">
          <a-skeleton :loading="loadMoreLoading" :paragraph="{ rows: 3 }" :title="false" active>
            <a v-if="hasMore" @click="loadMoreComments"><PlusOutlined/> 加载更多</a>
            <a class="hidden-comment" @click="() => { isShowSubComment = false }"><UpOutlined /> 隐藏评论</a>
          </a-skeleton>
        </div>
      </div>
      <a-divider/>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { MessageOutlined, RollbackOutlined, UpOutlined, PlusOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";

import { getChildComments, createComment } from "@/http";
import { useUserStore } from "@/stores";

const props = defineProps({
  avatar: String,
  username: String,
  createdAt: String,
  content: String,
  replyCount: Number,
  isSubComment: Boolean,
  parentCommentId: Number,
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
const replyCount = ref(props.replyCount)
const isShowSubComment = ref(false)
const isShowReplyMainCommentInput = ref(false)
const replyMainCommentContent = ref("")
const subCommentList = ref([])
const size = 5
const hasMore = ref(true)
const loadMoreLoading = ref(false)
const pullSubCommentLoading = ref(false)
const relpyParentCommentLoading = ref(false)
let nextCursor = null
let commentID2Username = {}  // 存储评论的作者名字
commentID2Username[props.parentCommentId] = props.username

// 使用对象来跟踪每个子评论的回复输入框可见性
const replyInputVisible = reactive({})
// 使用对象来跟踪每个子评论的回复输入框回复按钮的加载状态
const replyButtonLoading = reactive({})

watch(isShowSubComment, async newValue => {
  if (newValue && subCommentList.value.length === 0) {
    pullSubCommentLoading.value = true
    const response = await getChildComments(props.parentCommentId, nextCursor, size)
    const responseData = response.data.data
    const subComments = responseData.results
    subComments.forEach(subComment => {
      commentID2Username[subComment.id] = subComment.user.user_dynamic.name
    });
    subCommentList.value = responseData.results
    nextCursor = responseData.cursor
    hasMore.value = responseData.has_more
    pullSubCommentLoading.value = false
  }
})

const loadMoreComments = async () => {
  loadMoreLoading.value = true
  const response = await getChildComments(props.parentCommentId, nextCursor, size)
  const responseData = response.data.data
  const subComments = responseData.results
  subComments.forEach(subComment => {
    commentID2Username[subComment.id] = subComment.user.user_dynamic.name
  });
  const oldCommentList = subCommentList.value
  subCommentList.value = [...oldCommentList, ...subComments]
  nextCursor = responseData.cursor
  hasMore.value = responseData.has_more
  loadMoreLoading.value = false
}
const relpyParentComment = async () => {
  relpyParentCommentLoading.value = true
  const response = await createComment(
    replyMainCommentContent.value, 
    props.commentType, 
    props.targetID, 
    props.parentCommentId, 
    props.parentCommentId
  )
  if (subCommentList.value.length !== 0) {
    const responseData = response.data.data
    subCommentList.value.unshift({
      user: {
        user_dynamic: {
          name: userStore.user.name,
          avatar: userStore.user.avatar
        }
      },
      created_at: responseData.created_at,
      content: replyMainCommentContent.value,
      replyContent: "",
      id: responseData.id,
      to_comment_id: props.parentCommentId
    })
  }
  message.success('回复成功！')
  replyCount.value++
  replyMainCommentContent.value = ''
  isShowSubComment.value = true
  isShowReplyMainCommentInput.value = false
  relpyParentCommentLoading.value = false
}
const relpySubComment = async (subCommentId, content) => {
  replyButtonLoading[subCommentId] = true
  const response = await createComment(
    content, 
    props.commentType, 
    props.targetID, 
    subCommentId, 
    props.parentCommentId
  )
  const responseData = response.data.data
  subCommentList.value.push({
    user: {
      user_dynamic: {
        name: userStore.user.name,
        avatar: userStore.user.avatar
      }
    },
    created_at: responseData.created_at,
    content: content,
    replyContent: "",
    id: responseData.id,
    to_comment_id: subCommentId
  })
  replyCount.value++
  replyInputVisible[subCommentId] = false
  replyButtonLoading[subCommentId] = false
}
</script>

<style scoped>
.comment-item {
  display: flex;
}
.comment-left {
  padding: 5px 0;
}
.comment-right {
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  width: 100%;
}
.comment-right-controller {
  margin-top: 10px;
  font-size: 16px;
  color: gray;
}
.controller-interact {
  transition: all 0.3s ease;
}
.controller-interact:hover {
  cursor: pointer;
  color: black;
}
.reply-main-comment {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
}
.reply-main-comment-controller {
  margin-left: auto;
  margin-top: 7px;
}

.sub-comment-list {
  margin-top: 5px;
}
.sub-comment-item {
  display: flex;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 10px;
  margin-top: 10px;
}
.sub-comment-contoller {
  margin-top: 10px;
  display: flex;
}
.hidden-comment {
  color: gray;
  margin-left: auto;
}
.hidden-comment:hover {
  cursor: pointer;
  color: black;
}
</style>
