import { useEffect, useState } from 'react'

import Box from '@mui/material/Box'

import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'

import {
  DndContext,
  PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors } from '@dnd-kit/core'

import { arrayMove } from '@dnd-kit/sortable'

const BoardContent = ({ board }) => {
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 10 }
  })

  /* Require the mouse to move by 10 pixels before activating events
  * This is useful for preventing accidental drags when clicking on items
  */
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })

  const touchSensor = useSensor(TouchSensor,
    { activationConstraint: { delay: 250, tolerance: 500 } })

  // const sensors = useSensors(pointerSensor)
  const sensors = useSensors(mouseSensor, touchSensor)

  const [sortedColumns, setSortedColumns] = useState([])

  useEffect(() => {
    setSortedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  const handleDragEnd = (event) => {
    // Handle the drag end event here
    // console.log('Drag ended:', event)
    const { active, over } = event

    // If there is no active or over item, do nothing
    if (!active || !over) {
      return
    }

    if (active.id !== over.id) {
      const prevIndex = sortedColumns.findIndex(col => col._id === active.id)
      const newIndex = sortedColumns.findIndex(col => col._id === over.id)

      // Update the sorted columns based on the drag and drop
      const dndSortedColumns = arrayMove(sortedColumns, prevIndex, newIndex)

      // Update the column order in the board object and store it & call API to save the new order
      // const dndSortedColumnsIds = dndSortedColumns.map(col => col._id)

      setSortedColumns(dndSortedColumns)
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <Box sx={{
        backgroundColor: 'primary.main',
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        p: '10px 0'
      }}>
        <ListColumns columns={sortedColumns}/>
      </Box>
    </DndContext>

  )
}
export default BoardContent