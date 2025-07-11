import { useState, useEffect } from 'react'
import { useSearchParams, Navigate } from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import { verifyUserAPI } from '~/apis'

const AccountVerification = () => {
  let [searchParams] = useSearchParams()

  const { email, token } = Object.fromEntries( [...searchParams] )

  const [verified, setVerified] = useState(false)

  useEffect(() => {
    const verifyAccount = async () => {
      if (!email || !token) return
      try {
        await verifyUserAPI({ email, token })
        setVerified(true)
      } catch (error) {
        setVerified(false)
      }
    }

    verifyAccount()
  }, [email, token])

  if (!email || !token) return <Navigate to="/404" />

  if (!verified) return <PageLoadingSpinner caption="Verifying your account..." />

  return <Navigate to={`/login?verifiedEmail=${email}`}/>
}

export default AccountVerification