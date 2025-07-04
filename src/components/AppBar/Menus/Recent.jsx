import { useState } from 'react'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Box from '@mui/material/Box'

import Check from '@mui/icons-material/Check'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

const Recent = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      <Box>
        <Button
          sx={{ color: 'white' }}
          id="basic-button-recent"
          aria-controls={open ? 'basic-menu-recent' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          endIcon={<ExpandMoreIcon />}
        >
          Recent
        </Button>
        <Menu
          id="basic-menu-recent"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          slotProps={{
            list: {
              'aria-labelledby': 'basic-button-recent'
            }
          }}
        >
          <MenuItem>
            <ListItemText inset>Single</ListItemText>
          </MenuItem>
          <MenuItem>
            <ListItemText inset>1.15</ListItemText>
          </MenuItem>
          <MenuItem>
            <ListItemText inset>Double</ListItemText>
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <Check />
            </ListItemIcon>
            Custom: 1.2
          </MenuItem>
          <Divider />
          <MenuItem>
            <ListItemText>Add space before paragraph</ListItemText>
          </MenuItem>
          <MenuItem>
            <ListItemText>Add space after paragraph</ListItemText>
          </MenuItem>
        </Menu>
      </Box>
    </div>
  )
}

export default Recent
