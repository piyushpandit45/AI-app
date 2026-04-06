import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiLogOut, FiUser, FiMenu, FiX, FiHome, FiMessageSquare, FiInfo, FiMail } from 'react-icons/fi'
import toast from 'react-hot-toast'

const Navbar = () => {
  const [user, setUser] = useState(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Load user from localStorage on mount
    const loadUser = () => {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        try {
          setUser(JSON.parse(userStr))
        } catch (error) {
          console.error('Invalid user data in localStorage:', error)
          localStorage.removeItem('user')
          localStorage.removeItem('token')
        }
      }
    }

    loadUser()

    // Listen for storage changes (when user logs in from another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        if (e.newValue) {
          try {
            setUser(JSON.parse(e.newValue))
          } catch (error) {
            console.error('Invalid user data in storage event:', error)
            setUser(null)
          }
        } else {
          setUser(null)
        }
      }
    }

    // Listen for custom auth event (when user logs in on same page)
    const handleAuthChange = () => {
      loadUser()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('authChange', handleAuthChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('authChange', handleAuthChange)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('guestSessions')
    setUser(null)
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const navLinks = [
    { path: '/', label: 'Home', icon: FiHome },
    { path: '/dashboard', label: 'Interview', icon: FiMessageSquare },
    { path: '/about', label: 'About', icon: FiInfo },
    { path: '/contact', label: 'Contact', icon: FiMail },
  ]

  const isActiveLink = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <span className="text-white font-bold text-xl">IA</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              InterviewAI
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActiveLink(link.path)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <link.icon size={16} />
                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}
            </div>
            
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${user.isGuest ? 'bg-yellow-500' : 'bg-gradient-to-r from-blue-600 to-purple-600'}`}>
                    <FiUser className="text-white" size={16} />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{user.name || 'User'}{user.isGuest && ' (Guest)'}</span>
                </div>
                
                {/* Always show Login/Signup for guest users */}
                {user.isGuest && (
                  <>
                    <motion.button
                      onClick={() => {
                        localStorage.removeItem('user')
                        localStorage.removeItem('guestSessions')
                        setUser(null)
                        navigate('/login')
                      }}
                      className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Login
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        localStorage.removeItem('user')
                        localStorage.removeItem('guestSessions')
                        setUser(null)
                        navigate('/signup')
                      }}
                      className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg transition-colors font-medium hover:shadow-lg"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Sign Up
                    </motion.button>
                  </>
                )}
                
                <motion.button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiLogOut size={16} />
                  <span>Logout</span>
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          className={`lg:hidden ${isMenuOpen ? 'block' : 'hidden'}`}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: isMenuOpen ? 1 : 0, height: isMenuOpen ? 'auto' : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="py-4 space-y-2 border-t border-gray-200">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActiveLink(link.path)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <link.icon size={18} />
                <span className="font-medium">{link.label}</span>
              </Link>
            ))}
            
            {user ? (
              <>
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${user.isGuest ? 'bg-yellow-500' : 'bg-gradient-to-r from-blue-600 to-purple-600'}`}>
                    <FiUser className="text-white" size={16} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user.name || 'User'}{user.isGuest && ' (Guest)'}</span>
                </div>
                
                {/* Always show Login/Signup for guest users */}
                {user.isGuest && (
                  <>
                    <motion.button
                      onClick={() => {
                        localStorage.removeItem('user')
                        localStorage.removeItem('guestSessions')
                        setUser(null)
                        navigate('/login')
                        setIsMenuOpen(false)
                      }}
                      className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg transition-colors font-medium w-full"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Login
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        localStorage.removeItem('user')
                        localStorage.removeItem('guestSessions')
                        setUser(null)
                        navigate('/signup')
                        setIsMenuOpen(false)
                      }}
                      className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-lg transition-colors font-medium hover:shadow-lg w-full"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Sign Up
                    </motion.button>
                  </>
                )}
                
                <button
                  onClick={() => {
                    handleLogout()
                    setIsMenuOpen(false)
                  }}
                  className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg w-full transition-colors font-medium"
                >
                  <FiLogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <div className="space-y-2 px-4">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 text-center text-gray-700 hover:text-blue-600 font-medium transition-colors rounded-lg hover:bg-gray-50"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-medium text-center"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.nav>
  )
}

export default Navbar