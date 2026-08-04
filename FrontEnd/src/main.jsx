import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { UserProvider } from './context/UserContext.jsx'
import { AdminAuthProvider } from './context/AdminAuthContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <AdminAuthProvider>
        <ThemeProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </AdminAuthProvider>
    </UserProvider>
  </StrictMode>,
)

