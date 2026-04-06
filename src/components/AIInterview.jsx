import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiMic, FiMicOff, FiPlay, FiPause, FiSkipForward, FiCheck, FiX as FiXIcon } from 'react-icons/fi'
import { API_PATHS } from '../utils/apiPaths'
import axios from '../utils/axiosInstance'
import toast from 'react-hot-toast'

const AIInterview = ({ session, onClose, onComplete }) => {
  // Add null checks
  if (!session) {
    return null;
  }

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [finalScore, setFinalScore] = useState(0)

  const questions = session.questions || []

  const handleAnswer = async (answer) => {
    const newAnswers = [...answers, { question: questions[currentQuestion], answer, timestamp: new Date() }]
    setAnswers(newAnswers)

    // Get AI feedback
    setLoading(true)
    try {
      const res = await axios.post(API_PATHS.AI.GENERATE_FEEDBACK, {
        question: questions[currentQuestion].question || questions[currentQuestion],
        answer: answer
      })
      setFeedback(res.data.data.feedback)
      // Update last answer with score
      newAnswers[newAnswers.length - 1].score = res.data.data.feedback.score
      setAnswers([...newAnswers])
    } catch (error) {
      console.error('Failed to get feedback:', error)
      setFeedback({
        score: 7,
        strengths: ['Good attempt'],
        improvements: ['Could be more detailed'],
        overall: 'Keep practicing!'
      })
      newAnswers[newAnswers.length - 1].score = 7
      setAnswers([...newAnswers])
    } finally {
      setLoading(false)
    }
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      setFeedback(null)
    } else {
      // Calculate final score
      const avgScore = answers.reduce((acc, ans) => acc + (ans.score || 7), 0) / answers.length
      setFinalScore(Math.round(avgScore))
      setShowResults(true)
    }
  }

  const completeInterview = async () => {
    try {
      await axios.put(API_PATHS.SESSIONS.UPDATE(session._id), {
        answers,
        completedAt: new Date(),
        score: finalScore
      })
      toast.success('Interview completed!')
      onComplete()
    } catch (error) {
      console.error('Failed to save interview:', error)
      toast.error('Failed to save interview results')
    }
  }

  if (showResults) {
    return (
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="glass rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <div className="p-8">
            <div className="text-center mb-8">
              <motion.div
                className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <FiCheck className="text-white" size={32} />
              </motion.div>
              <h2 className="text-3xl font-bold gradient-text mb-2">Interview Complete!</h2>
              <div className="text-6xl font-bold text-white mb-4">{finalScore}/10</div>
              <p className="text-gray-300">Great job! Here's your performance summary.</p>
            </div>

            <div className="space-y-4 mb-8">
              {answers.map((answer, index) => (
                <motion.div
                  key={index}
                  className="glass rounded-lg p-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <h4 className="font-semibold text-white mb-2">Question {index + 1}</h4>
                  <p className="text-sm text-gray-300 mb-2">{answer.question.question}</p>
                  <div className="text-sm text-gray-400">
                    <strong>Your answer:</strong> {answer.answer}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex gap-4">
              <motion.button
                onClick={completeInterview}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-6 rounded-lg font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Save Results
              </motion.button>
              <motion.button
                onClick={onClose}
                className="flex-1 glass text-white py-3 px-6 rounded-lg font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Close
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="glass rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/20">
          <div>
            <h2 className="text-2xl font-bold gradient-text">AI Interview Mode</h2>
            <p className="text-gray-300">Question {currentQuestion + 1} of {questions.length}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="w-full bg-white/20 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-orange-500 to-yellow-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Current Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              className="mb-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="glass rounded-xl p-6 mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">AI</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-3">
                      {questions[currentQuestion]?.question}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {questions[currentQuestion]?.tags?.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-white/10 text-sm text-gray-300 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Answer Input */}
              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <button
                    onClick={() => setIsRecording(!isRecording)}
                    className={`p-4 rounded-full transition-all ${
                      isRecording
                        ? 'bg-red-500 animate-pulse'
                        : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:scale-105'
                    }`}
                  >
                    {isRecording ? <FiMicOff className="text-white" size={24} /> : <FiMic className="text-white" size={24} />}
                  </button>
                  <div className="flex-1">
                    <textarea
                      placeholder="Type your answer here or use voice recording..."
                      className="w-full bg-white/10 border border-white/20 rounded-lg p-4 text-white placeholder-gray-400 resize-none"
                      rows={4}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.ctrlKey) {
                          handleAnswer(e.target.value)
                        }
                      }}
                    />
                    <p className="text-sm text-gray-400 mt-2">
                      Press Ctrl+Enter to submit your answer
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Feedback */}
          <AnimatePresence>
            {feedback && (
              <motion.div
                className="glass rounded-xl p-6 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <FiCheck className="text-green-400" />
                  AI Feedback
                </h4>
                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-gray-300">Score: </span>
                    <span className="text-lg font-bold text-white">{feedback.score}/10</span>
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-green-400 mb-2">Strengths:</h5>
                    <ul className="text-sm text-gray-300 space-y-1">
                      {feedback.strengths?.map((strength, index) => (
                        <li key={index}>• {strength}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-orange-400 mb-2">Areas for Improvement:</h5>
                    <ul className="text-sm text-gray-300 space-y-1">
                      {feedback.improvements?.map((improvement, index) => (
                        <li key={index}>• {improvement}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-4 border-t border-white/20">
                    <p className="text-sm text-gray-300 italic">"{feedback.overall}"</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controls */}
          <div className="flex justify-between items-center">
            <motion.button
              onClick={nextQuestion}
              disabled={!feedback && answers.length <= currentQuestion}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                feedback || answers.length > currentQuestion
                  ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:scale-105'
                  : 'bg-white/20 text-gray-400 cursor-not-allowed'
              }`}
              whileHover={feedback || answers.length > currentQuestion ? { scale: 1.05 } : {}}
              whileTap={feedback || answers.length > currentQuestion ? { scale: 0.95 } : {}}
            >
              {currentQuestion < questions.length - 1 ? 'Next Question' : 'Complete Interview'}
              <FiSkipForward className="inline ml-2" size={16} />
            </motion.button>

            <div className="text-sm text-gray-400">
              {answers.length}/{questions.length} answered
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default AIInterview