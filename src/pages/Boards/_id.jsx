import { useEffect, useState } from 'react'

import { Box, CircularProgress } from '@mui/material'

import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import Container from '@mui/material/Container'
import { fetchBoardDetailsAPI, createNewColumnAPI, createNewCardAPI, updateBoardDetailsAPI, updateColumnDetailsAPI } from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'
import { mapOrder } from '~/utils/sorts'

const Board = () => {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    // Simulate fetching board data
    const boardId = '68639eea385e6f83eb4ac36d'
    fetchBoardDetailsAPI(boardId)
      .then(board => {
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
        setBoard(board)
      })
  }, [])

  const createNewColumn = async (columnData) => {
    const newColumn = await createNewColumnAPI({ ...columnData, boardId: board._id })
    // Generate a placeholder card for the new column to ensure it has at least one card for drag-and-drop
    newColumn.cards = [generatePlaceholderCard(newColumn)]
    newColumn.cardOrderIds = [generatePlaceholderCard(newColumn)._id]
    // Update the board state with the new column
    const updatedBoard = { ...board }
    await updatedBoard.columns.push(newColumn)
    await updatedBoard.columnOrderIds.push(newColumn._id)
    setBoard(updatedBoard)
  }

  const createNewCard = async (cardData) => {
    const newCard = await createNewCardAPI({ ...cardData, boardId: board._id, columnId: cardData.columnId })
    // Update the board state with the new card
    const updatedBoard = { ...board }
    // Find the column where the new card should be added
    const updatedColumn = updatedBoard.columns.find(column => column._id === newCard.columnId)
    if (updatedColumn) {
      updatedColumn.cards.push(newCard)
      updatedColumn.cardOrderIds.push(newCard._id)
    }
    setBoard(updatedBoard)
  }
  // Function to handle moving a column completely
  const moveColumns = (dndOrderedColumns) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map(col => col._id)

    const updatedBoard = { ...board }
    updatedBoard.columns = dndOrderedColumns
    updatedBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard(updatedBoard)
    // Call API to save the new order
    updateBoardDetailsAPI(board._id, { columnOrderIds: dndOrderedColumnsIds })
  }

  const moveCardInAColumn = (columnId, dndOrderedCards, dndOrderedCardOrderIds) => {
    const updatedBoard = { ...board }
    const updatedColumn = updatedBoard.columns.find(column => column._id === columnId)
    if (updatedColumn) {
      updatedColumn.cards = dndOrderedCards
      updatedColumn.cardOrderIds = dndOrderedCardOrderIds
    }
    setBoard(updatedBoard)
    // Call API to save the new order
    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardOrderIds })
  }

  if (!board) {
    // Do phải sắp xêp dữ liệu từ API nên có thể mất một chút thời gian để lấy dữ liệu
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>
  }

  return (
    <>
      <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
        <AppBar/>
        <BoardBar board={board}/>
        <BoardContent
          board={board}
          createNewColumn={createNewColumn}
          createNewCard={createNewCard}
          moveColumns={moveColumns}
          moveCardInAColumn={moveCardInAColumn}
        />
      </Container>
    </>
  )
}

export default Board
