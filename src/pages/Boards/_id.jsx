import { useEffect, useState } from 'react'

import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import Container from '@mui/material/Container'
import { fetchBoardDetailsAPI, createNewColumnAPI, createNewCardAPI, updateBoardDetailsAPI } from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'

const Board = () => {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    // Simulate fetching board data
    const boardId = '68639eea385e6f83eb4ac36d'
    fetchBoardDetailsAPI(boardId)
      .then(board => {
        board.columns.forEach(column => {
          if (isEmpty(column.cards)) {
            column.cards = [generatePlaceholderCard(column)]
            column.cardOrderIds = [generatePlaceholderCard(column)._id]
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
  const moveColumns = async (dndOrderedColumns) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map(col => col._id)

    const updatedBoard = { ...board }
    updatedBoard.columns = dndOrderedColumns
    updatedBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard(updatedBoard)
    // Call API to save the new order
    await updateBoardDetailsAPI(board._id, { columnOrderIds: dndOrderedColumnsIds })
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
        />
      </Container>
    </>
  )
}

export default Board
