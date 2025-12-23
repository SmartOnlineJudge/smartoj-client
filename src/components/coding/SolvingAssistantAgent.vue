<template>
  <div id="solving-assistant">
    <div class="chat-content">
      <div class="main-content">
        <div class="welcome-box" v-if="items.length === 0">
          <div style="display: flex;flex-direction: column;width: 70%;">
            <img src="/favicon.svg" width="50" style="margin: 5px auto;"/>
            <span style="font-weight: bold;font-size: large;margin-bottom: 5px;">我是智能刷题助手，有什么需要帮忙的嘛？</span>
            <span style="color: gray;">我可以给你解答各种在刷题中遇到的问题，例如：提供解题思路、检查代码问题等等。</span>
          </div>
        </div>
        <a-skeleton v-else :loading="skeletonLoading" :paragraph="{ rows: 12 }" active :title="false">
          <div class="chat-box" >
            <BubbleList
              id="chat-box-list"
              :roles="rolesConfig"
              :items="items"
              @wheel="handleUserScroll"
              @scroll="handleUserScroll"
              :style="{ maxHeight: bubbleListMaxHeight, padding: '0 5px' }"
            />
          </div>
        </a-skeleton>
      </div>
      <div class="input-box">
        <Sender
          v-model:value="inputValue"
          :loading="loading"
          @submit="submitHandler"
          @cancel="cancelHandler"
          placeholder="请输入你的需求"
        >
        </Sender>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, h } from 'vue';
import { Sender, BubbleList } from 'ant-design-x-vue';
import { Avatar, Collapse, CollapsePanel, message } from 'ant-design-vue';
import VueMarkdownEditor, { xss } from '@kangc/v-md-editor';

import { useUserStore, useQuestionStore } from '@/stores';
import { chatWithSolvingAssistantAgent, getConversationDetail, interruptConversation } from '@/http';


const userStore = useUserStore();
const questionStore = useQuestionStore();
const MINIO_URL = import.meta.env.VITE_MINIO_URL
const currentThreadID = ref("");
const props = defineProps({ isOpenChat: Boolean })

// 聊天主体内容相关代码
const bubbleListMaxHeight = ref('45vh')  // 计算BubbleList最大高度
const isAutoScroll = ref(true);  // 控制是否自动滚动到底部
const items = ref([])
const skeletonLoading = ref(false);
const isFirstOpenChat = ref(true);  // 避免没有聊天记录的时候多次加载聊天记录
let scrollTimer = null;
const markdownRender = content => {
  const html = xss.process(VueMarkdownEditor.vMdParser.themeConfig.markdownParser.render(content));
  return h('div', { innerHTML: html, class: "github-markdown-body" });
};
const toolCallRender = toolCall => {
  return h(Collapse, {
    bordered: false,
    style: { background: '#f2f2f2', margin: "10px 0" }
  }, {
    default: () => [
      h(CollapsePanel, 
      { key: "0", header: `⚒️工具调用: ${toolCall.name}` }, 
      {
        default: () => [
          h('p', { style: { whiteSpace: 'pre-wrap', margin: "0" } }, `参数: ${JSON.stringify(toolCall.args, null, 2)}`),
          toolCall.result ? h('p', { style: { whiteSpace: 'pre-wrap', margin: "0" } }, `工具调用结果: \n${toolCall.result}`) : null
        ]
      })
    ],
    expandIcon: ({ isActive }) => h(CaretRightOutlined, { rotate: isActive ? 90 : 0 })
  })
}
const assistantMessageRender = responseList => {
  let responseID = null
  let assistantContent = ""
  let renderedList = []
  let toolCalls = {};
  responseList.forEach(response => {
    if (responseID !== response.id) {
      if (assistantContent !== "") {
        renderedList.push(markdownRender(assistantContent))
      }
      if (response.type === "assistant") {
        assistantContent = response.content
        responseID = response.id
      } else {
        responseID = response.id
        assistantContent = ""
      }
      if (response.type === "tool_call") {
        toolCalls[response.id] = {
          name: response.name,
          args: response.args,
          result: null
        }
      }
      return
    } else {
      if (response.type === "assistant") { 
        assistantContent += response.content 
      }
    }
    if (response.type === "tool_call") {
      toolCalls[response.id] = {
        name: response.name,
        args: response.args,
        result: null
      }
    }
    if (response.type === "tool_call_result") {
      if (!toolCalls[response.id]) {
        toolCalls[response.id] = {}
      }
      toolCalls[response.id].result = response.result
      
      // 当工具调用有结果时，立即展示该工具调用信息
      const toolCall = toolCalls[response.id];
      if (toolCall.name) {
        renderedList.push(toolCallRender(toolCall));
      }
    }
  })
  // 处理最后一个消息块
  if (assistantContent !== "") {
    renderedList.push(markdownRender(assistantContent))
  }
  return h("div", renderedList);
}
const rolesConfig = {
  assistant: {
    placement: 'start',
    typing: { step: 5, interval: 20 },
    avatar: h(Avatar, { src: "/favicon.svg", shape: 'square' }),
    variant: "borderless",
    header: "智能刷题助手",
    messageRender: assistantMessageRender
  },
  user: {
    placement: 'end',
    avatar: () => h(Avatar, { src: MINIO_URL + userStore.user["avatar"] }),
    header: () => userStore.user["name"]
  }
};
const handleUserScroll = () => {
  // 统一处理用户滚动行为
  const chatBoxList = document.getElementById("chat-box-list");
  if (!chatBoxList) return;
  
  // 清除之前的定时器
  if (scrollTimer) {
    clearTimeout(scrollTimer);
  }
  
  // 用户手动滚动时，暂时禁用自动滚动
  isAutoScroll.value = false;
  
  // 检查是否接近底部，如果接近底部则重新启用自动滚动
  scrollTimer = setTimeout(() => {
    const threshold = 50; // 距离底部50像素以内认为是底部
    if (chatBoxList.scrollTop + chatBoxList.clientHeight >= chatBoxList.scrollHeight - threshold) {
      isAutoScroll.value = true;
    }
  }, 100);
};
watch(() => items.value[items.value.length - 1], () => {
  // 监听items变化，根据isAutoScroll状态决定是否自动滚动到底部
  if (!isAutoScroll.value) return;
  
  // 使用nextTick确保DOM已经更新
  nextTick(() => {
    const chatBoxList = document.getElementById("chat-box-list");
    if (chatBoxList) {
      // 滚动到底部
      chatBoxList.scrollTo({
        top: chatBoxList.scrollHeight,
        behavior: 'smooth'
      });
    }
  });
}, { deep: true });
const updateBubbleListMaxHeight = () => {
  // 更新BubbleList最大高度的函数
  const inputBox = document.querySelector('.input-box');
  const workspaceBox = document.querySelector('#workspace');

  if (inputBox && workspaceBox) {
    const inputBoxHeight = inputBox.offsetHeight || 0;
    const workspaceHeight = workspaceBox.offsetHeight || 0
    // 计算其他margin/padding等间距
    const margins = 50; // 估算的额外间距
    
    // 计算BubbleList可用的最大高度
    const totalReservedHeight = inputBoxHeight + margins;
    const calculatedHeight = `calc(${workspaceHeight}px - ${totalReservedHeight}px)`;
    bubbleListMaxHeight.value = calculatedHeight;
  }
};
const updateConversation = async () => {
  const response = await getConversationDetail(questionStore.question.id);
  const details = response.data.details
  const newItems = []
  details.forEach(item => {
    if (item.type === "user") {
      newItems.push({
        key: item.id,
        role: "user",
        content: item.content
      })
    } else {
      newItems.push({
        key: item.id,
        role: "assistant",
        content: [item]
      })
    }
  })
  items.value = newItems
  currentThreadID.value = response.data.thread_id
}
watch(() => props.isOpenChat, async () => {
  // 首次打开聊天面板
  if (props.isOpenChat && items.value.length === 0 && isFirstOpenChat.value) {
    isFirstOpenChat.value = false
    skeletonLoading.value = true
    items.value.push({})
    setTimeout(async () => {
      updateBubbleListMaxHeight()
      try {
        await updateConversation()
      } catch (error) {
        console.error(error);
        message.error("获取聊天记录异常")
      } finally {
        skeletonLoading.value = false
      }
    }, 150)
  }
})

// 聊天输入框相关代码
const loading = ref(false);
const inputValue = ref('');
const askAgent = async query => {
  try {
    const threadIDResponse = await chatWithSolvingAssistantAgent(
      query, 
      currentThreadID.value, 
      questionStore.question.id, 
      questionStore.question.description, 
      questionStore.code
    );
    const threadID = threadIDResponse.data.thread_id;
    if (currentThreadID.value === "") {
      currentThreadID.value = threadID;
    }
    const response = await fetch('/ai-service/chat/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream'
      },
      body: JSON.stringify({ thread_id: threadID }),
      credentials: 'include',  // 发送cookies
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!response.body) {
      throw new Error("ReadableStream not supported");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      
      // 解析SSE格式
      const lines = buffer.split('\n');
      buffer = lines.pop(); // 剩余的不完整行放回buffer

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim();
          if (data === 'DONE') {
            reader.cancel();
            return;
          }
          const jsonData = JSON.parse(data);
          if (jsonData.type === "node_call_log") {
            continue
          }
          items.value[items.value.length - 1].content.push(jsonData)
        }
      }
    }
  } catch (error) {
    console.error('Fetch error:', error);
  } finally {
    loading.value = false;
  }
}
const submitHandler = async () => {
  loading.value = true;
  const query = inputValue.value;
  items.value.push({
    key: items.value.length,
    role: 'user',
    content: query
  });
  inputValue.value = '';
  items.value.push({
    key: items.value.length,
    role: 'assistant',
    content: []
  })
  await askAgent(query)
};
const cancelHandler = async () => {
  await interruptConversation(currentThreadID.value);
  loading.value = false;
};
</script>

<style scoped>
#solving-assistant {
  padding: 20px 5px 10px 5px;
  height: 100%;
}
.chat-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.welcome-box {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.chat-box {
  margin-bottom: 5px;
  flex: 1;
  overflow: auto;
}
.chat-box :deep(.github-markdown-body) {
  padding: 0;
  font-size: unset;
  background-color: unset;
  color: unset;
}
.input-box {
  margin-top: auto;
}
</style>
