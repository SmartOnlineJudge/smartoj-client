import axios from "axios";

export const requests = axios.create({
  baseURL: '/api',
  withCredentials: true
})
