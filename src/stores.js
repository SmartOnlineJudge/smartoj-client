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

export const useQuestionStore = defineStore('question', () => {
  const question = ref({})
  const judgeRecords = ref([])
  const judgeType = ref('')

  const setQuestion = _question => {
    question.value = _question
  }

  const setJudgeRecords = _judgeRecords => {
    judgeRecords.value = _judgeRecords
  }

  const setJudgeType = _judgeType => {
    judgeType.value = _judgeType
  }

  return { 
    question, 
    setQuestion, 
    judgeRecords, 
    setJudgeRecords, 
    judgeType, 
    setJudgeType 
  }
})
