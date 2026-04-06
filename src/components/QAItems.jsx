import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { FiMic } from "react-icons/fi";

const QAItem = ({ item, onPin, onAnswerChange, showAnswerInput = true }) => {
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState(item.answer || "");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // Initialize speech recognition
  const initializeSpeechRecognition = () => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setAnswer(prevAnswer => prevAnswer + (prevAnswer ? ' ' : '') + transcript);
          if (onAnswerChange) {
            onAnswerChange(item._id, answer + (answer ? ' ' : '') + transcript);
          }
          setIsListening(false);
        };

        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  };

  // Start speech recognition
  const startListening = () => {
    if (!recognitionRef.current) {
      initializeSpeechRecognition();
    }
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        setIsListening(false);
      }
    } else {
      alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
    }
  };

  // Stop speech recognition
  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
        setIsListening(false);
      }
    }
  };

  // Toggle speech recognition
  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.error('Error stopping recognition on unmount:', error);
        }
      }
    };
  }, []);

  const handleAnswerChange = (e) => {
    const newAnswer = e.target.value;
    setAnswer(newAnswer);
    if (onAnswerChange) {
      onAnswerChange(item._id, newAnswer);
    }
  };

  return (
    <div className="bg-white rounded shadow mb-4 p-4 transition hover:shadow-md">
      <div className="flex justify-between items-center">
        <h3
          className="font-semibold cursor-pointer text-black text-lg"
          onClick={() => setOpen(!open)}
        >
          {item.question}
        </h3>

        <button onClick={() => onPin?.(item._id)}>
          {item.pinned ? "📌" : "📍"}
        </button>
      </div>

      {open && (
        <div className="mt-3 space-y-3">
          {showAnswerInput && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Answer:
              </label>
              <div className="relative">
                <textarea
                  value={answer}
                  onChange={handleAnswerChange}
                  placeholder="Type your answer here or use voice input..."
                  className="w-full p-3 pr-12 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-900 placeholder-gray-500 font-medium bg-white"
                  rows={4}
                />
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`absolute right-2 top-2 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isListening 
                      ? 'bg-red-500 text-white animate-pulse' 
                      : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                  }`}
                  title={isListening ? 'Stop listening' : 'Start voice input'}
                >
                  <FiMic size={16} />
                </button>
              </div>
              {isListening && (
                <p className="text-xs text-blue-600 mt-1 font-medium flex items-center gap-1">
                  <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  Listening... Speak now
                </p>
              )}
            </div>
          )}
          
          {item.answer && (
            <div className="text-gray-700">
              <h4 className="font-medium text-sm text-gray-600 mb-1">Saved Answer:</h4>
              <ReactMarkdown>{item.answer}</ReactMarkdown>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QAItem;