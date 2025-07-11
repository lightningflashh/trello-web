import { useEffect } from 'react'

import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import Container from '@mui/material/Container'
import {
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
  moveCardToDifferentColumnAPI } from '~/apis'


import { fetchBoardDetailsAPI, updateCurrentActiveBoard, selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { useDispatch, useSelector } from 'react-redux'

import { useParams } from 'react-router-dom'

import { cloneDeep } from 'lodash'

import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'

const Board = () => {
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)
  const { boardId } = useParams()

  useEffect(() => {
    dispatch(fetchBoardDetailsAPI(boardId))
  }, [dispatch, boardId])

  // Function to handle moving a column completely
  const moveColumns = (dndOrderedColumns) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map(col => col._id)

    const updatedBoard = { ...board }
    updatedBoard.columns = dndOrderedColumns
    updatedBoard.columnOrderIds = dndOrderedColumnsIds
    dispatch(updateCurrentActiveBoard(updatedBoard))
    // Call API to save the new order
    updateBoardDetailsAPI(board._id, { columnOrderIds: dndOrderedColumnsIds })
  }

  const moveCardInAColumn = (columnId, dndOrderedCards, dndOrderedCardOrderIds) => {
    const updatedBoard = cloneDeep(board)
    const updatedColumn = updatedBoard.columns.find(column => column._id === columnId)
    if (updatedColumn) {
      updatedColumn.cards = dndOrderedCards
      updatedColumn.cardOrderIds = dndOrderedCardOrderIds
    }
    dispatch(updateCurrentActiveBoard(updatedBoard))
    // Call API to save the new order
    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardOrderIds })
  }

  const moveCardToDifferentColumn = (currentCardId, prevColumnId, nextColumnId, dndOrderedColumns) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map(col => col._id)
    const updatedBoard = { ...board }
    updatedBoard.columns = dndOrderedColumns
    updatedBoard.columnOrderIds = dndOrderedColumnsIds
    dispatch(updateCurrentActiveBoard(updatedBoard))
    // Check if the previous column has a placeholder card => DO NOT SAVE IT TO DATABASE
    let prevCardOrderIds = dndOrderedColumns.find(col => col._id === prevColumnId)?.cardOrderIds
    if (prevCardOrderIds[0].includes('placeholder-card')) prevCardOrderIds = []
    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find(col => col._id === nextColumnId)?.cardOrderIds
    })
  }

  if (!board) {
    // Do phải sắp xêp dữ liệu từ API nên có thể mất một chút thời gian để lấy dữ liệu
    return <PageLoadingSpinner caption="Loading board details..." />
  }

  return (
    <>
      <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
        <AppBar/>
        <BoardBar board={board}/>
        <BoardContent
          board={board}
          moveColumns={moveColumns}
          moveCardInAColumn={moveCardInAColumn}
          moveCardToDifferentColumn={moveCardToDifferentColumn}
        />
      </Container>
    </>
  )
}

export default Board
