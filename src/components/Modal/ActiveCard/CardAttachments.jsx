import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'
import Tooltip from '@mui/material/Tooltip'
import Divider from '@mui/material/Divider'

import AttachFileIcon from '@mui/icons-material/AttachFile'
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined'
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'

import { fetchCardAttachments } from '~/redux/attachments/attachmentSlice'
import { singleFileValidator } from '~/utils/validators'

function CardAttachments({
  cardId,
  handleUploadAttachment,
  handleDeleteAttachment
}) {
  const dispatch = useDispatch()
  const fileInputRef = useRef(null)

  const attachmentsState = useSelector(
    (state) => state.cardAttachment?.attachments
  )

  const attachments = Array.isArray(attachmentsState)
    ? attachmentsState
    : Array.isArray(attachmentsState?.data)
      ? attachmentsState.data
      : []

  const [uploading, setUploading] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  // Fetch attachments when the active card changes.
  useEffect(() => {
    if (cardId) {
      dispatch(fetchCardAttachments(cardId))
    }
  }, [dispatch, cardId])

  const handleSelectFile = () => {
    fileInputRef.current?.click()
  }

  // Upload attachment using the handler provided by CardActive.
  const handleFileChange = async (event) => {
    const input = event.target
    const file = input.files?.[0]

    if (!file || !cardId) {
      input.value = ''
      return
    }

    const validationError = singleFileValidator(file)

    if (validationError) {
      console.error(validationError)
      input.value = ''
      return
    }

    if (typeof handleUploadAttachment !== 'function') {
      console.error('Upload handler is not configured.')
      input.value = ''
      return
    }

    try {
      setUploading(true)

      // CardActive handles FormData creation and the API request.
      await handleUploadAttachment(cardId, file)

      console.log('File uploaded successfully.')

      // Refresh the list after a successful upload.
      await dispatch(fetchCardAttachments(cardId)).unwrap()
    } catch (error) {
      console.error('Failed to upload attachment:', error)
    } finally {
      setUploading(false)
      input.value = ''
    }
  }

  // Delete attachment using the handler provided by CardActive.
  const handleRemoveAttachment = async (attachmentId) => {
    if (!attachmentId) return

    if (!window.confirm('Are you sure you want to delete this attachment?')) {
      return
    }

    if (typeof handleDeleteAttachment !== 'function') {
      console.error('Delete handler is not configured.')
      return
    }

    try {
      setDeletingId(attachmentId)

      await handleDeleteAttachment(cardId, attachmentId)

      console.log('Attachment deleted successfully.')

      // Refresh the list after a successful deletion.
      await dispatch(fetchCardAttachments(cardId)).unwrap()
    } catch (error) {
      console.error('Failed to delete attachment:', error)
    } finally {
      setDeletingId(null)
    }
  }

  const handleOpenAttachment = (attachment) => {
    if (!attachment.fileUrl) {
      console.error('File URL is not available.')
      return
    }

    window.open(
      attachment.fileUrl,
      '_blank',
      'noopener,noreferrer'
    )
  }

  const handleDownloadAttachment = (attachment) => {
    const { fileUrl, fileName } = attachment

    if (!fileUrl) {
      console.error('File URL is not available.')
      return
    }

    try {
      const url = new URL(fileUrl)

      if (url.hostname.endsWith('cloudinary.com')) {
        if (!url.pathname.includes('/upload/')) {
          console.error('Unsupported Cloudinary file URL.')
          return
        }

        url.pathname = url.pathname.replace(
          '/upload/',
          '/upload/fl_attachment/'
        )
      }

      const link = document.createElement('a')

      link.href = url.toString()
      link.target = '_blank'
      link.rel = 'noopener noreferrer'

      if (!url.hostname.endsWith('cloudinary.com')) {
        link.download = fileName || 'attachment'
      }

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Failed to download attachment:', error)
    }
  }

  const getFileIcon = (mimeType) => {
    if (mimeType === 'application/pdf') {
      return (
        <PictureAsPdfOutlinedIcon
          color="error"
          fontSize="large"
        />
      )
    }

    if (mimeType?.startsWith('image/')) {
      return (
        <ImageOutlinedIcon
          color="primary"
          fontSize="large"
        />
      )
    }

    return <InsertDriveFileOutlinedIcon fontSize="large" />
  }

  const formatFileSize = (size) => {
    if (typeof size !== 'number' || size < 0) {
      return 'Unknown size'
    }

    if (size < 1024) {
      return `${size} B`
    }

    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`
    }

    return `${(size / (1024 * 1024)).toFixed(2)} MB`
  }

  const formatUploadDate = (timestamp) => {
    if (!timestamp) return ''

    const date = new Date(timestamp)

    if (Number.isNaN(date.getTime())) return ''

    return date.toLocaleString('vi-VN')
  }

  return (
    <Box sx={{ mt: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <AttachFileIcon />

          <Typography variant="h6" fontWeight="bold">
            Attachments
          </Typography>

          <Typography variant="body2" color="text.secondary">
            ({attachments.length})
          </Typography>
        </Box>

        <Button
          variant="outlined"
          size="small"
          startIcon={
            uploading
              ? <CircularProgress size={16} />
              : <AttachFileIcon />
          }
          onClick={handleSelectFile}
          disabled={uploading || !cardId}
        >
          {uploading ? 'Uploading...' : 'Add'}
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          hidden
          onChange={handleFileChange}
        />
      </Box>

      {/* Attachment list */}
      {attachments.length === 0 ? (
        <Box
          sx={{
            py: 3,
            px: 2,
            textAlign: 'center',
            border: '1px dashed',
            borderColor: 'divider',
            borderRadius: 2
          }}
        >
          <AttachFileIcon
            sx={{
              fontSize: 32,
              color: 'text.secondary'
            }}
          />

          <Typography variant="body2" color="text.secondary">
            No attachments yet. Click Add to upload a file.
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }}
        >
          {attachments.map((attachment) => (
            <Box key={attachment._id}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: 'action.hover',
                  '&:hover': {
                    bgcolor: 'action.selected'
                  }
                }}
              >
                {/* File icon */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 52,
                    height: 52,
                    flexShrink: 0,
                    borderRadius: 1,
                    bgcolor: 'background.paper'
                  }}
                >
                  {getFileIcon(attachment.mimeType)}
                </Box>

                {/* File information */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Tooltip title={attachment.fileName || 'Unnamed file'}>
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      noWrap
                    >
                      {attachment.fileName || 'Unnamed file'}
                    </Typography>
                  </Tooltip>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    {formatFileSize(attachment.size)}
                    {' · '}
                    {formatUploadDate(attachment.createdAt)}
                  </Typography>
                </Box>

                {/* Open */}
                <Tooltip title="Open file">
                  <span>
                    <IconButton
                      size="small"
                      disabled={!attachment.fileUrl}
                      onClick={() => handleOpenAttachment(attachment)}
                    >
                      <OpenInNewIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>

                {/* Download */}
                <Tooltip title="Download file">
                  <span>
                    <IconButton
                      size="small"
                      disabled={!attachment.fileUrl}
                      onClick={() => handleDownloadAttachment(attachment)}
                    >
                      <DownloadOutlinedIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>

                {/* Delete */}
                <Tooltip title="Delete attachment">
                  <span>
                    <IconButton
                      size="small"
                      color="error"
                      disabled={
                        deletingId === attachment._id ||
                        !attachment._id
                      }
                      onClick={() =>
                        handleRemoveAttachment(attachment._id)
                      }
                    >
                      {deletingId === attachment._id ? (
                        <CircularProgress size={18} />
                      ) : (
                        <DeleteOutlineIcon fontSize="small" />
                      )}
                    </IconButton>
                  </span>
                </Tooltip>
              </Box>

              <Divider sx={{ mt: 1 }} />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}

export default CardAttachments
