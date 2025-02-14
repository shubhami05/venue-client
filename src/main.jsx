import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './hooks/auth.jsx'
import { ThemeProvider } from '@material-tailwind/react'

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <ThemeProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </ThemeProvider>
  </AuthProvider>
)
