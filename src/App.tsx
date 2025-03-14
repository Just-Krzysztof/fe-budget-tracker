import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { PrivateRoute } from './components/auth/PrivateRoute'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import './App.css'

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Sprawdzamy preferencje trybu ciemnego przy ładowaniu komponentu
  useEffect(() => {
    const isCurrentlyDark = document.documentElement.classList.contains('dark')
    setIsDarkMode(isCurrentlyDark)
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
    // Zapisujemy preferencje użytkownika
    if (document.documentElement.classList.contains('dark')) {
      localStorage.setItem('theme', 'dark')
    } else {
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Publiczne ścieżki */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Chronione ścieżki */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            } 
          />
          
          {/* Przekierowania */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
