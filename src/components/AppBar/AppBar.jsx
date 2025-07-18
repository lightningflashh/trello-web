import { Link } from 'react-router-dom'

import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

import ModeSelect from '~/components/ModeSelect/ModeSelect'
import AppsIcon from '@mui/icons-material/Apps'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import { ReactComponent as TrelloLogoIcon } from '~/assets/trello.svg'

import WorkSpaces from './Menus/WorkSpaces'
import Recent from './Menus/Recent'
import Started from './Menus/Started'
import Templates from './Menus/Templates'
import Profiles from './Menus/Profiles'
import Notifications from '~/components/AppBar/Notifications/Notifications'
import AutoCompleteSearchBoard from '~/components/AppBar/SearchBoards/AutoCompleteSearchBoard'


const AppBar = () => {
  return (
    <Box px={2} sx={{
      width: '100%',
      height: (theme) => theme.trello.appBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      overflowX: 'auto',
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : '#1565c0')
    }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <Link to="/boards" style={{ color: 'inherit' }}>
          <Tooltip title='Boards'>
            <AppsIcon sx={{ color: 'white', verticalAlign: 'middle' }} />
          </Tooltip>
        </Link>
        <Link to="/" style={{ color: 'inherit' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <SvgIcon
              component={TrelloLogoIcon}
              inheritViewBox
              sx= {{ color: 'white' }}
            />
            <Typography variant='span' sx={{ fontSize: '1rem', fontWeight: 'bold', color: 'white' }}>Trello</Typography>
          </Box>
        </Link>
        <Box sx={{ display: { xs: 'none', md:'flex' }, gap: 1 }}>
          <WorkSpaces />
          <Recent />
          <Started />
          <Templates />
          <Button
            variant='outlined'
            startIcon={<LibraryAddIcon />}
            sx={{ color: 'white' }}
          >Create
          </Button>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <AutoCompleteSearchBoard />
        <ModeSelect />
        <Notifications />
        <Tooltip title='Help'>
          <HelpOutlineIcon sx={{ color: 'white', cursor: 'pointer' }} />
        </Tooltip>
        <Profiles />
      </Box>
    </Box>
  )
}

export default AppBar
