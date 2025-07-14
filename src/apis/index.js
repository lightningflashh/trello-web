import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

import { toast } from 'react-toastify'

export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/boards/${boardId}`, updateData)
  return response.data
}

export const moveCardToDifferentColumnAPI = async (updateData) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/boards/supports/moving_card`, updateData)
  return response.data
}

/* column APIs */
export const createNewColumnAPI = async (columnData) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/columns`, columnData)
  return response.data
}

export const updateColumnDetailsAPI = async (columnId, updateData) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/columns/${columnId}`, updateData)
  return response.data
}

export const deleteColumnDetailsAPI = async (columnId) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/columns/${columnId}`)
  return response.data
}

/* card APIs */
export const createNewCardAPI = async (cardData) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/cards`, cardData)
  return response.data
}

/** Users */
export const registerUserAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/v1/users/register`,
    data
  )

  toast.success(
    'Account created successfully! Please check and verify your account before logging in!',
    { theme: 'colored' }
  )

  return response.data
}

export const verifyUserAPI = async (data) => {
  const response = await authorizedAxiosInstance.put(
    `${API_ROOT}/v1/users/verify`,
    data
  )

  toast.success(
    'Account verified successfully! Now you can login to enjoy our services! Have a good day!',
    { theme: 'colored' }
  )

  return response.data
}

export const refreshTokenAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/users/refresh_token`)
  return response.data
}

export const fetchBoardsAPI = async (searchPath) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/boards${searchPath}`)
  return response.data
}

export const createNewBoardAPI = async (boardData) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/boards`, boardData)
  toast.success('Board created successfully!')
  return response.data
}
