import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'
import { ThemeProvider } from './lib/theme'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { Progress } from './pages/Progress'
import { Settings } from './pages/Settings'
import { useEffect } from 'react'
import { registerServiceWorker } from './hooks/useNotifications'

export default function App() {
  useEffect(() => { registerServiceWorker() }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/"         element={<Dashboard />} />
              <Route path="/progress" element={<Progress />}  />
              <Route path="/settings" element={<Settings />}  />
            </Routes>
          </Layout>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
