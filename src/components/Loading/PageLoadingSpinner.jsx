import Typography from '@mui/material/Typography'
import { Box } from '@mui/material'

import CircularProgress from '@mui/material/CircularProgress'


const PageLoadingSpinner = ({ caption }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100vw', gap: 2 }}>
      <CircularProgress />
      <Typography>{caption}</Typography>
    </Box>
  )
}

export default PageLoadingSpinner