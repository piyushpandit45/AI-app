import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";

import QAItem from "../components/QAItems";
import EmptyState from "../components/EmptyState";
import GenerateButton from "../components/GenerateButton";
import SkeletonCard from "../components/SkeletonCard";
import { API_PATHS } from "../utils/apiPaths";

import axios from "../utils/axiosInstance";

// Topic-Based Study Materials Database
// Maps topic keywords to 2 best resources each
const TOPIC_STUDY_MATERIALS = {
  // Frontend Topics
  "react": [
    { title: "React.js Full Course", link: "https://www.youtube.com/watch?v=w7ejDZ8SWv8", platform: "YouTube" },
    { title: "React Official Documentation", link: "https://react.dev/learn", platform: "React Docs" }
  ],
  "javascript": [
    { title: "JavaScript.info - Modern JS Tutorial", link: "https://javascript.info/", platform: "JavaScript.info" },
    { title: "MDN Web Docs - JavaScript", link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript", platform: "MDN Docs" }
  ],
  "html": [
    { title: "MDN Web Docs - HTML", link: "https://developer.mozilla.org/en-US/docs/Web/HTML", platform: "MDN Docs" },
    { title: "W3Schools - HTML Tutorial", link: "https://www.w3schools.com/html/", platform: "W3Schools" }
  ],
  "css": [
    { title: "CSS Tricks - Flexbox & Grid", link: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/", platform: "CSS-Tricks" },
    { title: "MDN Web Docs - CSS", link: "https://developer.mozilla.org/en-US/docs/Web/CSS", platform: "MDN Docs" }
  ],
  "typescript": [
    { title: "TypeScript Full Course", link: "https://www.youtube.com/watch?v=BwuLxPH8IDs", platform: "YouTube" },
    { title: "TypeScript Documentation", link: "https://www.typescriptlang.org/docs/", platform: "TypeScript Docs" }
  ],
  "tailwind": [
    { title: "Tailwind CSS Full Course", link: "https://www.youtube.com/watch?v=ft30zcMlFao", platform: "YouTube" },
    { title: "Tailwind CSS Documentation", link: "https://tailwindcss.com/docs", platform: "Tailwind Docs" }
  ],

  // Backend Topics
  "node": [
    { title: "Node.js & Express Full Course", link: "https://www.youtube.com/watch?v=Oe421EPjeBE", platform: "YouTube" },
    { title: "Node.js Documentation", link: "https://nodejs.org/en/docs/", platform: "Node.js Docs" }
  ],
  "express": [
    { title: "Express.js Guide", link: "https://expressjs.com/en/guide/routing.html", platform: "Express Docs" },
    { title: "Express Full Tutorial", link: "https://www.youtube.com/watch?v=L72fhGm1tfE", platform: "YouTube" }
  ],
  "mongodb": [
    { title: "MongoDB University", link: "https://university.mongodb.com/", platform: "MongoDB" },
    { title: "MongoDB Documentation", link: "https://docs.mongodb.com/", platform: "MongoDB Docs" }
  ],
  "sql": [
    { title: "SQLBolt - SQL Tutorial", link: "https://sqlbolt.com/", platform: "SQLBolt" },
    { title: "W3Schools - SQL Tutorial", link: "https://www.w3schools.com/sql/", platform: "W3Schools" }
  ],
  "postgresql": [
    { title: "PostgreSQL Tutorial", link: "https://www.postgresqltutorial.com/", platform: "PostgreSQL Tutorial" },
    { title: "PostgreSQL Documentation", link: "https://www.postgresql.org/docs/", platform: "PostgreSQL Docs" }
  ],
  "api": [
    { title: "REST API Design Best Practices", link: "https://restfulapi.net/", platform: "RESTful API" },
    { title: "MDN Web Docs - Fetch API", link: "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API", platform: "MDN Docs" }
  ],

  // Full Stack Topics
  "mern": [
    { title: "MERN Stack Full Course", link: "https://www.youtube.com/watch?v=-0exw-9YJBo", platform: "YouTube" },
    { title: "freeCodeCamp - Full Stack", link: "https://www.freecodecamp.org/learn/full-stack-developer/", platform: "freeCodeCamp" }
  ],
  "nextjs": [
    { title: "Next.js Full Course", link: "https://www.youtube.com/watch?v=1W8g6Ch4e7c", platform: "YouTube" },
    { title: "Next.js Documentation", link: "https://nextjs.org/docs", platform: "Next.js Docs" }
  ],
  "authentication": [
    { title: "JWT Authentication Tutorial", link: "https://www.youtube.com/watch?v=mbsmsi7l3r4", platform: "YouTube" },
    { title: "OAuth 2.0 Guide", link: "https://oauth.net/2/", platform: "OAuth" }
  ],

  // DevOps Topics
  "docker": [
    { title: "Docker Full Course", link: "https://www.youtube.com/watch?v=3c-iBn73dDE", platform: "YouTube" },
    { title: "Docker Documentation", link: "https://docs.docker.com/", platform: "Docker Docs" }
  ],
  "kubernetes": [
    { title: "Kubernetes Full Course", link: "https://www.youtube.com/watch?v=X48VuDVv0do", platform: "YouTube" },
    { title: "Kubernetes Documentation", link: "https://kubernetes.io/docs/", platform: "Kubernetes Docs" }
  ],
  "aws": [
    { title: "AWS Full Course", link: "https://www.youtube.com/watch?v=3snG2k8qUuY", platform: "YouTube" },
    { title: "AWS Documentation", link: "https://docs.aws.amazon.com/", platform: "AWS Docs" }
  ],
  "ci/cd": [
    { title: "CI/CD Pipeline Tutorial", link: "https://www.youtube.com/watch?v=7KfsaS3yO4Q", platform: "YouTube" },
    { title: "GitHub Actions Docs", link: "https://docs.github.com/en/actions", platform: "GitHub" }
  ],
  "jenkins": [
    { title: "Jenkins Full Course", link: "https://www.youtube.com/watch?v=9xHds9wB6qk", platform: "YouTube" },
    { title: "Jenkins Documentation", link: "https://www.jenkins.io/doc/", platform: "Jenkins" }
  ],

  // Data Science Topics
  "python": [
    { title: "Python Full Course", link: "https://www.youtube.com/watch?v=rfscVS0vtbw", platform: "YouTube" },
    { title: "Python Documentation", link: "https://docs.python.org/3/", platform: "Python Docs" }
  ],
  "machine learning": [
    { title: "Machine Learning Specialization", link: "https://www.coursera.org/specializations/machine-learning-introduction", platform: "Coursera" },
    { title: "Scikit-learn Documentation", link: "https://scikit-learn.org/stable/", platform: "Scikit-learn" }
  ],
  "pandas": [
    { title: "Pandas Full Course", link: "https://www.youtube.com/watch?v=vmEHCJofslg", platform: "YouTube" },
    { title: "Pandas Documentation", link: "https://pandas.pydata.org/docs/", platform: "Pandas Docs" }
  ],
  "numpy": [
    { title: "NumPy Tutorial", link: "https://www.youtube.com/watch?v=QUT1VHiLmmI", platform: "YouTube" },
    { title: "NumPy Documentation", link: "https://numpy.org/doc/", platform: "NumPy Docs" }
  ],
  "data analysis": [
    { title: "Kaggle Learn - Data Analysis", link: "https://www.kaggle.com/learn", platform: "Kaggle" },
    { title: "Data Analysis with Python", link: "https://www.coursera.org/learn/python-data-analysis", platform: "Coursera" }
  ],

  // General / Default
  "default": [
    { title: "freeCodeCamp - Learn to Code", link: "https://www.freecodecamp.org/", platform: "freeCodeCamp" },
    { title: "GeeksforGeeks - Interview Prep", link: "https://www.geeksforgeeks.org/interview-preparation/", platform: "GeeksforGeeks" }
  ]
};

const InterviewPrep = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [limitReached, setLimitReached] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [sessionData, setSessionData] = useState(null);
  const [isGuest, setIsGuest] = useState(false);

  // Check authentication on component mount
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login');
      return;
    }
    
    try {
      const currentUser = JSON.parse(userStr);
      setIsGuest(currentUser?.isGuest || false);
    } catch (error) {
      console.error('Invalid user data:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/login');
      return;
    }
  }, [navigate]);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      console.log('🔍 Fetching questions for session:', id);
      
      // For guest users, load from localStorage
      const userStr = localStorage.getItem('user');
      const currentUser = userStr ? JSON.parse(userStr) : null;
      
      if (currentUser?.isGuest) {
        // Load guest sessions from localStorage
        const guestSessions = JSON.parse(localStorage.getItem('guestSessions') || '[]');
        const session = guestSessions.find(s => s._id === id);
        if (session) {
          const questions = session?.questions || [];
          console.log('📝 Guest questions found:', questions.length);
          setQuestions(questions);
          setSessionData(session);
        } else {
          console.log('⚠️ Guest session not found');
        }
      } else {
        // Logged-in users: fetch from backend
        const res = await axios.get(API_PATHS.SESSIONS.GET_ONE(id));
        console.log('✅ Session data received:', res.data);
        const session = res.data.data.session;
        const questions = session?.questions || [];
        console.log('📝 Questions found:', questions.length);
        console.log('📋 Questions data:', questions);
        setQuestions(questions);
        setSessionData(session);
      }
    } catch (err) {
      console.error('❌ Failed to fetch questions:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const generateQuestions = async () => {
    setGenerating(true);
    try {
      console.log('🔍 Generating questions for session:', id);
      
      // For guest users, generate mock questions locally
      const userStr = localStorage.getItem('user');
      const currentUser = userStr ? JSON.parse(userStr) : null;
      
      if (currentUser?.isGuest) {
        // Generate mock questions for guest users
        const guestSessions = JSON.parse(localStorage.getItem('guestSessions') || '[]');
        const session = guestSessions.find(s => s._id === id);
        
        if (session) {
          // Mock questions based on role
          const mockQuestions = [
            {
              _id: `q_${Date.now()}_1`,
              question: `Tell me about yourself and your experience as a ${session.role || 'developer'}.`,
              answer: ''
            },
            {
              _id: `q_${Date.now()}_2`,
              question: `What are your strengths and weaknesses?`,
              answer: ''
            },
            {
              _id: `q_${Date.now()}_3`,
              question: `Why do you want to work as a ${session.role || 'developer'}?`,
              answer: ''
            }
          ];
          
          // Update session with questions
          session.questions = mockQuestions;
          const updatedSessions = guestSessions.map(s => s._id === id ? session : s);
          localStorage.setItem('guestSessions', JSON.stringify(updatedSessions));
          
          setQuestions(mockQuestions);
          setSessionData(session);
          toast.success("Question generated!");
        }
      } else {
        // Logged-in users: call backend API
        const response = await axios.post(API_PATHS.AI.GENERATE_QUESTIONS, { sessionId: id });
        console.log('✅ Questions generated successfully:', response.data);
        
        // Check if limit reached
        if (response.data.limitReached) {
          setLimitReached(true);
          toast.error("Maximum 10 questions reached!");
        } else {
          await fetchQuestions();
          toast.success("Question generated!");
        }
      }
    } catch (err) {
      console.error('❌ Failed to generate questions:', err.response?.data || err.message);
      if (err.response?.data?.limitReached) {
        setLimitReached(true);
        toast.error("Maximum 10 questions reached!");
      } else {
        console.log('Question generation failed, will try again');
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleAnswerChange = async (questionId, answer) => {
    try {
      console.log('💾 Saving answer for question:', questionId);
      
      // For guest users, save to localStorage
      const userStr = localStorage.getItem('user');
      const currentUser = userStr ? JSON.parse(userStr) : null;
      
      if (currentUser?.isGuest) {
        // Save to localStorage
        const guestSessions = JSON.parse(localStorage.getItem('guestSessions') || '[]');
        const sessionIndex = guestSessions.findIndex(s => s._id === id);
        
        if (sessionIndex !== -1) {
          const session = guestSessions[sessionIndex];
          const questionIndex = session.questions?.findIndex(q => q._id === questionId);
          
          if (questionIndex !== -1) {
            session.questions[questionIndex].answer = answer;
            guestSessions[sessionIndex] = session;
            localStorage.setItem('guestSessions', JSON.stringify(guestSessions));
          }
        }
        
        // Update local state
        setQuestions(prev => prev.map(q => 
          q._id === questionId ? { ...q, answer } : q
        ));
        
        console.log('✅ Answer saved to localStorage');
      } else {
        // Logged-in users: save to backend
        await axios.put(`${API_PATHS.QUESTIONS.UPDATE(questionId)}`, { answer });
        
        // Update local state
        setQuestions(prev => prev.map(q => 
          q._id === questionId ? { ...q, answer } : q
        ));
        
        console.log('✅ Answer saved successfully');
      }
    } catch (err) {
      console.error('❌ Failed to save answer:', err.response?.data || err.message);
      toast.error("Failed to save answer");
    }
  };

  const evaluateInterview = async () => {
    setEvaluating(true);
    try {
      console.log('🔍 Evaluating interview for session:', id);
      
      // For guest users, show mock evaluation
      const userStr = localStorage.getItem('user');
      const currentUser = userStr ? JSON.parse(userStr) : null;
      
      if (currentUser?.isGuest) {
        // Mock evaluation for guest users
        const mockEvaluation = {
          score: Math.floor(Math.random() * 20) + 75, // Random score between 75-95
          strengths: [
            "Good communication skills",
            "Clear and concise answers",
            "Demonstrated technical knowledge"
          ],
          weaknesses: [
            "Could provide more specific examples",
            "Consider elaborating on your experience",
            "Add more details about your projects"
          ],
          overall: "You did well in this interview! Your answers were clear and demonstrated good understanding of the role. With a bit more detail and specific examples, you could significantly improve your performance.",
          recommendations: [
            "Prepare specific examples from your experience",
            "Practice the STAR method for behavioral questions",
            "Research the company and role more deeply"
          ],
          questionsAnswered: questions.filter(q => q.answer && q.answer.trim()).length,
          totalQuestions: questions.length,
          source: 'Mock Evaluation (Guest Mode)'
        };
        
        setEvaluation(mockEvaluation);
        toast.success("Interview evaluated successfully!");
      } else {
        // Logged-in users: call backend API
        const response = await axios.post(API_PATHS.AI.EVALUATE_INTERVIEW, { sessionId: id });
        console.log('✅ Interview evaluated successfully:', response.data);
        
        setEvaluation(response.data.data);
        toast.success("Interview evaluated successfully!");
      }
    } catch (err) {
      console.error('❌ Failed to evaluate interview:', err.response?.data || err.message);
      toast.error("Failed to evaluate interview");
    } finally {
      setEvaluating(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // Helper function to match topic from user input
  const getTopicMaterials = (topicsToFocus) => {
    if (!topicsToFocus || !topicsToFocus.trim()) {
      return TOPIC_STUDY_MATERIALS.default;
    }

    const topicsLower = topicsToFocus.toLowerCase();
    
    // Check for matching topic keywords
    for (const [topic, materials] of Object.entries(TOPIC_STUDY_MATERIALS)) {
      if (topic === "default") continue;
      
      // Check if topic keyword is in the user input
      if (topicsLower.includes(topic)) {
        return materials;
      }
    }

    // If no match found, return default
    return TOPIC_STUDY_MATERIALS.default;
  };

  return (
    <div className="w-full min-h-screen bg-slate-50">
      <Toaster
        position="top-right"
        toastOptions={{ className: "!text-sm !font-medium" }}
      />

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs text-slate-400 font-medium tracking-wide uppercase mb-1">
              Session ID: {id?.slice(0, 8)}
            </p>
            <h1 className="text-2xl font-bold text-slate-800">
              Interview Questions
            </h1>
            {!loading && (
              <p className="text-sm text-slate-500 mt-0.5">
                {questions.length > 0
                  ? `${questions.length} question${questions.length !== 1 ? "s" : ""} ready`
                  : "No questions yet"}
              </p>
            )}
          </div>

          <GenerateButton
            onClick={generateQuestions}
            generating={generating}
            loading={loading}
          />
        </div>

        {/* ── Divider ── */}
        <div className="border-t border-slate-200 mb-8" />

        {/* ── Content ── */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : questions.length === 0 ? (
          <EmptyState onGenerate={generateQuestions} generating={generating} />
        ) : (
          <AnimatePresence>
            <div className="space-y-4">
              {questions.filter(q => q && q._id).map((q, i) => (
                <motion.div
                  key={q._id || `question-${i}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                >
                  <QAItem 
                    item={q} 
                    onAnswerChange={handleAnswerChange}
                    showAnswerInput={!evaluation} // Hide input after evaluation
                  />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
        
        {/* ── Evaluation Section ── */}
        {questions.length >= (isGuest ? 3 : 5) && !evaluation && (
          <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              Ready for Evaluation?
            </h3>
            <p className="text-blue-700 mb-4">
              You've answered {questions.filter(q => q.answer && q.answer.trim()).length} questions. 
              Get your AI-powered interview evaluation now!
            </p>
            <button
              onClick={evaluateInterview}
              disabled={evaluating}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
            >
              {evaluating ? "Evaluating..." : "Evaluate Interview"}
            </button>
          </div>
        )}

        {/* ── Evaluation Results ── */}
        {evaluation && (
          <div className="mt-8 p-6 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-green-900">
                Interview Evaluation
              </h3>
              <div className="text-3xl font-bold text-green-600">
                {evaluation.score}/100
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-medium text-green-800 mb-2">Strengths:</h4>
                <ul className="space-y-1">
                  {evaluation.strengths.map((strength, i) => (
                    <li key={i} className="text-green-700 flex items-start">
                      <span className="mr-2">✓</span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-orange-800 mb-2">Areas to Improve:</h4>
                <ul className="space-y-1">
                  {evaluation.weaknesses.map((weakness, i) => (
                    <li key={i} className="text-orange-700 flex items-start">
                      <span className="mr-2">•</span>
                      {weakness}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="font-medium text-gray-800 mb-2">Overall Assessment:</h4>
              <p className="text-gray-700">{evaluation.overall}</p>
            </div>
            
            {evaluation.recommendations && (
              <div>
                <h4 className="font-medium text-blue-800 mb-2">Recommendations:</h4>
                <ul className="space-y-1">
                  {evaluation.recommendations.map((rec, i) => (
                    <li key={i} className="text-blue-700 flex items-start">
                      <span className="mr-2">→</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="mt-4 text-sm text-gray-600">
              <p>Questions answered: {evaluation.questionsAnswered}/{evaluation.totalQuestions}</p>
              <p>Evaluation source: {evaluation.source || 'AI'}</p>
            </div>
          </div>
        )}

        {/* ── Study Materials Section ── */}
        {evaluation && sessionData && (
          <div className="mt-8 p-6 bg-purple-50 rounded-lg border border-purple-200">
            <h3 className="text-xl font-semibold text-purple-900 mb-4">
              📚 Study Materials
            </h3>
            <p className="text-purple-700 mb-4">
              {sessionData?.topicsToFocus 
                ? `Based on your focus topic "${sessionData.topicsToFocus}", here are the best resources:`
                : "Here are some general interview preparation resources:"}
            </p>
            <div className="space-y-3">
              {getTopicMaterials(sessionData?.topicsToFocus).map((material, index) => (
                <a
                  key={index}
                  href={material.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 bg-white rounded-lg border border-purple-100 hover:border-purple-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">
                        {material.title}
                      </h4>
                      <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                        {material.platform}
                      </span>
                    </div>
                    <span className="text-purple-400 ml-2">
                      →
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default InterviewPrep;