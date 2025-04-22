import { useUserStore } from "@/stores.js";
import { getCurrentUser } from "@/http.js";


export const requestAndUpdateUser = async onError => {
  const userStore = useUserStore();
  try {
    const response = await getCurrentUser()
    const currentUser = response.data.data
    userStore.setUser(currentUser)
    userStore.isLogin = true
  } catch (error) {
    if (onError) {
      onError(error)
    }
  }
}