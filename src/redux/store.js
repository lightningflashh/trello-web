import { configureStore } from '@reduxjs/toolkit'
import activeBoardReducer from '~/redux/activeBoard/activeBoardSlice'
import { userReducer } from '~/redux/user/userSlice'

import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

// Redux Persist configuration
const rootPersistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'] // Chỉ định các slice dữ liệu ĐƯỢC PHÉP duy trì qua mỗi lần f5 trình duyệt
}

const reducers = combineReducers({
  activeBoard: activeBoardReducer,
  user: userReducer
})

const persistedReducer = persistReducer(rootPersistConfig, reducers)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})