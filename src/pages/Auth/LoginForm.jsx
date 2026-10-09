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
import Alert from '@mui/material/Alert'

import { useForm } from 'react-hook-form'

import { useSearchParams, useNavigate } from 'react-router-dom'

import {
  FIELD_REQUIRED_MESSAGE,
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE,
  PASSWORD_CONFIRMATION_MESSAGE } from '~/utils/validators.js'

import FieldErrorAlert from '~/components/Form/FieldErrorAlert'

import { loginUserAPI } from '~/redux/user/userSlice'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'

import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { useState } from 'react'

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  let [searchParams] = useSearchParams()
  const registeredEmail = searchParams.get('registeredEmail')
  const verifiedEmail = searchParams.get('verifiedEmail')

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const submitLogIn = (data) => {
    const { email, password } = data
    toast.promise(
      dispatch(loginUserAPI({ email, password })),
      {
        pending: 'Logging in...'
      }
    ).then(res => {
      if (res.meta.requestStatus === 'fulfilled') {
        toast.success('Login successful!')
        navigate('/')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(submitLogIn)}>
      <Zoom in={true} style={{ transitionDelay: '200ms' }}>
        <MuiCard sx={{ minWidth: 380, maxWidth: 380, marginTop: '6em', backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)' }}>
          <Box sx={{
            margin: '1em',
            display: 'flex',
            justifyContent: 'center',
            gap: 1
          }}>
          </Box>
          <Box sx={{ marginTop: '1em', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, fontFamily: "'Poppins', sans-serif", fontWeight: 'semi-bold', color: 'black', fontSize: '2rem' }}>
            <Avatar variant="rounded" sx={{ bgcolor: '#0052CC', width: 40, height: 40, borderRadius: '10px' }}><TrelloIcon /></Avatar>
            Trello
          </Box>
          <Box sx={{ marginTop: '1em', display: 'flex', justifyContent: 'center', flexDirection: 'column', padding: '0 1em' }}>
            {registeredEmail && (
              <Alert severity="success" sx={{ '.MuiAlert-message': { overflow: 'hidden' } }}>
                Your email&nbsp;
                <Typography variant="span" sx={{ fontWeight: 'bold', '&:hover': { color: '#fdba26' } }}>{registeredEmail}</Typography>
                &nbsp;has been verified.<br />Now you can login to enjoy our services! Have a good day!
              </Alert>
            )}
            {verifiedEmail && (
              <Alert severity="info" sx={{ '.MuiAlert-message': { overflow: 'hidden' } }}>
                An email has been sent to&nbsp;
                <Typography variant="span" sx={{ fontWeight: 'bold', '&:hover': { color: '#fdba26' } }}>{verifiedEmail}</Typography>
                <br />Please check and verify your account before logging in!
              </Alert>
            )}
          </Box>
          <Box sx={{ padding: '0 1em 1em 1em' }}>
            <Box sx={{ marginTop: '1em' }}>
              <TextField
                autoFocus
                fullWidth
                placeholder="Enter Email..."
                type="text"
                variant="outlined"
                error={!!errors['email']}
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
              />
              <FieldErrorAlert errors={errors} fieldName={'email'}/>
            </Box>
            <Box sx={{ marginTop: '1em' }}>
                <TextField
                  fullWidth
                  placeholder="Enter Password..."
                  type={showPassword ? 'text' : 'password'}
                  variant="outlined"
                  error={!!errors['password']}
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
                />
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
              Login
            </Button>
          </CardActions>
   <      Box sx={{ padding: '0 1em 1em 1em', textAlign: 'center', color: 'black' }}>
            Or login with:
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, marginTop: '0.5em' }}>
              <Button 
                variant="outlined" 
                size="large" 
                fullWidth
                startIcon={<img src="src/assets/auth/google-icon.png" alt="Google" style={{ width: '20px', height: '20px' }} />}
                sx={{ textTransform: 'none', color: '#172B4D',
                      borderColor: '#dfe1e6',
                      '&:hover': {
                        borderColor: '#c1c7d0',
                        backgroundColor: '#f4f5f7',
                      } 
                    }}
              >
                Google
              </Button>

              <Button 
                variant="outlined" 
                color="inherit" 
                size="large" 
                fullWidth
                startIcon={<img src="src/assets/auth/github-icon.png" alt="Github" style={{ width: '20px', height: '20px' }} />}
                sx={{ textTransform: 'none', color: '#172B4D',
                      borderColor: '#dfe1e6',
                      '&:hover': {
                        borderColor: '#c1c7d0',
                        backgroundColor: '#f4f5f7',
                      } 
                    }}
              >
                Github
              </Button>
            </Box>
          </Box>
          <Box sx={{ padding: '0 1em 1em 1em', textAlign: 'center', color: 'gray' }}>
            <Typography>New to Trello?</Typography>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <Typography sx={{ color: 'primary.main', '&:hover': { color: '#ffbb39' } }}>Create account!</Typography>
            </Link>
          </Box>
        </MuiCard>
      </Zoom>
    </form>
  )
}

export default LoginForm
