import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiPlus, FiBriefcase, FiTarget, FiFileText, FiX } from 'react-icons/fi'
import axios from '../utils/axiosInstance'
import { API_PATHS } from '../utils/apiPaths'
import toast from 'react-hot-toast'

const CreateSessionForm = ({ onSessionCreated }) => {
  const [form, setForm] = useState({
    role: '',
    experience: '',
    topicsToFocus: '',
    description: ''
  })
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.role || !form.experience) {
      toast.error('Please fill in role and experience')
      return
    }

    console.log(' Creating session with data:', form)

    setLoading(true)
    try {
      // Check if user is guest
      const userStr = localStorage.getItem('user')
      const currentUser = userStr ? JSON.parse(userStr) : null
      let newSession

      if (currentUser?.isGuest) {
        // For guest users, create session locally
        newSession = {
          _id: 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
          role: form.role,
          experience: form.experience,
          topicsToFocus: form.topicsToFocus,
          description: form.description,
          questions: [],
          createdAt: new Date().toISOString(),
          isGuest: true
        }
        
        console.log(' Guest session created:', newSession)
        toast.success('Session created successfully!')
      } else {
        // For logged-in users, send to backend
        const response = await axios.post(API_PATHS.SESSIONS.CREATE, form)
        newSession = response.data.data.session
        console.log(' Session created successfully:', response.data)
        toast.success('Session created successfully!')
      }

      setForm({ role: '', experience: '', topicsToFocus: '', description: '' })
      setIsOpen(false)
      onSessionCreated?.(newSession)
    } catch (error) {
      console.error(' Failed to create session:', error.response?.data || error.message)
      toast.error(error.response?.data?.message || 'Failed to create session')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        id="create-session-btn"
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 hover:shadow-lg transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FiPlus size={20} />
        <span>Create New Session</span>
      </motion.button>

      {/* Modal */}
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-100"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Create Interview Session</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role */}
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2 text-gray-700">
                  <FiBriefcase size={16} />
                  Role/Position
                </label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                  required
                >
                  <option value="" className="bg-white text-gray-900">Select role</option>
                  <option value="Frontend Developer" className="bg-white text-gray-900">Frontend Developer</option>
                  <option value="Backend Developer" className="bg-white text-gray-900">Backend Developer</option>
                  <option value="Full Stack Developer" className="bg-white text-gray-900">Full Stack Developer</option>
                  <option value="DevOps Engineer" className="bg-white text-gray-900">DevOps Engineer</option>
                  <option value="Data Scientist" className="bg-white text-gray-900">Data Scientist</option>
                  <option value="Product Manager" className="bg-white text-gray-900">Product Manager</option>
                  <option value="UX Designer" className="bg-white text-gray-900">UX Designer</option>
                  <option value="Software Engineer" className="bg-white text-gray-900">Software Engineer</option>
                </select>
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Years of Experience</label>
                <select
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                  required
                >
                  <option value="" className="bg-white text-gray-900">Select experience</option>
                  <option value="0-1 years" className="bg-white text-gray-900">0-1 years</option>
                  <option value="1-3 years" className="bg-white text-gray-900">1-3 years</option>
                  <option value="3-5 years" className="bg-white text-gray-900">3-5 years</option>
                  <option value="5-10 years" className="bg-white text-gray-900">5-10 years</option>
                  <option value="10+ years" className="bg-white text-gray-900">10+ years</option>
                </select>
              </div>

              {/* Topics to Focus */}
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2 text-gray-700">
                  <FiTarget size={16} />
                  Topics to Focus (optional)
                </label>
                <input
                  type="text"
                  name="topicsToFocus"
                  value={form.topicsToFocus}
                  onChange={handleChange}
                  placeholder="e.g., React, Node.js, Database"
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2 text-gray-700">
                  <FiFileText size={16} />
                  Description (optional)
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Additional notes about this interview session..."
                  rows={3}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-medium transition-colors"
                >
                  <span>Cancel</span>
                </button>
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <FiPlus size={16} />
                      <span>Create</span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}

export default CreateSessionForm