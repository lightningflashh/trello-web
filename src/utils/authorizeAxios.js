import axios from 'axios'

import { toast } from 'react-toastify'

import { interceptorLoadingElements } from '~/utils/formatters'

let authorizedAxiosInstance = axios.create()

authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10

// Sẽ cho phép axios gửi cookie trong request lên server (lưu trữ token vào trong httpOnly cookie)
authorizedAxiosInstance.defaults.withCredentials = true

authorizedAxiosInstance.interceptors.request.use((config) => {
  interceptorLoadingElements(true) // Bật loading cho tất cả các request tránh double click
  return config
}, (error) => {
  // Do something with request error
  return Promise.reject(error)
})

authorizedAxiosInstance.interceptors.response.use((response) => {
  interceptorLoadingElements(false) // Tắt loading khi có response trả về
  return response
}, (error) => {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error

  interceptorLoadingElements(false) // Tắt loading khi có lỗi xảy ra

  let errorMessage = error?.message
  if (error?.response?.data?.message) {
    errorMessage = error.response?.data?.message
  }
  // Nếu lỗi là do access token hết hạn thì sẽ không hiển thị thông báo lỗi
  if (error.response?.status !== 410) {
    toast.error(errorMessage)
  }
  return Promise.reject(error)
})

export default authorizedAxiosInstance