import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('../pages/Index.vue')
    },
    {
      path: '/coding/:questionID',
      name: 'coding',
      component: () => import('../pages/Coding.vue'),
      props: route => ({ questionID: Number(route.params.questionID) }),
    },
    {
      path: '/questions',
      name: 'questions',
      component: () => import('../pages/Questions.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../pages/About.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../pages/LoginRegister.vue')
    },
    {
      path: '/login/oauth/redirect/:app',
      name: 'oauth-redirect',
      component: () => import('../pages/OAuthRedirect.vue'),
      props: route => ({ code: route.query.code, app: route.params.app }),
    },
    {
      path: '/user/user-center',
      name: 'user-center',
      component: () => import('../pages/user/UserCenter.vue')
    },
    {
      path: '/user/user-account',
      name: 'user-account',
      component: () => import('../pages/user/UserAccount.vue')
    },
    {
      path: '/user/new-question',
      name: 'new-question',
      component: () => import('../pages/user/NewQuestion.vue')
    },
    {
      path: '/user/my-message',
      name: 'my-message',
      component: () => import('../pages/user/MyMessage.vue')
    },
    {
      path: '/create-solution/:questionID',
      name: 'create-solution',
      component: () => import('../pages/CreateSolution.vue'),
      props: route => ({ questionID: Number(route.params.questionID) }),
    },
    {
      path: '/404',
      name: 'not-found',
      component: () => import('../pages/NotFound.vue'),
      meta: {
        title: '找不到该页面'
      }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/404'
    }
  ]
})

export default router
