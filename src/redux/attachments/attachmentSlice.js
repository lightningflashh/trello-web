import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

const initialState = {
  attachments: [],
  status: 'idle' // 'idle' | 'loading' | 'succeeded' | 'failed'
}

export const fetchCardAttachments = createAsyncThunk(
  'cardAttachment/fetchAttachmentsAPI',
  async (cardId) => {
    const response = await authorizedAxiosInstance.get(
      `${API_ROOT}/v1/cards/${cardId}/attachments`
    )
    return response.data
  }
)

export const createAttachment = createAsyncThunk(
  'cardAttachment/createNewAttachmentAPI',
  async ({ cardId, attachmentData }, { rejectWithValue }) => {
    try {
      const response = await authorizedAxiosInstance.post(
        `${API_ROOT}/v1/cards/${cardId}/attachments`,
        attachmentData
      )

      return response.data
    } catch (error) {
      console.error(
        'Create attachment error:',
        error.response?.data || error.message
      )

      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const attachmentSlice = createSlice({
  name: 'cardAttachment',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Xử lý fetchAttachments
      .addCase(fetchCardAttachments.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchCardAttachments.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.attachments = action.payload // Gán danh sách lấy được vào state
      })
      .addCase(fetchCardAttachments.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })

      // Xử lý createNewAttachment (Thêm mới)
      .addCase(createAttachment.fulfilled, (state, action) => {
        // Thêm attachment mới vào mảng hiện tại để UI hiển thị ngay lập tức
        state.attachments.push(action.payload)
      })
  }
})

export const attachmentReducer = attachmentSlice.reducer
