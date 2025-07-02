import { useState } from 'react'

import Button from '@mui/material/Button'
import Column from './Column/Column'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'

import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'

import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd'
import CloseIcon from '@mui/icons-material/Close'

const ListColumns = ({ columns }) => {
  const [columnModel, setColumnModel] = useState(false)
  const toggleColumnModel = () => setColumnModel(!columnModel)

  const [newColumnTitle, setNewColumnTitle] = useState('')

  const handleAddNewColumn = () => {
    if (!newColumnTitle) return
    // Call the API to add a new column
    toggleColumnModel()
    setNewColumnTitle('')
  }
  /**
   *The <SortableContext> component requires that you pass it the sorted array of the unique identifiers associated to each sortable item via the items prop.
   This array should look like ["1", "2", "3"], not [{id: "1"}, {id: "2}, {id: "3}].
   */
  return (
    <SortableContext items={columns?.map(c => c._id)} strategy={horizontalListSortingStrategy}>
      <Box sx={{
        bgcolor: 'inherit',
        width: '100%',
        height: '100%',
        display: 'flex',
        overflowX: 'auto',
        overflowY: 'hidden',
        '&::-webkit-scrollbar-track': { m: 2 }
      }}>
        {columns?.map(column => <Column key={column._id} column={column}/>)}

        {!columnModel ?
          <Box
            onClick={toggleColumnModel}
            sx={{
              minWidth: '250px',
              maxWidth: '250px',
              mx: 2,
              borderRadius: '6px',
              height: 'fit-content',
              bgcolor: '#ffffff3d'
            }}>
            <Button
              startIcon={<PlaylistAddIcon />}
              sx={{
                color: 'white',
                width: '100%',
                justifyContent: 'flex-start',
                pl: 2.5,
                py: 1
              }}
            >Add new column
            </Button>
          </Box>
          :
          <Box sx={{
            minWidth: '250px',
            maxWidth: '250px',
            mx: 2,
            p: 1,
            borderRadius: '6px',
            height: 'fit-content',
            bgcolor: '#ffffff3d',
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }}>
            <TextField
              id='outlined-new-column-title'
              variant='outlined'
              size='small'
              label='Enter column title'
              type='text'
              autoFocus
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              sx={{
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
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <Button
                variant='contained'
                color='success'
                size='small'
                sx={{
                  boxShadow: 'none',
                  border: '0.5px solid',
                  borderColor: (theme) => theme.palette.success.main,
                  '&:hover': { bgcolor: (theme) => theme.palette.success.main }
                }}
                onClick={handleAddNewColumn}>
                  Add Column
              </Button>
              <CloseIcon
                fontSize='small'
                sx={{ color: 'white', cursor: 'pointer', '&:hover': { color: (theme) => theme.palette.error.main } }}
                onClick={toggleColumnModel}
              />
            </Box>
          </Box>
        }
      </Box>
    </SortableContext>
  )
}

export default ListColumns
