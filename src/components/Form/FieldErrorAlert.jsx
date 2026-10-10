import Alert from '@mui/material/Alert'

const FieldErrorAlert = ({ errors, fieldName }) => {
  if (!errors || !errors[fieldName]) return null
  return (
    <Alert 
      severity="error" 
      sx={{ 
        mt: '0.7em', 
        backgroundColor: '#FFEBE6', 
        color: '#DE350B',
        
        '& .MuiAlert-icon': {
          color: '#DE350B',
        },
        
        '& .MuiAlert-message': { 
          overflow: 'hidden',
          color: '#DE350B',
          fontWeight: 500,
        } 
      }}
    >
      {errors[fieldName]?.message}
    </Alert>
  )
}

export default FieldErrorAlert