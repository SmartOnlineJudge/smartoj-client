<template>
  <div class="create-solution">
    <a-skeleton :loading="getSolutionLoading" :paragraph="{ rows: 15 }" active>
      <div class="title">
        <h2>创建题解 · {{ questionTitle }}</h2>
        <div class="operation">
          <a-input
            placeholder="请输入标题" 
            v-model:value="solutionTitle" 
            :bordered="false"
            style="font-size: 16px;"
          />
          <a-button 
            v-if="!solutionID" 
            type="primary" 
            @click="() => { publishOrUpdateSolution(true) }" 
            style="margin-right: 10px;"
            :loading="publishOrUpdateLoading"
            :disabled="solutionTitle === '' || solutionContent === ''"
          >
            <CheckCircleOutlined />发布题解
          </a-button>
          <a-button 
            v-else type="primary" 
            @click="() => { publishOrUpdateSolution(false) }" 
            style="margin-right: 10px;" 
            :loading="publishOrUpdateLoading"
            :disabled="solutionTitle === '' || solutionContent === ''"
          >
            <EditOutlined />更新题解
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
    </a-skeleton>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { CheckCircleOutlined, EditOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

import {
  getOnlineSovlingQuestionInfo, 
  getSolution, 
  createSolution, 
  updateSolution, 
  getUploadImagePresignedUrl
} from '@/http';
import router from "@/router/index.js";

const props = defineProps({
  questionID: Number
})
const MINIO_URL = import.meta.env.VITE_MINIO_URL
const solutionContent = ref('');
const solutionTitle = ref('');
const questionTitle = ref('');
const solutionID = ref(null)
const getSolutionLoading = ref(false)
const publishOrUpdateLoading = ref(false)

onMounted(async () => {
  getSolutionLoading.value = true
  const response1 = await getOnlineSovlingQuestionInfo(props.questionID)
  if (!response1.data.data) {
    router.push("/404")
    return
  }
  questionTitle.value = response1.data.data.title
  const response2 = await getSolution(null, props.questionID)
  if (response2.data.code === 255) {
    getSolutionLoading.value = false
    return
  }
  solutionTitle.value = response2.data.data.title
  solutionContent.value = response2.data.data.content
  solutionID.value = response2.data.data.id
  getSolutionLoading.value = false
})

const uploadImage = async (_, insertImage, files) => {
  const file = files[0]
  const originalFilename = file.name
  const hide = message.loading('正在上传图片……', 0);
  const fileTypeSuffix = originalFilename.substring(originalFilename.lastIndexOf('.') + 1)
  const signatureResponse = await getUploadImagePresignedUrl(fileTypeSuffix)
  const signatureResponseData = signatureResponse.data.data
  const url = signatureResponseData.url
  const filename = signatureResponseData.filename
  const filepath = signatureResponseData.filepath

  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file
  });

  if (response.ok) {
    setTimeout(() => { hide(); message.success("图片上传成功！") }, 100);
    insertImage({
      url: MINIO_URL + filepath,
      desc: filename,
      width: '100%',
      height: '100%',
    });
  } else {
    const errorText = await response.text();
    console.error('上传图片失败：', errorText);
    message.error('上传图片失败');
  }
}
const publishOrUpdateSolution = async (createMode) => {
  publishOrUpdateLoading.value = true
  let response = null
  let successMessage = null
  if (createMode) {
    response = await createSolution(props.questionID, solutionContent.value, solutionTitle.value)
    successMessage = '题解创建成功！正在跳转到题目详情页面……'
  } else {
    response = await updateSolution(solutionID.value, solutionContent.value, solutionTitle.value)
    successMessage = '题解修改成功！正在跳转到题目详情页面……'
  }
  const responseData = response.data
  if (responseData.code === 200) {
    message.success(successMessage)
    setTimeout(() => {
      router.push(`/coding/${props.questionID}`)
    }, 2000);
  } else {
    message.error(responseData.message)
  }
  publishOrUpdateLoading.value = false
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
