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
  const judgeID = ref(1)
  const requireJumpToSolvingHistory = ref(1)
  const code = ref("")

  const setQuestion = _question => {
    question.value = _question
  }

  const setJudgeRecords = _judgeRecords => {
    judgeRecords.value = _judgeRecords
  }

  const setJudgeType = _judgeType => {
    judgeType.value = _judgeType
  }

  const incrementJudgeID = () => {
    judgeID.value += 1
  }

  const incrementRequireJumpToSolvingHistory = _requireJumpToSolvingHistory => {
    requireJumpToSolvingHistory.value += 1
  }

  const setCode = _code => {
    code.value = _code
  }

  return { 
    question, 
    setQuestion, 
    judgeRecords, 
    setJudgeRecords, 
    judgeType, 
    setJudgeType,
    judgeID,
    incrementJudgeID,
    requireJumpToSolvingHistory,
    incrementRequireJumpToSolvingHistory,
    code,
    setCode
  }
})
