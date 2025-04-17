<script setup>
import { QqOutlined, GithubFilled } from "@ant-design/icons-vue";
import router from "@/router/index.js";

const props = defineProps({
  app: String,
  code: String
})

// 判断当前页面的访问是否合法
const judgeIsValid = () => {
  if (!(props.app === 'github' || props.app === 'qq')) {
    return false;
  }
  if (props.app === 'github' && props.code !== undefined) {
    return true;
  } else if (props.app === 'qq') {
    console.log('qq登录')
    return true;
  } else {
    return false;
  }
}
const isValid = judgeIsValid()
let title, subTitle, status;

if (!isValid) {
  title = '404 Not Found';
  subTitle = '抱歉，当前页面不存在，请重试'
  status = '404'
} else {
  title = '成功与第三方平台授权！';
  subTitle = '系统后台正在处理相应请求，请不要关闭当前页面，稍等片刻，等待页面重定向……'
  status = 'info'
}
</script>

<template>
  <div style="margin-top: 90px">
    <a-result
        :title="title"
        :sub-title="subTitle"
        :status="status"
    >
      <template #icon>
        <GithubFilled v-if="props.app === 'github'" />
        <QqOutlined v-else-if="props.app === 'qq'" />
      </template>
      <template #extra>
        <a-spin v-if="isValid" :spinning="true" size="large"></a-spin>
        <a-button v-else type="primary" @click="() => { router.push('/') }">回到主页</a-button>
      </template>
    </a-result>
  </div>
</template>

<style scoped>

</style>