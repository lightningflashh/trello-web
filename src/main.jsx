import ReactDOM from 'react-dom/client'
import App from '~/App.jsx'

import { BrowserRouter } from 'react-router-dom'


import CssBaseline from '@mui/material/CssBaseline'
import GlobalStyles from '@mui/material/GlobalStyles'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material'
import theme from '~/theme.js'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { ConfirmProvider } from 'material-ui-confirm'

// Redux
import { store } from '~/redux/store.js'
import { Provider } from 'react-redux'

// Redux Persist
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'

const persistor = persistStore(store)

// Inject the store into the axios instance for authorization
import { injectStore } from '~/utils/authorizeAxios.js'
injectStore(store)

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter basename='/'>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <CssVarsProvider theme={theme}>
          <ConfirmProvider defaultOptions={{
            allowClose: false,
            confirmationButtonProps: { color: 'error', variant: 'outlined' },
            cancellationButtonProps: { color: 'inherit' },
            dialogProps: { maxWidth: 'xs' },
            buttonOrder: ['confirm', 'cancel']
          }}>
            <GlobalStyles
              styles={{ a: { textDecoration: 'none' } }}
            />
            <CssBaseline />
            <App />
            <ToastContainer position='bottom-left' theme='colored'/>
          </ConfirmProvider>
        </CssVarsProvider>
      </PersistGate>
    </Provider>
  </BrowserRouter>
)
