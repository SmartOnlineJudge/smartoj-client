import axios from "axios";

export const requests = axios.create({
  baseURL: '/api',
  withCredentials: true
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
