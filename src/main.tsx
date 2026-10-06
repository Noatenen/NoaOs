import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './app/App'
import { startAppData } from './services/appDataService'
import './styles/reset.css'
import './styles/fonts.css'
import './styles/tokens.css'
import './styles/global.css'

// Upgrade stored data if needed and ask the browser to keep it. Never blocks the app.
startAppData()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
