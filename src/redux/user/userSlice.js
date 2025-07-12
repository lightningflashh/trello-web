import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit'

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

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUserAPI.fulfilled, (state, action) => {
        state.currentUser = action.payload
      })
  }
})

// export const {} = userSlice.actions

export const selectCurrentUser = (state) => state.user.currentUser

export const userReducer = userSlice.reducer
