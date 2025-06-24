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
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners
} from '@dnd-kit/core'

import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'

import { arrayMove } from '@dnd-kit/sortable'
import { cloneDeep } from 'lodash'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

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

  // At the moment, only columns or cards can be dragged
  const [activeDragItemId, setActiveDragItemId] = useState([])
  const [activeDragItemType, setActiveDragItemType] = useState([])
  const [activeDragItemData, setActiveDragItemData] = useState([])

  useEffect(() => {
    setSortedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  const findColumnByCardId = (id) => {
    // Dùng column?.cards? thay vì cardOrderIds vì ở bước handleDragOver cần làm dữ liệu cho cards hoàn chỉnh rồi mới tạo ra cardOrderIds mới
    return sortedColumns.find(column => column?.cards?.map(card => card._id)?.includes(id))
  }

  const handleDragStart = (event) => {
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)
  }

  // Triggered when an item is dragged over another item
  const handleDragOver = (event) => {
    console.log('Drag over:', event)
    // If the active drag item is a column, we do not want to handle it here
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    console.log('Card drag over:', event)
    const { active, over } = event

    // If there is no active or over item, do nothing
    if (!over || !active) return

    // activeDraggingCard is the card being dragged
    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    const { id: overCardId } = over

    // Find 2 columns that are being dragged over by cardId
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    if (!activeColumn || !overColumn) return

    // Cái này chỉ xử lý 2 card kéo qua lại 2 columns khác nhau
    // Còn kéo trong chính column thì không xử lý gì cả
    if (activeColumn._id !== overColumn._id) {
      setSortedColumns(previousColumns => {
        // Tìm vị trí của overCard trong overColumn
        const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)

        let newCardIndex
        const isBelowOverItem = active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height
        const modifier = isBelowOverItem ? 1 : 0
        // Tính toán vị trí mới của card trong overColumn
        newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1
        const nextColumns = cloneDeep(previousColumns)
        const nextActiveColumn = nextColumns.find(col => col._id === activeColumn._id)
        const nextOverColumn = nextColumns.find(col => col._id === overColumn._id)

        if (nextActiveColumn) {
          // Xóa card khỏi activeColumn
          nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)
          // Cập nhật lại cardOrderIds của activeColumn
          nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
        }

        if (nextOverColumn) {
          // Kiểm tra nếu card đã tồn tại trong overColumn thì xóa
          nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)

          // Thêm card vào vị trí mới trong overColumn (trả về mảng mới thay vì thay đổi chính mảng khi dùng splice)
          nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, activeDraggingCardData)

          // Cập nhật lại cardOrderIds của overColumn
          nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
        }

        return nextColumns
      })
    }
  }

  const handleDragEnd = (event) => {
    // console.log('Drag ended:', event)

    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      // console.log('Card drag ended:', event)
      return
    }
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
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
  }

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } })
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box sx={{
        backgroundColor: 'primary.main',
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        p: '10px 0'
      }}>
        <ListColumns columns={sortedColumns}/>
        <DragOverlay dropAnimation={dropAnimation}>
          {!activeDragItemType && null}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData} /> }
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Card card={activeDragItemData} /> }
        </DragOverlay>
      </Box>
    </DndContext>

  )
}
export default BoardContent