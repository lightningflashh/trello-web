import { Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import { Card as MuiCard } from '@mui/material'
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg'
import CardActions from '@mui/material/CardActions'
import TextField from '@mui/material/TextField'
import Zoom from '@mui/material/Zoom'

import { useForm } from 'react-hook-form'

import {
  FIELD_REQUIRED_MESSAGE,
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE,
  PASSWORD_CONFIRMATION_MESSAGE } from '~/utils/validators.js'

import FieldErrorAlert from '~/components/Form/FieldErrorAlert'

import { registerUserAPI } from '~/apis'

import { toast } from 'react-toastify'

import { useNavigate } from 'react-router-dom'

import { useState } from 'react'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

const RegisterForm = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm()
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowPasswordConfirmation = () => setShowPasswordConfirmation((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const submitRegister = async (data) => {
    const { email, password } = data
    toast.promise(
      registerUserAPI({ email, password }),
      {
        pending: 'Creating your account...',
        success: 'Account created successfully! Redirecting...',
        error: 'Error creating account. Please try again.'
      }
    ).then(user => navigate(`/login?registeredEmail=${user.email}`))
  }

  return (
    <form onSubmit={handleSubmit(submitRegister)}>
      <Zoom in={true} style={{ transitionDelay: '200ms' }}>
        <MuiCard sx={{ minWidth: 380, maxWidth: 380, marginTop: '6em', backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)' }}>
          <Box sx={{ marginTop: '1em', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, fontWeight: 'semi-bold', fontFamily: "'Poppins', sans-serif", color: 'black', fontSize: '2rem' }}>
            <Avatar variant="rounded" sx={{ bgcolor: '#0052CC', width: 40, height: 40, borderRadius: '10px' }}><TrelloIcon /></Avatar>
            Trello
          </Box>
          <Box sx={{ padding: '0 1em 1em 1em' }}>
            <Box sx={{ marginTop: '1em' }}>
              <TextField
                autoFocus
                fullWidth
                placeholder="Enter Email..."
                type="text"
                variant="outlined"
                {...register('email', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: {
                    value: EMAIL_RULE,
                    message: EMAIL_RULE_MESSAGE
                  }
                })}
                sx={{
                  '& .MuiInputBase-input': {
                    color: '#0052CC'
                  },
                  '& .MuiInputLabel-root': {
                    color: '#0052CC'
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#0052CC'
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#0052CC'
                    },
                    '&:hover fieldset': {
                      borderColor: '#0052CC'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#0052CC'
                    }
                  }
                }}
                error={!!errors['email']}
              />
              <FieldErrorAlert errors={errors} fieldName={'email'}/>
            </Box>
            <Box sx={{ marginTop: '1em' }}>
              <TextField
                fullWidth
                placeholder="Enter Password..."
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                {...register('password', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: {
                    value: PASSWORD_RULE,
                    message: PASSWORD_RULE_MESSAGE
                  }
                })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        sx={{ color: '#0052CC' }} 
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiInputBase-input': {
                    color: '#172B4D',
                  },
                  '& .MuiInputLabel-root': {
                    color: '#5E6C84',
                    '&.Mui-focused': {
                      color: '#0052CC',
                    },
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#DFE1E6',
                    },
                    '&:hover fieldset': {
                      borderColor: '#0052CC',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#0052CC',
                    },
                  },
                }}
                error={!!errors['password']}
              />
              <FieldErrorAlert errors={errors} fieldName={'password'}/>
            </Box>
            <Box sx={{ marginTop: '1em' }}>
              <TextField
                fullWidth
                placeholder="Enter Password Confirmation..."
                type={showPasswordConfirmation ? 'text' : 'password'}
                variant="outlined"
                {...register('password_confirmation', {
                  validate: (value) => value === watch('password') || PASSWORD_CONFIRMATION_MESSAGE
                })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPasswordConfirmation}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        sx={{ color: '#0052CC' }} 
                      >
                        {showPasswordConfirmation ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiInputBase-input': {
                    color: '#172B4D',
                  },
                  '& .MuiInputLabel-root': {
                    color: '#5E6C84',
                    '&.Mui-focused': {
                      color: '#0052CC',
                    },
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#DFE1E6',
                    },
                    '&:hover fieldset': {
                      borderColor: '#0052CC',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#0052CC',
                    },
                  },
                }}
                error={!!errors['password_confirmation']}
              />
              <FieldErrorAlert errors={errors} fieldName={'password_confirmation'}/>
            </Box>
          </Box>
          <CardActions sx={{ padding: '0 1em 1em 1em' }}>
            <Button
              className="interceptor-loading"
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              sx={{ 
                textTransform: 'none', 
                fontWeight: 'bold',
                color: '#ffffff',
                backgroundColor: '#0052CC',
                '&:hover': {
                  backgroundColor: '#0065FF'
                }
              }}
            >
              Register
            </Button>
          </CardActions>
          <Box sx={{ padding: '0 1em 1em 1em', textAlign: 'center', color: '#5E6C84', fontSize: '0.9rem' }}>
            <Typography>Already have an account?</Typography>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Typography sx={{ color: 'primary.main', '&:hover': { color: '#ffbb39' } }}>Log in!</Typography>
            </Link>
          </Box>
        </MuiCard>
      </Zoom>
    </form>
  )
}

export default RegisterForm
