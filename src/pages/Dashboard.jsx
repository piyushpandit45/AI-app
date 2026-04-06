import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FiTrendingUp, FiTarget, FiClock, FiPlay, FiUser, FiPlus, FiBarChart2, FiAward, FiBookOpen, FiLogOut } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import SessionCard from '../components/SessionCard'
import CreateSessionForm from '../components/CreateSessionForm'
import EmptyState from '../components/EmptyState'
import AIInterview from '../components/AIInterview'
import { API_PATHS } from '../utils/apiPaths'
import axios from '../utils/axiosInstance'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [showInterview, setShowInterview] = useState(false)
  const [selectedSession, setSelectedSession] = useState(null)
  const navigate = useNavigate()

  const fetchSessions = async () => {
    // Check if user is guest
    const userStr = localStorage.getItem('user')
    const currentUser = userStr ? JSON.parse(userStr) : null

    if (currentUser?.isGuest) {
      const guestSessions = JSON.parse(localStorage.getItem('guestSessions') || '[]')
      setSessions(guestSessions)
      setLoading(false)
      return
    }

    try {
      const res = await axios.get(API_PATHS.SESSIONS.GET_ALL)
      setSessions(res.data.data.sessions)
    } catch (error) {
      console.error('❌ Frontend: Failed to fetch sessions:', error)
      toast.error('Failed to load sessions')
    } finally {
      setLoading(false)
    }
  }

  const handleSessionCreated = (newSession) => {
    const userStr = localStorage.getItem('user')
    const currentUser = userStr ? JSON.parse(userStr) : null

    if (currentUser?.isGuest) {
      const guestSessions = JSON.parse(localStorage.getItem('guestSessions') || '[]')
      const updatedSessions = [newSession, ...guestSessions]
      localStorage.setItem('guestSessions', JSON.stringify(updatedSessions))
      setSessions(updatedSessions)
    } else {
      setSessions(prev => [newSession, ...prev])
    }
    toast.success('Session created successfully!')
  }

  const handleStartInterview = (session) => {
    setSelectedSession(session)
    setShowInterview(true)
  }

  const handleDeleteSession = (sessionId) => {
    const userStr = localStorage.getItem('user')
    const currentUser = userStr ? JSON.parse(userStr) : null

    if (currentUser?.isGuest) {
      const guestSessions = JSON.parse(localStorage.getItem('guestSessions') || '[]')
      const updatedSessions = guestSessions.filter(session => session._id !== sessionId)
      localStorage.setItem('guestSessions', JSON.stringify(updatedSessions))
      setSessions(updatedSessions)
    } else {
      setSessions(prev => prev.filter(session => session._id !== sessionId))
    }
  }

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const userData = JSON.parse(userStr)
        setUser(userData)
      } catch (error) {
        console.error('Invalid user data in localStorage:', error)
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        navigate('/login')
        return
      }
    } else {
      navigate('/login')
      return
    }

    fetchSessions()
  }, [navigate])

  const totalQuestions = sessions.reduce((acc, s) => acc + (s.questions?.length || 0), 0)
  const completedSessions = sessions.filter(session => session.questions && session.questions.length > 0).length

  if (showInterview && selectedSession) {
    return <AIInterview session={selectedSession} onBack={() => setShowInterview(false)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                AI-Powered Interview Practice
              </h1>
              <p className="text-gray-600">
                Welcome back, {user?.name || 'User'}! {user?.isGuest && '(Guest Mode)'} Ready to master your interview skills?
              </p>
            </div>
            <motion.button
              onClick={() => document.getElementById('create-session-btn')?.click()}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-xl transition-all font-medium flex items-center gap-2"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiPlus size={20} />
              Create New Session
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl p-6 shadow-lg border border-indigo-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <FiTarget className="text-indigo-600" size={24} />
              </div>
              <FiTrendingUp className="text-green-500" size={20} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{sessions.length}</h3>
            <p className="text-gray-600 text-sm">Total Sessions</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FiBarChart2 className="text-purple-600" size={24} />
              </div>
              <FiTrendingUp className="text-green-500" size={20} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{totalQuestions}</h3>
            <p className="text-gray-600 text-sm">AI Questions</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-green-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FiAward className="text-green-600" size={24} />
              </div>
              <FiTrendingUp className="text-green-500" size={20} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{completedSessions}</h3>
            <p className="text-gray-600 text-sm">Completed</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-orange-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <FiClock className="text-orange-600" size={24} />
              </div>
              <FiTrendingUp className="text-green-500" size={20} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">2.5h</h3>
            <p className="text-gray-600 text-sm">Avg. Duration</p>
          </div>
        </motion.div>

        {/* Guest Notice */}
        {user?.isGuest && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <FiUser className="text-yellow-600" size={20} />
              <div>
                <p className="text-yellow-800 font-medium">You are in Guest Mode</p>
                <p className="text-yellow-700 text-sm">Your sessions are stored locally. Create an account to save your progress permanently.</p>
              </div>
              <Link
                to="/signup"
                onClick={() => {
                  // Clear guest session before navigating to signup
                  if (user?.isGuest) {
                    localStorage.removeItem('user')
                    localStorage.removeItem('guestSessions')
                    setUser(null)
                  }
                }}
                className="ml-auto px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
              >
                Create Account
              </Link>
            </div>
          </motion.div>
        )}

        {/* Create Session Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <CreateSessionForm onSessionCreated={handleSessionCreated} />
        </motion.div>

        {/* Sessions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Interview Sessions</h2>
              <p className="text-gray-600">Your practice sessions and progress</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <FiBookOpen size={16} />
              {sessions.length} sessions
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2 w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : sessions.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessions.map((session, index) => (
                <motion.div
                  key={session._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <SessionCard 
                    session={session} 
                    onStartInterview={() => handleStartInterview(session)}
                    onDelete={handleDeleteSession}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard;