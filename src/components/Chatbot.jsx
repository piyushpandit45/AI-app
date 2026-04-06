import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMessageSquare, FiX, FiSend, FiMic } from 'react-icons/fi'

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: "Hello! I'm your AI assistant. How can I help you today? Feel free to ask any question or click one below. You can also click 'Start Quiz' to go through questions sequentially.",
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  
  // Quiz mode states
  const [quizMode, setQuizMode] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  
  // Speech recognition states
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef(null)

  // Comprehensive Q&A database (30+ questions in English)
  const faqs = [
    { question: "What is InterviewAI?", answer: "InterviewAI is an AI-powered platform that helps you prepare for job interviews by generating realistic interview questions and providing instant feedback on your answers." },
    { question: "How do I get started with InterviewAI?", answer: "Simply sign up for an account, log in, and create a new interview session by selecting your job role and experience level." },
    { question: "Is InterviewAI free to use?", answer: "Yes, InterviewAI offers free basic features including interview generation and AI feedback. Premium features may be available in the future." },
    { question: "What types of interviews can I practice?", answer: "You can practice interviews for various roles such as software developer, data analyst, project manager, marketing, and many more technical and non-technical positions." },
    { question: "How does the AI generate interview questions?", answer: "The AI analyzes your selected job role, experience level, and focus topics to generate relevant, industry-specific interview questions tailored to your needs." },
    { question: "How many questions are included in each interview session?", answer: "Each interview session typically includes 10 questions, but you can customize this based on your preferences." },
    { question: "Can I record my answers during the interview?", answer: "Yes, you can type your answers for each question, and the AI will analyze them to provide detailed feedback." },
    { question: "How does the AI evaluate my answers?", answer: "The AI uses natural language processing to analyze the quality, relevance, completeness, and professionalism of your answers, then provides constructive feedback." },
    { question: "Will I receive a score after completing the interview?", answer: "Yes, after completing all questions, the AI calculates an overall score based on your answer quality and provides a performance summary." },
    { question: "Can I review my previous interview sessions?", answer: "Yes, all your completed interview sessions are saved in your dashboard, where you can review your answers, scores, and feedback anytime." },
    { question: "How do I create a new interview session?", answer: "Go to your dashboard, click the 'Create Session' or 'Start Interview' button, fill in the required details (role, experience, topics), and submit to begin." },
    { question: "What topics can I focus on during the interview?", answer: "You can specify topics like technical skills, behavioral questions, problem-solving, communication, leadership, or any other area relevant to your target role." },
    { question: "Can I practice interviews for different job roles?", answer: "Absolutely! You can create multiple interview sessions for different job roles to diversify your preparation." },
    { question: "Is my interview data secure and private?", answer: "Yes, your data is encrypted and stored securely. We do not share your interview answers or personal information with third parties." },
    { question: "What should I do if I forget my password?", answer: "Click the 'Forgot Password' link on the login page, enter your email address, and follow the instructions to reset your password." },
    { question: "Can I delete my interview sessions?", answer: "Yes, you can delete any interview session from your dashboard by clicking the delete button on the session card." },
    { question: "Does InterviewAI provide industry-specific questions?", answer: "Yes, the AI generates questions specific to your chosen industry, whether it's tech, finance, healthcare, education, or any other sector." },
    { question: "How accurate is the AI feedback?", answer: "The AI feedback is highly accurate and based on industry standards, but we recommend using it as a guide alongside human mentorship for best results." },
    { question: "Can I share my interview results with others?", answer: "Currently, interview results are private to your account. Future updates may include sharing features for mentors or recruiters." },
    { question: "What browsers does InterviewAI support?", answer: "InterviewAI works on all modern browsers including Chrome, Firefox, Safari, and Edge on both desktop and mobile devices." },
    { question: "Is there a mobile app available?", answer: "InterviewAI is currently web-based and optimized for mobile browsers. A dedicated mobile app may be developed in the future." },
    { question: "How often are the AI models updated?", answer: "We regularly update our AI models to improve question quality, feedback accuracy, and overall user experience." },
    { question: "Can I use InterviewAI for group practice sessions?", answer: "Currently, InterviewAI is designed for individual practice. Group features may be added in future updates." },
    { question: "What if the AI doesn't understand my answer?", answer: "The AI is designed to understand various answer formats. If you receive unclear feedback, try being more specific and structured in your responses." },
    { question: "How do I contact customer support?", answer: "You can reach us through the Contact page on our website or use the WhatsApp button for instant support." },
    { question: "Can I pause and resume an interview session?", answer: "Yes, you can pause your session and return to it later. Your progress will be saved automatically." },
    { question: "Does InterviewAI offer mock interviews with time limits?", answer: "Yes, you can set time limits for each question to simulate real interview pressure and improve your time management skills." },
    { question: "How is the overall score calculated?", answer: "The score is based on multiple factors including answer relevance, completeness, clarity, and professional tone, combined into a percentage." },
    { question: "Can I practice behavioral interview questions?", answer: "Yes, you can specify behavioral questions as a focus topic, and the AI will generate questions like 'Tell me about a time you faced a challenge.'" },
    { question: "Is there a limit on how many interviews I can create?", answer: "There is no strict limit on the number of interviews you can create. Practice as much as you need to improve your skills." },
  ]

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Cleanup speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (error) {
          console.error('Error stopping recognition on unmount:', error)
        }
      }
    }
  }, [])

  // Start quiz mode - sequential question flow
  const startQuizMode = () => {
    setQuizMode(true)
    setCurrentQuestionIndex(0)
    setMessages([
      {
        type: 'bot',
        text: "Great! Let's start the quiz. I'll show you questions one by one. Click 'Next Question' to continue or type your own question.",
      },
      {
        type: 'bot',
        text: `Q${currentQuestionIndex + 1}: ${faqs[currentQuestionIndex].question}`,
      }
    ])
  }

  // Exit quiz mode
  const exitQuizMode = () => {
    setQuizMode(false)
    setCurrentQuestionIndex(0)
    setMessages([
      {
        type: 'bot',
        text: "Quiz mode exited. You can now ask any question or click 'Start Quiz' again to resume.",
      }
    ])
  }

  // Handle next question in quiz mode
  const handleNextQuestion = () => {
    if (currentQuestionIndex < faqs.length - 1) {
      const nextIndex = currentQuestionIndex + 1
      setCurrentQuestionIndex(nextIndex)
      setMessages(prev => [
        ...prev,
        {
          type: 'bot',
          text: `Q${nextIndex + 1}: ${faqs[nextIndex].question}`,
        }
      ])
    } else {
      setMessages(prev => [
        ...prev,
        {
          type: 'bot',
          text: "🎉 Congratulations! You've completed all questions. Click 'Start Quiz' to begin again or ask any other question.",
        }
      ])
      setQuizMode(false)
      setCurrentQuestionIndex(0)
    }
  }

  // Show answer for current question in quiz mode
  const showAnswer = () => {
    if (quizMode && currentQuestionIndex < faqs.length) {
      setMessages(prev => [
        ...prev,
        {
          type: 'bot',
          text: `Answer: ${faqs[currentQuestionIndex].answer}`,
        }
      ])
    }
  }

  // Initialize speech recognition
  const initializeSpeechRecognition = () => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = false
        recognition.lang = 'en-US'

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript
          setInputValue(transcript)
          setIsListening(false)
        }

        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error)
          setIsListening(false)
        }

        recognition.onend = () => {
          setIsListening(false)
        }

        recognitionRef.current = recognition
      }
    }
  }

  // Start speech recognition
  const startListening = () => {
    if (!recognitionRef.current) {
      initializeSpeechRecognition()
    }
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start()
        setIsListening(true)
      } catch (error) {
        console.error('Error starting speech recognition:', error)
        setIsListening(false)
      }
    } else {
      alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.')
    }
  }

  // Stop speech recognition
  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
        setIsListening(false)
      } catch (error) {
        console.error('Error stopping speech recognition:', error)
        setIsListening(false)
      }
    }
  }

  // Toggle speech recognition
  const toggleListening = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  // Find answer for user input
  const findAnswer = (userMessage) => {
    const normalizedInput = userMessage.toLowerCase().trim()
    const faq = faqs.find(faq => 
      faq.question.toLowerCase().includes(normalizedInput) || 
      normalizedInput.includes(faq.question.toLowerCase().split(' ')[0])
    )
    return faq ? faq.answer : "Sorry, I didn't understand. Please choose a question from the list below."
  }

  // Handle sending message
  const handleSendMessage = (text) => {
    const message = text || inputValue.trim()
    if (!message) return

    // Add user message
    setMessages(prev => [...prev, { type: 'user', text: message }])
    setInputValue('')
    setIsTyping(true)

    // Simulate bot response delay
    setTimeout(() => {
      const answer = findAnswer(message)
      setMessages(prev => [...prev, { type: 'bot', text: answer }])
      setIsTyping(false)
    }, 500)
  }

  // Handle predefined question click
  const handleQuestionClick = (question) => {
    handleSendMessage(question)
  }

  // Handle input change
  const handleInputChange = (e) => {
    setInputValue(e.target.value)
  }

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault()
    handleSendMessage()
  }

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-6 z-50 w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Chat with AI Assistant"
      >
        {isOpen ? (
          <FiX size={24} className="text-white" />
        ) : (
          <FiMessageSquare size={24} className="text-white" />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 z-40 w-[calc(100%-3rem)] sm:w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <FiMessageSquare size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">AI Assistant</h3>
                  <p className="text-white/80 text-xs">Online • Ready to help</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-md'
                        : 'bg-white text-gray-800 rounded-bl-md shadow-sm'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Predefined Questions */}
            <div className="px-4 py-3 bg-white border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2 font-medium">Quick Actions:</p>
              <div className="flex flex-wrap gap-2">
                {!quizMode ? (
                  <>
                    <button
                      onClick={startQuizMode}
                      className="px-4 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs rounded-full transition-colors hover:shadow-md"
                    >
                      Start Quiz
                    </button>
                    {faqs.slice(0, 3).map((faq, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuestionClick(faq.question)}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-indigo-100 text-gray-700 hover:text-indigo-700 text-xs rounded-full transition-colors"
                      >
                        {faq.question.length > 25 ? faq.question.substring(0, 25) + '...' : faq.question}
                      </button>
                    ))}
                  </>
                ) : (
                  <>
                    <button
                      onClick={showAnswer}
                      className="px-4 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs rounded-full transition-colors"
                    >
                      Show Answer
                    </button>
                    <button
                      onClick={handleNextQuestion}
                      className="px-4 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs rounded-full transition-colors hover:shadow-md"
                    >
                      Next Question
                    </button>
                    <button
                      onClick={exitQuizMode}
                      className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs rounded-full transition-colors"
                    >
                      Exit Quiz
                    </button>
                    <span className="px-3 py-1.5 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                      {currentQuestionIndex + 1} / {faqs.length}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Input Area */}
            <div className="px-4 py-3 bg-white border-t border-gray-100">
              <form onSubmit={handleSubmit} className="flex gap-2 items-center">
                <div className="flex-1 relative flex items-center">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="Type your message or use voice input..."
                    className="flex-1 px-4 py-2.5 pr-12 bg-white border-2 border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-500 font-medium"
                  />
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={`absolute right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isListening 
                        ? 'bg-red-500 text-white animate-pulse' 
                        : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
                    }`}
                    title={isListening ? 'Stop listening' : 'Start voice input'}
                  >
                    <FiMic size={16} />
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiSend size={18} />
                </button>
              </form>
              {isListening && (
                <p className="text-xs text-indigo-600 mt-2 font-medium flex items-center gap-1">
                  <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  Listening... Speak now
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Chatbot
