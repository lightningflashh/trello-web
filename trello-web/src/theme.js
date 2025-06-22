import { experimental_extendTheme as extendTheme } from '@mui/material/styles'
import { red } from '@mui/material/colors'

const theme = extendTheme({
  trello: {
    appBarHeight: '58px',
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
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          '*::webkit-scrollbar': {
            width: '8px',
            height: '8px'
          },
          '*::webkit-scrollbar-thumb': {
            backgroundColor: '#dcdde1 !important',
            borderRadius: '8px'
          },
          '*::webkit-scrollbar-thumb::hover': {
            backgroundColor: 'white !important'
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderWidth: '0.5px',
          '&:hover': {
            borderWidth: '1px'
          }
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { fontSize: '0.875rem' }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          '& fieldset': { borderWidth: '0.5px !important' },
          '&:hover fieldset': { borderWidth: '1px !important' },
          '&.Mui-focused fieldset': { borderWidth: '1px !important' }
        }
      }
    }
  }
})

export default theme
