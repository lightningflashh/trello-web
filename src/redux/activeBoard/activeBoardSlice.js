import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'
import { mapOrder } from '~/utils/sorts'

const initialState = {
  currentActiveBoard: null
}

// Dùng middlewares createAsyncThunk để xử lý bất đồng bộ (asynchronous data) đi kèm với extraReducers
export const fetchBoardDetailsAPI = createAsyncThunk(
  'activeBoard/fetchBoardDetailsAPI',
  async (boardId) => {
    const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
    // response.data sẽ là dữ liệu trả về từ API
    return response.data
  }
)

export const activeBoardSlice = createSlice({
  name: 'activeBoard',
  initialState,
  // reducers --> handle synchronous data
  reducers: {
    updateCurrentActiveBoard: (state, action) => {
      // action.payload --> this is a standard way to pass data to the reducer
      const fullBoard = action.payload

      // Handle data update

      // Update the current active board
      state.currentActiveBoard = fullBoard
    }
  },
  // extraReducers --> handle asynchronous data
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
        // action.payload --> this is the data returned from the API
        let board = action.payload

        // Sắp xếp trước khi đưa dữ liệu xuống các component con
        board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')

        board.columns.forEach(column => {
          if (isEmpty(column.cards)) {
            column.cards = [generatePlaceholderCard(column)]
            column.cardOrderIds = [generatePlaceholderCard(column)._id]
          } else {
            // Sắp xếp các thẻ trong mỗi cột theo thứ tự đã lưu trước khi đưa xuống component con
            column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
          }
        })

        state.currentActiveBoard = board
      })
  }
})

// Actions: Là nơi dành cho các component gọi bằng dispatch() để cập nhật dữ liệu thông qua reducer (synchronous data)
// redux toolkit sẽ tự động tạo ra các action tương ứng với các reducer
export const { updateCurrentActiveBoard } = activeBoardSlice.actions

// Selectors: Là nơi dành cho các component gọi bằng hook useSelector() để lấy dữ liệu từ state (synchronous data)
export const selectCurrentActiveBoard = (state) => state.activeBoard.currentActiveBoard

// cần export reducer để redux toolkit có thể sử dụng
export default activeBoardSlice.reducer
