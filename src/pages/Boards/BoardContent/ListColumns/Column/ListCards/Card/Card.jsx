import { Card as MuiCard } from '@mui/material'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

import GroupIcon from '@mui/icons-material/Group'
import CommentIcon from '@mui/icons-material/Comment'
import AttachmentIcon from '@mui/icons-material/Attachment'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const Card = ({ card }) => {
  const shouldCardActions = () => {
    return !!card?.memberIds?.length || !!card?.comments?.length || !!card?.attachments?.length
  }

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card._id,
    data: { ...card }
  })

  return (
    <MuiCard
      ref={setNodeRef} {...attributes} {...listeners}
      sx={{
        cursor: 'pointer',
        boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
        overflow: card?.FE_PlaceholderCard ? 'hidden' : 'unset',
        height: card?.FE_PlaceholderCard ? '0px' : 'unset',
        border: isDragging ? '1px solid #2ecc71' : '1px solid transparent',
        opacity: isDragging ? 0.5 : 1,
        touchAction: 'none',
        transform: transform ? `${CSS.Translate.toString(transform)}` : 'none',
        transition,
        '&:hover': {
          borderColor: (theme) => theme.palette.primary.main
        }
      }}>
      {card?.cover && (<CardMedia sx={{ height: 140 }} image={card?.cover}/>)}

      <CardContent sx={{ px: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Typography>{card?.title}</Typography>
      </CardContent>

      {shouldCardActions() && (
        <CardActions sx={{ p: '0 4px 8px 4px' }}>
          {!!card?.memberIds?.length && (
            <Button size='small' startIcon={<GroupIcon />}>{card?.memberIds?.length}</Button>
          )}
          {!!card?.comments?.length && (
            <Button size='small' startIcon={<CommentIcon />}>{card?.comments?.length}</Button>
          )}
          {!!card?.attachments?.length && (
            <Button size='small' startIcon={<AttachmentIcon />}>{card?.attachments?.length}</Button>
          )}
        </CardActions>
      )}
    </MuiCard>
  )
}

export default Card
