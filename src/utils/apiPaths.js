// ✅ Safe base URL setup
const BASE_URL = "https://ai-app-backend-x9lj.onrender.com/api";

// 📡 API endpoints
export const API_PATHS = {
  AUTH: {
    LOGIN: `${BASE_URL}/auth/login`,
    SIGNUP: `${BASE_URL}/auth/signup`,
  },

  SESSIONS: {
    CREATE: `${BASE_URL}/sessions/create`,
    GET_ALL: `${BASE_URL}/sessions/my-sessions`,
    GET_ONE: (id) => `${BASE_URL}/sessions/${id}`,
    UPDATE: (id) => `${BASE_URL}/sessions/${id}`,
    DELETE: (id) => `${BASE_URL}/sessions/${id}`,
  },

  CONTACT: {
    SUBMIT: `${BASE_URL}/contact`,
  },

  AI: {
    GENERATE_QUESTIONS: `${BASE_URL}/ai/generate-questions`,
    GENERATE_EXPLANATION: `${BASE_URL}/ai/generate-explanation`,
    GENERATE_FEEDBACK: `${BASE_URL}/ai/generate-feedback`,
    EVALUATE_INTERVIEW: `${BASE_URL}/ai/evaluate-interview`,
  },

  QUESTIONS: {
    UPDATE: (id) => `${BASE_URL}/questions/${id}`,
  },
};

export default BASE_URL;
