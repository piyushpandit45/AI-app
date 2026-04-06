import React, { useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Pages
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import InterviewPrep from './pages/InterviewPrep'
import About from './pages/About'
import Contact from './pages/Contact'

// Components
import Navbar from './components/Navbar'
import Chatbot from './components/Chatbot'
import WhatsAppButton from './components/WhatsAppButton'

const App = () => {
  const navigate = useNavigate()

  // Auto-login check on app load
  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        const currentPath = window.location.pathname
        if (currentPath === '/login' || currentPath === '/signup') {
          navigate('/dashboard')
        }
      } catch (error) {
        console.error('Invalid user data in localStorage:', error)
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      }
    }
  }, [navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/interviewprep/:id" element={<InterviewPrep />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#4f46e5',
            color: '#fff',
          },
        }}
      />
      <Chatbot />
      <WhatsAppButton />
    </div>
  )
}

export default App