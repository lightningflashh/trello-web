import { experimental_extendTheme as extendTheme } from '@mui/material/styles'
import { red } from '@mui/material/colors'

const theme = extendTheme({
  trello: {
    appBarHeight: '48px',
    boardBarHeight: '58px'
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#1976d2'
        },
        secondary: {
          main: '#dc004e'
        },
        error: {
          main: red.A400
        },
        background: {
          default: '#f5f5f5',
          paper: '#ffffff'
        }
      }
    },
    dark: {
      palette: {
        primary: {
          main: '#bb86fc'
        },
        secondary: {
          main: '#03dac6'
        },
        error: {
          main: red.A400
        },
        background: {
          default: '#121212',
          paper: '#1e1e1e'
        }
      }
    }
  }
})

export default theme