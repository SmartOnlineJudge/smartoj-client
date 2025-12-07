<script setup>
import { ref, onMounted } from 'vue';
import { getUserMessages, setMessageAsRead } from '@/http';
import { message } from 'ant-design-vue';

const messages = ref([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = 5;
const loading = ref(false);

const fetchMessages = async (page = 1) => {
  loading.value = true;
  try {
    const response = await getUserMessages(page, pageSize);
    messages.value = response.data.data.results;
    total.value = response.data.data.total;
    currentPage.value = page;
  } catch (error) {
    message.error('获取消息失败: ' + error.message);
  } finally {
    loading.value = false;
  }
};

const handlePageChange = (page) => {
  fetchMessages(page);
};

const markAsRead = async (messageId, index) => {
  try {
    await setMessageAsRead(messageId);
    messages.value[index].is_read = true;
    message.success('消息已标记为已读');
  } catch (error) {
    message.error('标记失败: ' + error.message);
  }
};

onMounted(() => {
  fetchMessages();
});
</script>

<template>
  <div class="my-message-container">
    <a-card title="我的消息" :bordered="false" style="width: 100%;">
      <a-skeleton :loading="loading" :paragraph="{ rows: 5 }" :title="false" active>
        <a-empty v-if="messages.length === 0" description="暂无消息"/>
        <div v-else>
          <a-card 
            v-for="(msg, index) in messages" 
            :key="msg.id"
            :bordered="false"
            :style="{ 
              marginBottom: '10px',
              backgroundColor: msg.is_read ? '#fafafa' : '#e6f7ff'
            }"
          >
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-weight: bold; margin-bottom: 5px;">
                  {{ msg.title }}
                </div>
                <div style="margin-bottom: 5px;">{{ msg.content }}</div>
                <div style="font-size: 12px; color: #999;">
                  {{ msg.created_at }}
                  <a-tag style="margin-left: 5px;" :color="msg.type === 'reply' ? 'blue' : 'green'">
                    {{ msg.type === 'reply' ? '回复' : '系统' }}
                  </a-tag>
                </div>
              </div>
              
              <div v-if="!msg.is_read">
                <a-button type="link" @click="markAsRead(msg.id, index)">
                  标为已读
                </a-button>
              </div>
              
              <div v-else>
                <a-tag color="green">已读</a-tag>
              </div>
            </div>
          </a-card>
          
          <div style="display: flex; justify-content: flex-end; margin-top: 20px;">
            <a-pagination
              v-model:current="currentPage"
              :total="total"
              :page-size="pageSize"
              @change="handlePageChange"
            />
          </div>
        </div>
      </a-skeleton>
    </a-card>
  </div>
</template>

<style scoped>
.my-message-container {
  padding: 20px;
  width: 70%;
  margin: 0 auto;
}
</style>
