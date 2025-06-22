import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BorderContent'
import Container from '@mui/material/Container'

const Board = () => {
  return (
    <>
      <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
        <AppBar/>
        <BoardBar/>
        <BoardContent/>
      </Container>
    </>
  )
}

export default Board
