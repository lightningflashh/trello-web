import { useEffect, useState } from 'react'

import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import Container from '@mui/material/Container'
import { fetchBoardDetailsAPI } from '~/apis'

const Board = () => {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    // Simulate fetching board data
    const boardId = '686352914b45dfbda0636f99'
    fetchBoardDetailsAPI(boardId)
      .then(board => {
        setBoard(board)
      })
      .catch(error => {
        console.error('Error fetching board details:', error)
      })
  }, [])

  return (
    <>
      <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
        <AppBar/>
        <BoardBar board={board}/>
        <BoardContent board={board}/>
      </Container>
    </>
  )
}

export default Board
