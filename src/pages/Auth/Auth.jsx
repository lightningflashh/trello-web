import { Navigate, useLocation } from 'react-router-dom'
import Box from '@mui/material/Box'
import LoginForm from '~/pages/Auth/LoginForm'
import RegisterForm from '~/pages/Auth/RegisterForm'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import bgImage from '~/assets/auth/login-register-bg.jpg'
import strategyImage from '~/assets/auth/strategy.png'
import questionImage from '~/assets/auth/question.png'


function Auth() {
  const location = useLocation()
  const isLogin = location.pathname === '/login'
  const isRegister = location.pathname === '/register'

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      alignItems: 'center',
      justifyContent: 'flex-start',
      background: `url("${bgImage}")`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      {isLogin && <LoginForm />}
      {isRegister && <RegisterForm />}
      <Box sx={{
        display: { xs: 'none', md: 'block' },
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '512px',
        height: '512px',
        transform: 'scaleX(-1)',
        background: `url("${strategyImage}")`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        backgroundPosition: 'bottom right',
        zIndex: 0,
        pointerEvents: 'none',
      }} />

      <Box sx={{
        display: { xs: 'none', md: 'block' },
        position: 'fixed',
        bottom: 0,
        right: 0,
        width: '500px',
        height: '500px',
        background: `url("${questionImage}")`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        backgroundPosition: 'bottom left',
        zIndex: 0,
        pointerEvents: 'none',
      }} />
    </Box>
  )
}

export default Auth