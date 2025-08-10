<script setup>
import { ref } from 'vue';
import { 
  ProfileTwoTone, 
  MessageTwoTone, 
  ExperimentTwoTone,
  PieChartTwoTone,
  FileTextTwoTone
} from '@ant-design/icons-vue';


let content = `给定一个整数数组 \`nums\` 和一个整数目标值 \`target\`，请你在该数组中找出 **和为目标值** *\`target\`* 的那 **两个** 整数，并返回它们的数组下标。

你可以假设每种输入只会对应一个答案，并且你不能使用两次相同的元素。

你可以按任意顺序返回答案。

**示例 1：**

\`\`\`
输入：nums = [2,7,11,15], target = 9
输出：[0,1]
解释：因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。
\`\`\`

**示例 2：**

\`\`\`
输入：nums = [3,2,4], target = 6
输出：[1,2]
\`\`\`

**示例 3：**

\`\`\`
输入：nums = [3,3], target = 6
输出：[0,1]
\`\`\`

**示例 4：**

\`\`\`
输入：nums = [3,3], target = 6
输出：[0,1]
\`\`\`
`

const questionDescription = ref(content);
const radioValue = ref('description');
</script>

<template>
  <div id="question-description-main">
    <div class="question-description-header">
      <span style="margin-left: 15px;font-size: 16px;font-weight: bold;">
        <FileTextTwoTone />
        题目信息面板
      </span>
    </div>
    <a-divider style="margin: 0 0 10px 0;"/>
    <div id="question-description-title">
      <a-radio-group v-model:value="radioValue" button-style="solid">
        <a-radio-button value="description">
          <ProfileTwoTone />
          题目描述
        </a-radio-button>
        <a-radio-button value="communication">
          <MessageTwoTone />
          讨论区
        </a-radio-button>
        <a-radio-button value="solving">
          <ExperimentTwoTone />
          题解区
        </a-radio-button>
        <a-radio-button value="history">
          <PieChartTwoTone />
          提交历史
        </a-radio-button>
      </a-radio-group>
    </div>
    <div id="question-description-content">
      <div v-if="radioValue === 'description'">
        <h1 class="question-title">两数之和</h1>
        <div class="question-info">
          <!-- <a-tag color="error">困难</a-tag> -->
          <a-tag color="success">简单</a-tag>
          <!-- <a-tag color="warning">中等</a-tag> -->
          
          <a-tag color="processing">数组</a-tag>
          <a-tag color="processing">哈希表</a-tag>
        </div>
        <a-divider />
        <v-md-editor 
          v-model="questionDescription" 
          mode="preview"
        />
      </div>
      <div v-else-if="radioValue === 'communication'">
        讨论区
      </div>
      <div v-else-if="radioValue === 'solving'">
        题解区
      </div>
      <div v-else-if="radioValue === 'history'">
        提交历史
      </div>
    </div>
  </div>
</template>

<style scoped>
.question-description-header {
  height: 45px;
  display: flex;
  align-items: center;
}

#question-description-title {
  width: 100%;
  /* font-weight: bold; */
}

/* 让单选按钮组使用flex布局 */
#question-description-title :deep(.ant-radio-group) {
  display: flex;
  width: 100%;
}

/* 让每个单选按钮等分宽度 */
#question-description-title :deep(.ant-radio-button-wrapper) {
  flex: 1;
  text-align: center;
  /* line-height: 38px; */
  /* height: 40px; */
}

#question-description-content {
  padding: 17px;
}

#question-description-content .question-title {
  margin-top: 2px;
  margin-bottom: 14px;
  font-size: x-large
}

#question-description-content .question-info {
  display: flex;
  align-items: center;
}

#question-description-content :deep(.github-markdown-body) {
  padding: 0;
}
</style>
