import { Route, Routes, Navigate, Outlet } from 'react-router-dom'

import Board from '~/pages/Boards/_id'

import NotFound from '~/pages/404/NotFound'
import Auth from '~/pages/Auth/Auth'

import AccountVerification from '~/pages/Auth/AccountVerification'

import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'

import Settings from '~/pages/Settings/Settings'

const ProtectedRoute = ({ user }) => {
  if (!user) {
    return <Navigate to='/login' replace={true} />
  }
  return <Outlet />
}

function App() {
  const currentUser = useSelector(selectCurrentUser)
  return (
    <Routes>
      <Route path='/' element={
        <Navigate to='/boards/68639eea385e6f83eb4ac36d' replace={true} />
      } />

      {/** Protected Routes */}
      <Route element={<ProtectedRoute user={currentUser} />}>
        {/** Outlet sẽ chạy vào các child Route trong này */}
        <Route path='/boards/:boardId' element={<Board />} />

        {/** User Settings */}
        <Route path='/settings/account' element={<Settings />} />
        <Route path='/settings/security' element={<Settings />} />
      </Route>

      <Route path='/login' element={<Auth />} />
      <Route path='/register' element={<Auth />} />
      <Route path='/account/verification' element={<AccountVerification />} />

      <Route path='*' element={<NotFound />} />

    </Routes>
  )
}

export default App
