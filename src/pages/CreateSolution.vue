<template>
  <div class="create-solution">
    <div class="title">
      <h2>创建题解 · 两数之和</h2>
      <div class="operation">
        <a-input
          placeholder="请输入标题" 
          v-model:value="solutionTitle" 
          :bordered="false"
          style="font-size: 16px;"
        />
        <a-button type="primary" @click="publishSolution" style="margin-right: 10px;">
          <CheckCircleOutlined />发布题解
        </a-button>
      </div>
    </div>
    <div class="solution-content">
      <v-md-editor
        v-model="solutionContent"
        :include-level="[1, 2, 3, 4]"
        :disabled-menus="[]"
        @upload-image="uploadImage"
        height="100%"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { CheckCircleOutlined } from '@ant-design/icons-vue';

const props = defineProps({
  questionID: Number
})
const solutionContent = ref('');
const solutionTitle = ref('');

const uploadImage = (event, insertImage, files) => {
  console.log(event)
  console.log(files)
  insertImage({
    url: 'http://43.138.145.65:9000/user-avatars/sOFQK2CZGNfIQVa6hgFKngTM8jp5u53h.jpg',
    desc: '图片上传示例',
    width: '40',
    height: '40',
  });
}
const publishSolution = () => {
  alert('发布题解');
}
</script>

<style scoped>
.create-solution {
  background-color: white;
  width: 75%;
  margin: 20px auto 0 auto;
  padding: 10px 0 0 0;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.title {
  text-align: center;
}
.title h2 {
  margin-top: 10px;
  margin-bottom: 0;
}
.operation { 
  display: flex;
}

.solution-content {
  margin-top: 20px;
  height: 75vh;
}
.v-md-editor {
  box-shadow: unset;
  border-top: 1px solid #ddd;
}
</style>
