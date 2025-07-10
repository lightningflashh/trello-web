import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { toast } from 'react-toastify'

import { createNewColumnAPI } from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatters'

import { cloneDeep } from 'lodash'

import { updateCurrentActiveBoard, selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'

import Button from '@mui/material/Button'
import Column from './Column/Column'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'

import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'

import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd'
import CloseIcon from '@mui/icons-material/Close'

const ListColumns = ({ columns }) => {
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)

  const [columnModel, setColumnModel] = useState(false)
  const toggleColumnModel = () => setColumnModel(!columnModel)

  const [newColumnTitle, setNewColumnTitle] = useState('')

  const handleAddNewColumn = async () => {
    if (!newColumnTitle) {
      toast.error('Please enter a column title')
      return
    }
    // Call the API to add a new column
    const newColumnData = {
      title: newColumnTitle
    }

    // Call the API to create a new column and set board state
    const newColumn = await createNewColumnAPI({ ...newColumnData, boardId: board._id })
    // Generate a placeholder card for the new column to ensure it has at least one card for drag-and-drop
    newColumn.cards = [generatePlaceholderCard(newColumn)]
    newColumn.cardOrderIds = [generatePlaceholderCard(newColumn)._id]
    // Update the board state with the new column
    /** spread operator {...board} không nên dùng vì việc này sẽ tạo ra một bản sao nông (shallow copy) của board
    * vi phạm nguyên tắc immutability (tính bất biến) của Redux do push trực tiếp vào mảng columns và columnOrderIds
    * ngoài ra, có thể dùng spread operator và thay vì dùng push, ta sẽ dùng concat await updatedBoard.columns.concat([newColumn]) để tạo ra mảng mới luôn
    */
    const updatedBoard = cloneDeep(board)
    await updatedBoard.columns.push(newColumn)
    await updatedBoard.columnOrderIds.push(newColumn._id)

    // Cập nhật lại board trong Redux store
    dispatch(updateCurrentActiveBoard(updatedBoard))

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
        {columns?.map(column => <Column
          key={column._id}
          column={column}
        />)}

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
                className='interceptor-loading'
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
