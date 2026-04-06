import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiPlay, FiCalendar, FiBriefcase, FiTrash2 } from 'react-icons/fi'
import axios from '../utils/axiosInstance'
import toast from 'react-hot-toast'
import { useState } from 'react'
import DeleteModal from './DeleteModal'
import { API_PATHS } from '../utils/apiPaths'

const SessionCard = ({ session, onDelete }) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  
  // Add null checks
  if (!session) {
    return null;
  }

  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(API_PATHS.SESSIONS.DELETE(session._id));
      toast.success('Session deleted successfully');
      onDelete?.(session._id);
      setIsDeleteOpen(false);
    } catch (error) {
      console.error('❌ Failed to delete session:', error);
      toast.error(error.response?.data?.message || 'Failed to delete session');
    }
  };

  return (
    <motion.div
      className="bg-white rounded-xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-100"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-3">{session.role || 'Unknown Role'}</h3>
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <FiBriefcase size={16} className="text-gray-400" />
              <span className="font-medium">{session.experience || 'Not specified'}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiCalendar size={16} className="text-gray-400" />
              <span className="font-medium">{session.createdAt ? new Date(session.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No date'}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {session.questions?.length || 0}
            </div>
            <div className="text-xs text-gray-500 font-medium">Questions</div>
          </div>
          <motion.button
            onClick={handleDeleteClick}
            className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Delete session"
          >
            <FiTrash2 size={18} />
          </motion.button>
        </div>
      </div>

      {session.description && (
        <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">{session.description}</p>
      )}

      {session.topicsToFocus && (
        <div className="mb-6">
          <div className="text-xs text-gray-500 font-medium mb-2">Focus Topics:</div>
          <div className="flex flex-wrap gap-2">
            {session.topicsToFocus.split(',').map((topic, index) => (
              <span
                key={index}
                className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-medium"
              >
                {topic.trim()}
              </span>
            ))}
          </div>
        </div>
      )}

      <Link to={`/interviewprep/${session._id}`}>
        <motion.button
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 group-hover:shadow-lg transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={(e) => e.stopPropagation()}
        >
          <FiPlay size={16} />
          <span>Start Interview</span>
        </motion.button>
      </Link>
      
      {/* Delete Modal */}
      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Session"
        message="Are you sure you want to delete this session? This action cannot be undone."
      />
    </motion.div>
  )
}

export default SessionCard