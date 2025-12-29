<template>
  <div class="user-profile">
    <div style="font-size: 16px; font-weight: 600; margin-bottom: 15px;">用户画像</div>
    <div v-if="Object.keys(userProfile).length === 0" class="no-data">
      <div>暂无用户画像数据</div>
      <div style="font-size: 14px; color: #888; margin-top: 10px;">完成题目后将生成您的能力画像</div>
    </div>
    <div v-else class="profile-content">
      <div class="profile-stats">
        <div class="stat-item">
          <div class="stat-value">{{ userProfile.total_score || 0 }}</div>
          <div class="stat-label">累计得分</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ (userProfile.global_ac_rate * 100).toFixed(2) || 0 }}%</div>
          <div class="stat-label">通过率</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ userProfile.avg_try_count ? userProfile.avg_try_count.toFixed(1) : 0 }}</div>
          <div class="stat-label">平均尝试次数</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ difficultyMapping[userProfile.strong_difficulty] || '暂无' }}</div>
          <div class="stat-label">擅长难度</div>
        </div>
      </div>
      
      <div class="last-active"></div>
      
      <!-- 优势标签 -->
      <div class="strong-tags" v-if="userProfile.strong_tags && userProfile.strong_tags.length > 0">
        <div style="font-size: 16px; font-weight: 500; margin: 15px 0 10px 0;">优势知识点</div>
        <div class="tags-container">
          <div 
            class="tag-item" 
            v-for="(tag, index) in userProfile.strong_tags" 
            :key="index"
            :title="`通过率：${tag.ac_rate.toFixed(2)}%（${tag.ac_question_count}/${tag.total_submissions}）`"
          >
            <span class="tag-name">{{ tag.tag_name }}</span>
            <div class="tag-progress">
              <div class="progress-bar">
                <div class="progress-fill strong-progress" :style="{ width: tag.ac_rate + '%' }"></div>
              </div>
              <span class="tag-ac-rate">{{ tag.ac_rate.toFixed(2) }}%</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="no-strong-tags" v-else>
        <div style="font-size: 16px; font-weight: 500; margin: 15px 0 10px 0;">优势知识点</div>
        <div>暂无优势知识点，继续努力！</div>
      </div>

      <!-- 薄弱标签 -->
      <div class="weak-tags" v-if="userProfile.weak_tags && userProfile.weak_tags.length > 0">
        <div style="font-size: 16px; font-weight: 500; margin: 15px 0 10px 0;">薄弱知识点</div>
        <div class="tags-container">
          <div 
            class="tag-item" 
            v-for="(tag, index) in userProfile.weak_tags" 
            :key="index"
            :title="`通过率：${tag.ac_rate.toFixed(2)}%（${tag.ac_question_count}/${tag.total_submissions}）`"
          >
            <span class="tag-name">{{ tag.tag_name }}</span>
            <div class="tag-progress">
              <div class="progress-bar">
                <div class="progress-fill weak-progress" :style="{ width: tag.ac_rate + '%' }"></div>
              </div>
              <span class="tag-ac-rate">{{ tag.ac_rate.toFixed(2) }}%</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="no-weak-tags" v-else>
        <div style="font-size: 16px; font-weight: 500; margin: 15px 0 10px 0;">薄弱知识点</div>
        <div>暂无薄弱知识点，继续保持！</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

import { getUserProfile } from '@/http'

const userProfile = ref({})
const difficultyMapping = {
  easy: '简单',
  medium: '中等',
  hard: '困难'
}

onMounted(async () => {
  const response = await getUserProfile();
  userProfile.value = response.data.data;
}) 
</script>

<style scoped>
.user-profile {
  padding: 15px;
}
.no-data {
  text-align: center;
  padding: 30px 0;
  color: #666;
}
.profile-content {
  display: flex;
  flex-direction: column;
}
.profile-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}
.stat-item {
  text-align: center;
  flex: 1;
  margin: 0 5px;
}
.stat-value {
  font-size: 16px;
  font-weight: 600;
  color: #1890ff;
}
.stat-label {
  font-size: 13px;
  color: #888;
  margin-top: 5px;
}
.last-active {
  border-bottom: 1px solid #eee;
}
.label {
  color: #666;
  font-size: 14px;
}
.strong-tags, .weak-tags {
  width: 100%;
}
.tags-container {
  display: flex;
  flex-direction: column;
}
.tag-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}
.tag-name {
  width: 80px;
  font-size: 14px;
  color: #333;
}
.tag-progress {
  display: flex;
  align-items: center;
  flex: 1;
  margin-left: 10px;
}
.progress-bar {
  width: 70%;
  height: 10px;
  background-color: #f0f0f0;
  border-radius: 5px;
  overflow: hidden;
  margin-right: 10px;
}
.progress-fill {
  height: 100%;
  border-radius: 5px;
  transition: width 0.3s ease;
}
.strong-progress {
  background: linear-gradient(90deg, #52c41a, #8ce266);
}
.weak-progress {
  background: linear-gradient(90deg, #ff4d4f, #f86b6d);
}
.tag-ac-rate {
  font-size: 12px;
  color: #666;
  min-width: 40px;
  text-align: right;
}
.no-strong-tags, .no-weak-tags {
  color: #888;
  font-size: 14px;
  padding: 10px 0;
}
</style>