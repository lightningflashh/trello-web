import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import Box from '@mui/material/Box'

import DashBoardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import FilterListIcon from '@mui/icons-material/FilterList'
import PersonAddIcon from '@mui/icons-material/PersonAdd'

const MENU_STYLES = {
  color: 'primary.main',
  bgcolor: 'white',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '& .MuiSvgIcon-root': {
    color: 'primary.main'
  },
  '&:hover': {
    bgcolor: 'primary.light'
  }
}

const BoardBar = () => {
  return (
    <Box px={2} sx={{
      width: '100%',
      height: (theme) => theme.trello.boardBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      overflowX: 'auto',
      borderTop: '1px solid rgb(14, 132, 215)'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Chip
          icon={<DashBoardIcon />}
          label='MERN Stack Project'
          clickable
          sx={ MENU_STYLES }
        />
        <Chip
          icon={<VpnLockIcon />}
          label='Public/Private Workspace'
          clickable
          sx={ MENU_STYLES }
        />
        <Chip
          icon={<AddToDriveIcon />}
          label='Public/Private Workspace'
          clickable
          sx={MENU_STYLES}
        />
        <Chip
          icon={<AutoAwesomeIcon />}
          label='Automation'
          clickable
          sx={MENU_STYLES}
        />
        <Chip
          icon={<FilterListIcon />}
          label='Filters'
          clickable
          sx={MENU_STYLES}
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button variant='outlined' startIcon={<PersonAddIcon />}>
          Invite
        </Button>
        <AvatarGroup
          max={3}
          sx={{ '& .MuiAvatar-root': { width: 34, height: 34, fontSize: 16 } } }
        >
          <Tooltip title='Cheesethank'>
            <Avatar
              alt="Cheesethank"
              src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjalJSP1DOdXgqZw-2VxxfQIDjc4bmhRmqeA&s'
            />
          </Tooltip>
          <Tooltip title='John Doe'>
            <Avatar
              alt="John Doe"
              src='https://cdn3d.iconscout.com/3d/premium/thumb/graduate-student-3d-icon-download-in-png-blend-fbx-gltf-file-formats--avatar-study-education-knowledge-woman-profession-pack-people-icons-8264058.png?f=webp'
            />
          </Tooltip>
          <Tooltip title='Jane Smith'>
            <Avatar
              alt="Jane Smith"
              src='https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.vecteezy.com%2Fvector-art%2F21770056-avatar-of-a-student-character&psig=AOvVaw3GKXc0X4vqIyAz5Yxgaecq&ust=1750643377418000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCODfyvb0g44DFQAAAAAdAAAAABAE'
            />
          </Tooltip>
          <Tooltip title='Alex Johnson'>
            <Avatar
              alt="Alex Johnson"
              src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjalJSP1DOdXgqZw-2VxxfQIDjc4bmhRmqeA&s'
            />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}
export default BoardBar