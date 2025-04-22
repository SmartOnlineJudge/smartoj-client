import { ref } from "vue";
import { defineStore } from "pinia";

export const useUserStore = defineStore('user', () => {
  const isLogin = ref(false);
  const user = ref({})

  const setUser = _user => {
    user.value = _user
  }

  return { isLogin, user, setUser }
})
