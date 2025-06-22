import { Card as MuiCard } from '@mui/material'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

import GroupIcon from '@mui/icons-material/Group'
import CommentIcon from '@mui/icons-material/Comment'
import AttachmentIcon from '@mui/icons-material/Attachment'

const Card = ({ hasMediaCard }) => {
  return (
    <MuiCard sx={{
      cursor: 'pointer',
      boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
      overflow: 'unset'
    }}>
      {hasMediaCard && (
        <CardMedia
          sx={{ height: 140 }}
          image='https://create.microsoft.com/_next/image?url=https%3A%2F%2Fcdn.create.microsoft.com%2Fcmsassets%2FTarotCards-HERO-2.webp&w=1920&q=75'
          title='green iguana'
        />
      )}
      <CardContent sx={{ px: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Typography>
          MERN Stack
        </Typography>
      </CardContent>
      {hasMediaCard && (
        <CardActions sx={{ p: '0 4px 8px 4px' }}>
          <Button size='small' startIcon={<GroupIcon />}>20</Button>
          <Button size='small' startIcon={<CommentIcon />}>15</Button>
          <Button size='small' startIcon={<AttachmentIcon />}>10</Button>
        </CardActions>
      )}
    </MuiCard>
  )
}

export default Card
