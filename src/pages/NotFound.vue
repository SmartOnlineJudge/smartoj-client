<template>
  <a-result 
    status="404" 
    title="404" 
    sub-title="访问了不存在的页面"
  >
    <template #extra>
      <a-button type="primary" @click="() => { router.push('/') }">返回主页</a-button>
    </template>
  </a-result>
</template>

<script setup>
import router from "@/router/index.js";
</script>
