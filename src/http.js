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

export const getSubmitRecord = (submitRecordID, questionID) => {
  const params = questionID ? { question_id: questionID } : { submit_record_id: submitRecordID }
  return requests.get('/codesandbox/submit-record', { params: params })
}

export const getJudgeRecord = (submitRecordID, requireInputOutput) => {
  let params = {}
  if (requireInputOutput !== undefined) {
    params = { 
      require_input_output: requireInputOutput,
      submit_record_id: submitRecordID
    }
  } else {
    params = { submit_record_id: submitRecordID }
  }
  return requests.get('/codesandbox/judge-record', { params: params })
}

export const getLanguageList = () => {
  return requests.get('/question/languages')
}

export const getPassedCountGroupByDifficulty = () => {
  return requests.get('/user/passed-count-group-by-difficulty')
}

export const getQuestionCountGroupByDifficulty = () => {
  return requests.get('/question/count-group-by-difficulty')
}

export const getSolutionHeatmap = () => {
  return requests.get('/user/solution-heatmap')
}

export const getSubmitRecords = (page, size) => {
  return requests.get('/user/submit-records', { params: { page: page, size: size } })
}

export const updateUserInfo = (name, profile) => {
  return requests.put('/user', { name, profile })
}

export const updatePassword = (new_password, vfcode) => {
  return requests.patch('/user/password',
    {
      new_password: new_password,
      vfcode: vfcode
    }
  )
}

export const updateEmail = (new_email, vfcode) => {
  return requests.patch('/user/email',
    {
      new_email: new_email,
      vfcode: vfcode
    }
  )
}

export const verifyCode = (recipient) => {
  return requests.post('/user/verification-code', {recipient: recipient})
}

export const checkVerifyCode = (vfcode, email) => {
  return requests.post('/user/check-verification-code', {vfcode: vfcode, email: email})
}

export const getRootComments = (targetID, CommentType, page, size) => {
  return requests.get(
    '/comment/root-comments', 
    { 
      params: { 
        target_id: targetID,
        comment_type: CommentType,
        page: page,
        size: size
      }
    }
  )
}

export const getChildComments = (rootCommentID, cursor, size) => {
  return requests.get(
    '/comment/child-comments',
    {
      params: {
        root_comment_id: rootCommentID,
        cursor: cursor,
        size: size
      }
    }
  )
}

export const createComment = (content, type, targetID, toCommentID = null, rootCommentID = null) => {
  return requests.post(
    '/comment',
    {
      content: content,
      type: type,
      target_id: targetID,
      to_comment_id: toCommentID,
      root_comment_id: rootCommentID
    }
  )
}

export const getCommentCount = (targetID, commentType) => {
  return requests.get(
    '/comment/count',
    {
      params: {
        target_id: targetID,
        comment_type: commentType
      }
    }
  )
}

export const getSolutionList = (questionID, cursor, size) => {
  return requests.get(
    '/solution/list',
    {
      params: {
        question_id: questionID,
        cursor: cursor,
        size: size
      }
    }
  )
}

export const getSolution = (solutionID) => {
  return requests.get(
    '/solution',
    {
      params: {
        solution_id: solutionID
      }
    }
  )
}
