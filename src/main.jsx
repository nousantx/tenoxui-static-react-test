import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { TenoxUIProvider } from './components/TenoxUIProvider'
import App from './App.jsx'
import config from '../tenoxui.config'
import './index.css'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TenoxUIProvider config={config}>
      <App />
    </TenoxUIProvider>
  </StrictMode>
)
