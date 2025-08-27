import { ContactsFilled } from "@ant-design/icons-vue";
import axios from "axios";

export const requests = axios.create({
  baseURL: '/api',
  withCredentials: true,
  timeout: 1000 * 10,
})


export const getCurrentUser = () => {
  return requests.get("/user")
}

export const userLogin = formData => {
  return requests.post('/user/login', formData)
}

export const userLogout = () => {
  return requests.post('/user/logout')
}

export const sendEmailVerificationCode = email => {
  return requests.post('/user/verification-code', { recipient: email })
}

export const userRegister = formData => {
  return requests.post('/user/register', formData)
}

export const getOnlineSovlingQuestionInfo = questionID => {
  return requests.get('/question/online-solving', { params: { question_id: questionID } })
}

export const judgeQuestion = (questionID, code, languageID, judgeType) => {
  return requests.post('/codesandbox/judgement', 
    { question_id: questionID, code: code, language_id: languageID, judge_type: judgeType }
  )
}

export const getSubmitRecord = submitRecordID => {
  return requests.get('/codesandbox/submit-record', { params: { submit_record_id: submitRecordID } })
}

export const getJudgeRecord = submitRecordID => {
  return requests.get('/codesandbox/judge-record', { params: { submit_record_id: submitRecordID } })
}

export const getLanguageList = () => {
  return requests.get('/question/languages')
}
