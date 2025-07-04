import { useState } from 'react'

import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import TextField from '@mui/material/TextField'
import Badge from '@mui/material/Badge'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import InputAdornment from '@mui/material/InputAdornment'
import Box from '@mui/material/Box'

import ModeSelect from '~/components/ModeSelect/ModeSelect'
import AppsIcon from '@mui/icons-material/Apps'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import { ReactComponent as TrelloLogoIcon } from '~/assets/trello.svg'

import WorkSpaces from './Menus/WorkSpaces'
import Recent from './Menus/Recent'
import Started from './Menus/Started'
import Templates from './Menus/Templates'
import Profiles from './Menus/Profiles'


const AppBar = () => {
  const [searchValue, setSearchValue] = useState('')

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value)
  }

  const handleOnClickClose = () => {
    setSearchValue('')
  }

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
        <AppsIcon sx={{ color: 'white' }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <SvgIcon
            component={TrelloLogoIcon}
            inheritViewBox
            sx= {{ color: 'white' }}
          />
          <Typography variant='span' sx={{ fontSize: '1rem', fontWeight: 'bold', color: 'white' }}>Trello</Typography>
        </Box>
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
        <TextField
          id='outlined-search'
          variant='outlined'
          size='small'
          label='Search...'
          type='text'
          value={searchValue}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon sx={{ color: 'white' }}/>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position='end'>
                <CloseIcon
                  fontSize='small'
                  sx={{ color: searchValue ? 'white' : 'transparent', cursor: 'pointer' }}
                  onClick={handleOnClickClose}
                />
              </InputAdornment>
            )
          }}
          sx={{
            minWidth: '120px',
            maxWidth: '180px',
            '& label': { color: 'white' },
            '& input': { color: 'white' },
            '& label.Mui-focused': { color: 'white' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'white' },
              '&:hover fieldset': { borderColor: 'white' },
              '&.Mui-focused fieldset': { borderColor: 'white' }
            }
          }}
        />
        <ModeSelect />
        <Tooltip title='Notifications'>
          <Badge color='warning' variant='dot'sx={{ cursor: 'pointer' }}>
            <NotificationsNoneIcon sx={{ color: 'white' }} />
          </Badge>
        </Tooltip>
        <Tooltip title='Help'>
          <HelpOutlineIcon sx={{ color: 'white', cursor: 'pointer' }} />
        </Tooltip>
        <Profiles />
      </Box>
    </Box>
  )
}

export default AppBar
