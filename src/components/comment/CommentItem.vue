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
            <a-button type="primary" @click="relpyParentComment">回复</a-button>
          </div>
        </div>
      </div>
      <!-- 子评论列表 -->
      <div v-if="isShowSubComment" class="sub-comment-list">
        <div v-for="subComment in subCommentList" class="sub-comment-item" :key="subComment.comment_id">
          <div class="comment-left">
            <a-avatar :src="subComment.avatar" alt="avatar" :size="30"/>
          </div>
          <div class="comment-right">
            <span style="font-size: 16px;">{{ subComment.username }}</span>
            <span style="color: gray;margin-top: 2px;">发表于 {{ subComment.createdAt }}</span>
            <span style="font-size: 16px;margin-top: 5px;">{{ subComment.content }}</span>
            <!-- 回复子评论的输入框 -->
            <div class="comment-right-controller">
              <span class="controller-interact" @click="() => { replyInputVisible[subComment.comment_id] = true }">
                <RollbackOutlined /> 回复
              </span>
              <div v-if="replyInputVisible[subComment.comment_id]" class="reply-main-comment">
                <a-textarea 
                  :placeholder="'回复@' + subComment.username + '：'" 
                  style="width: 100%;" 
                  :auto-size="{ minRows: 1, maxRows: 3 }"
                  v-model:value="subComment.replyContent"
                />
                <div class="reply-main-comment-controller">
                  <a-button @click="() => { replyInputVisible[subComment.comment_id] = false }" style="margin-right: 10px;">取消</a-button>
                  <a-button 
                    type="primary" 
                    @click="() => { relpySubComment(subComment.comment_id, subComment.replyContent); subComment.replyContent = '' }"
                  >回复</a-button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="sub-comment-contoller">
          <a><PlusOutlined /> 加载更多</a>
          <a class="hidden-comment" @click="() => { isShowSubComment = false }"><UpOutlined /> 隐藏评论</a>
        </div>
      </div>
      <a-divider/>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { MessageOutlined, RollbackOutlined, UpOutlined, PlusOutlined } from "@ant-design/icons-vue";

const props = defineProps({
  avatar: String,
  username: String,
  createdAt: String,
  content: String,
  replyCount: Number,
  isSubComment: Boolean,
  parentCommentId: Number,
})
const replyCount = ref(props.replyCount)
const isShowSubComment = ref(false)
const isShowReplyMainCommentInput = ref(false)
const replyMainCommentContent = ref("")
const subCommentList = ref([
  {
    avatar: "https://picsum.photos/800/600",
    username: "Joe",
    createdAt: "2021-01-01 09:32:32",
    content: "This is a sub comment",
    replyContent: "",
    comment_id: props.parentCommentId + 1
  },
  {
    avatar: "https://picsum.photos/800/600",
    username: "Jack",
    createdAt: "2034-01-01 21:32:11",
    content: "是谁力扣第一题都做的磕磕巴巴，原来是我",
    replyContent: "",
    comment_id: props.parentCommentId + 2
  }
])

// 使用对象来跟踪每个子评论的回复输入框可见性
const replyInputVisible = reactive({})

const relpyParentComment = () => {
  subCommentList.value.unshift({
    avatar: "https://picsum.photos/800/600",
    username: "Joe",
    createdAt: "2034-01-01 21:32:11",
    content: replyMainCommentContent.value,
    replyContent: "",
    comment_id: props.parentCommentId + subCommentList.value.length + 1
  })
  replyCount.value++
  replyMainCommentContent.value = ''
  isShowSubComment.value = true
  isShowReplyMainCommentInput.value = false
}
const relpySubComment = (subCommentId, content) => {
  subCommentList.value.push({
    avatar: "https://picsum.photos/800/600",
    username: "James",
    createdAt: "2034-01-01 21:32:11",
    content: content,
    replyContent: "",
    comment_id: props.parentCommentId + subCommentList.value.length + 1
  })
  replyCount.value++
  replyInputVisible[subCommentId] = false
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
