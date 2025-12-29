<script setup>
import { message } from "ant-design-vue";
import router from "@/router/index.js";
import { userLogin } from "@/http.js";
import { requestAndUpdateUser } from "@/utils.js";

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

const oAuth2Login = () => {
  let redirectURL = '/login';
  userLogin({ code: props.code, auth_type: props.app }).then(response => {
    if (response.data.code === 300) {
      message.success('登录成功，页面正在跳转……')
      redirectURL = '/user/user-center'
      requestAndUpdateUser().then(() => {})
    } else {
      message.error('登录失败，请重新尝试')
      redirectURL = '/login'
    }
  }).catch(() => {
    message.error("登录异常，请联系网站管理员")
    redirectURL = '/login'
  }).finally(() => {
    setTimeout(() => {
      router.push(redirectURL);
    }, 2000)
  })
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
  oAuth2Login()
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
        <img v-if="props.app === 'github'" src="/github-mark.svg" width="80" alt="github logo"/>
        <img v-else-if="props.app === 'qq'" src="/qq-mask.png" width="80" alt="qq logo"/>
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