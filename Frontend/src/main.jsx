import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// 1. Import your custom AuthProvider
import { AuthProvider } from './context/AuthContext.jsx' 

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
    <StrictMode>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          {/* 2. Wrap your app with AuthProvider instead of ClerkProvider */}
          <AuthProvider>
            <App />
          </AuthProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </StrictMode>,
)