import axios from 'axios'

import { toast } from 'react-toastify'

import { interceptorLoadingElements } from '~/utils/formatters'

import { refreshTokenAPI } from '~/apis'
import { logoutUserAPI } from '~/redux/user/userSlice'

/**
 * Không thể import { store } from '~/redux/store' theo cách thông thường ở đây
 * Giải pháp: Inject store — là kỹ thuật khi cần sử dụng biến redux store ở các file ngoài phạm vi component
 * như file authorizeAxios hiện tại.
 * Hiểu đơn giản: khi ứng dụng bắt đầu chạy lên, code sẽ chạy vào main.jsx đầu tiên,
 * từ bên đó chúng ta gọi hàm injectStore ngay lập tức để gán biến mainStore vào biến axiosReduxStore cục bộ trong file này.
 *
 * https://redux.js.org/faq/code-structure#how-can-i-use-the-redux-store-in-non-component-files
 */

let axiosReduxStore
export const injectStore = mainStore => { axiosReduxStore = mainStore }

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

/* * Khởi tạo một cái promise cho việc gọi api refresh_token
* Mục đích tạo promise này là để khi gọi api refresh_token rồi mới retry lại nhiều api bị lỗi trước đó
 */
let refreshTokenPromise =


  authorizedAxiosInstance.interceptors.response.use((response) => {
    interceptorLoadingElements(false) // Tắt loading khi có response trả về
    return response
  }, (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error

    interceptorLoadingElements(false) // Tắt loading khi có lỗi xảy ra

    /**Quan trọng: Xử lý Refresh Token tự động */

    // Trường hợp 1: Nếu như nhận mã 401 từ BE, thì gọi API đăng xuất luôn
    if (error?.response?.status === 401) {
      axiosReduxStore.dispatch(logoutUserAPI(false))
    }

    // Trường hợp 2: Nếu như nhận mã 410 từ BE, thì sẽ gọi API refresh token để làm mới lại accessToken
    // Đầu tiên lấy được các request API đang bị lỗi thông qua error.config
    const originalRequests = error.config
    if (error?.response?.status === 410 && !originalRequests._retry) {
      // Đánh dấu request này đã được retry lại, gọi 1 lần tại 1 thời điểm
      // do có cái return promise ở dưới bỏ cái này đi //!originalRequests._retry
      originalRequests._retry = true

      // Nếu như chưa có promise nào đang chạy thì mới gọi API refresh token
      if (!refreshTokenPromise) {
        refreshTokenPromise = refreshTokenAPI()
          .then((data) => {
            // đồng thời accessToken đã nằm trong cookie httpOnly (xử lý ở BE)
            return data?.accessToken
          })
          .catch((err) => {
            // Nếu có lỗi thì logout luôn
            axiosReduxStore.dispatch(logoutUserAPI(false))
            // Trả về một promise reject để không retry lại các request trước đó
            // return Promise.reject(err)
          })
          .finally(() => {
            //Dù API refresh token thành công hay thất bại thì cũng sẽ reset lại promise
            refreshTokenPromise = null
          })
      }

      // Cần return trường hợp refreshTokenPromise chạy thành công và xử lý thêm ở đây:
      // eslint-disable-next-line no-unused-vars
      return refreshTokenPromise.then(accessToken => {
        /**
         * Bước 1: Đối với Trường hợp nếu dự án cần lưu accessToken vào localStorage hoặc đâu đó thì sẽ viết thêm code xử lý ở đây.
         * → Hiện tại ở đây không cần bước 1 này vì chúng ta đã đưa accessToken vào cookie (xử lý từ phía BE)
         * sau khi API refreshToken được gọi thành công.
         * Ví dụ: axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
         */

        // Bước 2: Bước Quan trọng: Return lại axios instance của chúng ta kết hợp các originalRequests để gọi lại những API ban đầu bị lỗi
        return authorizedAxiosInstance(originalRequests)
      })
    }

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