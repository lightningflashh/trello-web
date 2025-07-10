import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '~/App.jsx'

import { BrowserRouter } from 'react-router-dom'


import CssBaseline from '@mui/material/CssBaseline'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material'
import theme from '~/theme.js'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { ConfirmProvider } from 'material-ui-confirm'

// Redux
import { store } from '~/redux/store.js'
import { Provider } from 'react-redux'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename='/'>
      <Provider store={store}>
        <CssVarsProvider theme={theme}>
          <ConfirmProvider defaultOptions={{
            allowClose: false,
            confirmationButtonProps: { color: 'error', variant: 'outlined' },
            cancellationButtonProps: { color: 'inherit' },
            dialogProps: { maxWidth: 'xs' },
            buttonOrder: ['confirm', 'cancel']
          }}>
            <CssBaseline />
            <App />
            <ToastContainer position='bottom-left' theme='colored'/>
          </ConfirmProvider>
        </CssVarsProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
)
