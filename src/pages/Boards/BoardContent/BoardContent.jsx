import { useEffect, useState, useCallback, useRef, act } from 'react'

import Box from '@mui/material/Box'

import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'

import {
  DndContext,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  pointerWithin,
  getFirstCollision
} from '@dnd-kit/core'

import { MouseSensor, TouchSensor } from '~/customLibraries/DndKitSensors'

import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'

import { arrayMove } from '@dnd-kit/sortable'
import { cloneDeep, isEmpty } from 'lodash'

import { generatePlaceholderCard } from '~/utils/formatters'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

const BoardContent = ({ board, createNewColumn, createNewCard, moveColumns }) => {
  // const pointerSensor = useSensor(PointerSensor, {
  //   activationConstraint: { distance: 10 }
  // })

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
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState([])

  // Điểm cuối cùng được kéo qua
  // Dùng để xử lý trường hợp kéo thả card vào column khác rồi quay lại
  const lastOverId = useRef(null)

  useEffect(() => {
    setSortedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  const findColumnByCardId = (id) => {
    // Dùng column?.cards? thay vì cardOrderIds vì ở bước handleDragOver cần làm dữ liệu cho cards hoàn chỉnh rồi mới tạo ra cardOrderIds mới
    return sortedColumns.find(column => column?.cards?.map(card => card._id)?.includes(id))
  }

  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData
  ) => {
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

        // Thêm placeholder card nếu activeColumn không còn cards nào
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)]
        }

        // Cập nhật lại cardOrderIds của activeColumn
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
      }

      if (nextOverColumn) {
        // Kiểm tra nếu card đã tồn tại trong overColumn thì xóa
        nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)

        /* Xử lý trường hợp kéo thả sang một column khác rồi quay lại column cũ
        * Do cập nhật activeDraggingCardData ở trên nên columnId sẽ không còn là column cũ nữa
        * { ...activeDraggingCardData,
        * columnId: nextOverColumn._id }
        */
        // Thêm card vào vị trí mới trong overColumn (trả về mảng mới thay vì thay đổi chính mảng khi dùng splice)
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(
          newCardIndex,
          0,
          {
            ...activeDraggingCardData,
            columnId: nextOverColumn._id
          })

        // Xóa placeholder card nếu overColumn đã có cards
        nextOverColumn.cards = nextOverColumn.cards.filter(card => !card.FE_PlaceholderCard)

        // Cập nhật lại cardOrderIds của overColumn
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
      }

      return nextColumns
    })
  }

  const handleDragStart = (event) => {
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)
    if (event?.active?.data?.current?.columnId) {
      // Lưu lại column cũ khi kéo thả card
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))
    }
  }

  // Triggered when an item is dragged over another item
  const handleDragOver = (event) => {
    // If the active drag item is a column, we do not want to handle it here
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

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
    if (oldColumnWhenDraggingCard._id !== overColumn._id) {
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData
      )
    }
  }

  const handleDragEnd = (event) => {
    const { active, over } = event

    // If there is no active or over item, do nothing
    if (!active || !over) return

    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
      const { id: overCardId } = over

      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)

      if (!activeColumn || !overColumn) return

      // Không được dùng activeDragItemData._id vì khi kéo sang một column khác thì activeDragItemData sẽ không có cập nhật lại cái columnId mới 
      // => Nó sẽ rơi vào trường hợp kéo thả trong cùng một column
      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData
        )
      } else {
        // Hành động kéo thả trong cùng 1 column
        // Lấy vị trí của card trong oldColumnWhenDraggingCard
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(card => card._id === activeDragItemId)
        const newCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)

        const dndSortedCards = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex)

        setSortedColumns(previousColumns => {
          const nextColumns = cloneDeep(previousColumns)
          const targetColumn = nextColumns.find(col => col._id === overColumn._id)

          // Cập nhật lại cards và cardOrderIds của activeColumn
          targetColumn.cards = dndSortedCards
          targetColumn.cardOrderIds = dndSortedCards.map(card => card._id)

          return nextColumns
        })
      }
    }

    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      if (active.id !== over.id) {
        const currentColumnIndex = sortedColumns.findIndex(col => col._id === active.id)
        const newColumnIndex = sortedColumns.findIndex(col => col._id === over.id)

        // Update the sorted columns based on the drag and drop
        const dndSortedColumns = arrayMove(sortedColumns, currentColumnIndex, newColumnIndex)

        // MUST update the sortedColumns state avoid flickering or delaying because of API call is asynchronous
        // This strict to enhance the user experience
        setSortedColumns(dndSortedColumns)

        moveColumns(dndSortedColumns)
      }
    }

    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
  }

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } })
  }

  const collisionDetectionStrategy = useCallback((args) => {

    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      return closestCorners({ ...args })
    }

    // Tìm kiếm các điểm va chạm gần nhất với con trỏ
    const pointerIntersections = pointerWithin(args)

    if (!pointerIntersections?.length) return

    // // Thuật toán phát hiện va chạm
    // const intersections = !!pointerIntersections?.length
    //   ? pointerIntersections
    //   : rectIntersection(args)

    // Lấy id của item đầu tiên trong danh sách va chạm
    let overId = getFirstCollision(pointerIntersections, 'id')

    if (overId) {
      const checkColumn = sortedColumns.find(column => column._id === overId)
      // Nếu overId là một column, thì tìm đến card gần nhất trong column bên trong khu vực va chạm
      // tránh flickering khi kéo thả
      if (checkColumn) {
        overId = closestCorners({
          ...args,
          droppableContainers: args.droppableContainers
            .filter(container => container.id !== overId && checkColumn?.columnOrderIds?.includes(container.id))
        })[0]?.id
      }
      lastOverId.current = overId
      return [{ id: overId }]
    }
    // Nếu overId là null, trả về mảng rỗng - tránh crash trang thái khi không có item nào được kéo thả
    return lastOverId.current ? [{ id: lastOverId.current }] : []

  }, [activeDragItemType, sortedColumns])

  return (
    <DndContext
      sensors={sensors}
      // collisionDetection={closestCorners}
      collisionDetection={collisionDetectionStrategy}
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
        <ListColumns columns={sortedColumns} createNewColumn={createNewColumn} createNewCard={createNewCard} />
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