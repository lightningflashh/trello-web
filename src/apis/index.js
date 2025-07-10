import authorizeAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/boards/${boardId}`, updateData)
  return response.data
}

export const moveCardToDifferentColumnAPI = async (updateData) => {
  const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/boards/supports/moving_card`, updateData)
  return response.data
}

/* column APIs */
export const createNewColumnAPI = async (columnData) => {
  const response = await authorizeAxiosInstance.post(`${API_ROOT}/v1/columns`, columnData)
  return response.data
}

export const updateColumnDetailsAPI = async (columnId, updateData) => {
  const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/columns/${columnId}`, updateData)
  return response.data
}

export const deleteColumnDetailsAPI = async (columnId) => {
  const response = await authorizeAxiosInstance.delete(`${API_ROOT}/v1/columns/${columnId}`)
  return response.data
}

/* card APIs */
export const createNewCardAPI = async (cardData) => {
  const response = await authorizeAxiosInstance.post(`${API_ROOT}/v1/cards`, cardData)
  return response.data
}