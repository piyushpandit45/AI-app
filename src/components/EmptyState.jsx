import { motion } from 'framer-motion'
import { FiTarget, FiZap, FiCpu, FiArrowRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const EmptyState = ({ onGenerate, generating }) => {
  return (
    <motion.div
      className="text-center py-20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Animated AI Robot */}
      <div className="relative mb-8">
        <motion.div
          className="w-32 h-32 mx-auto rounded-3xl bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center relative overflow-hidden border border-indigo-200"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.div
            className="text-4xl"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            🤖
          </motion.div>
          
          {/* Orbiting dots */}
          <motion.div
            className="absolute w-2 h-2 bg-indigo-500 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            style={{
              transformOrigin: "0 0",
              left: "50%",
              top: "50%",
              marginLeft: "-4px",
              marginTop: "-4px",
              x: "40px",
              y: "0px"
            }}
          />
          <motion.div
            className="absolute w-2 h-2 bg-purple-500 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            style={{
              transformOrigin: "0 0",
              left: "50%",
              top: "50%",
              marginLeft: "-4px",
              marginTop: "-4px",
              x: "0px",
              y: "-40px"
            }}
          />
        </motion.div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-md mx-auto"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          No Interview Sessions Yet
        </h2>
        
        <p className="text-gray-600 mb-8 text-lg leading-relaxed">
          Create your first session to start practicing with AI-generated questions tailored to your role and experience.
        </p>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <motion.div
            className="text-center p-4 bg-white rounded-xl border border-indigo-100 shadow-lg"
            whileHover={{ y: -5, shadow: "0 10px 25px rgba(79, 70, 229, 0.1)" }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <FiTarget className="text-indigo-600 mx-auto mb-2" size={24} />
            <h3 className="font-semibold text-gray-900 text-sm">Smart Questions</h3>
            <p className="text-gray-600 text-xs mt-1">AI-generated for your role</p>
          </motion.div>

          <motion.div
            className="text-center p-4 bg-white rounded-xl border border-purple-100 shadow-lg"
            whileHover={{ y: -5, shadow: "0 10px 25px rgba(147, 51, 234, 0.1)" }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <FiZap className="text-purple-600 mx-auto mb-2" size={24} />
            <h3 className="font-semibold text-gray-900 text-sm">Instant Feedback</h3>
            <p className="text-gray-600 text-xs mt-1">Get real-time analysis</p>
          </motion.div>

          <motion.div
            className="text-center p-4 bg-white rounded-xl border border-green-100 shadow-lg"
            whileHover={{ y: -5, shadow: "0 10px 25px rgba(34, 197, 94, 0.1)" }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <FiCpu className="text-green-600 mx-auto mb-2" size={24} />
            <h3 className="font-semibold text-gray-900 text-sm">AI Scoring</h3>
            <p className="text-gray-600 text-xs mt-1">Performance tracking</p>
          </motion.div>
        </div>

        {/* CTA Button */}
        <motion.button
          onClick={() => document.getElementById('create-session-btn')?.click()}
          disabled={generating}
          className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          Create Your First Session
          <FiArrowRight size={20} />
        </motion.button>

        {/* Subtext */}
        <p className="text-gray-500 text-sm mt-4">
          Powered by advanced AI technology • No credit card required
        </p>
      </motion.div>
    </motion.div>
  )
}

export default EmptyState
