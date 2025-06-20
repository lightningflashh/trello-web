import { useColorScheme } from '@mui/material'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

function ModeToogle() {
  const { mode, setMode } = useColorScheme()
  return (
    <Button
      variant="outlined"
      onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
    >
      Switch to {mode === 'light' ? 'dark' : 'light'} mode
    </Button>
  )
}

function App() {
  return (
    <>
      <ModeToogle />
      <div>
        <h1>Click me!</h1>
      </div>
      <Button variant="contained">Hello world</Button>
      <Typography variant="body2" color="text.secondary">
        Hello world
      </Typography>
    </>
  )
}

export default App
