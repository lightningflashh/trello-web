import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

const initialState = {
  currentUser: null
}

export const loginUserAPI = createAsyncThunk(
  'user/loginUserAPI',
  async (credentials) => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/login`, credentials)
    // response.data sẽ là dữ liệu trả về từ API
    return response.data
  }
)

export const logoutUserAPI = createAsyncThunk(
  'user/logoutUserAPI',
  async (showSuccessMessage = true) => {
    const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/users/logout`)
    if (showSuccessMessage) {
      toast.success('Logout successful')
    }
    return response.data
  }
)

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUserAPI.fulfilled, (state, action) => {
        state.currentUser = action.payload
      })
    builder
      .addCase(logoutUserAPI.fulfilled, (state) => {
        // Xóa thông tin người dùng hiện tại khi đăng xuất
        // Kết hợp Protected Route => Điều hướng về trang đăng nhập
        state.currentUser = null
      })
  }
})

// export const {} = userSlice.actions

export const selectCurrentUser = (state) => state.user.currentUser

export const userReducer = userSlice.reducer
