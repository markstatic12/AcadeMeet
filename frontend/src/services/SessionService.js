import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import axios from 'axios';

// Configure axios defaults
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Request interceptor to add user ID header
api.interceptors.request.use((config) => {
  // Get userId from localStorage or context if needed
  const userId = localStorage.getItem('userId');
  if (userId) {
    config.headers['X-User-Id'] = userId;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || error.response?.data?.message || error.message;
    throw new Error(message);
  }
);

// Session API Service
export const sessionService = {
  async createSession(sessionData, userId) {
    const submissionData = {
      ...sessionData,
      maxParticipants: sessionData.maxParticipants ? parseInt(sessionData.maxParticipants) : null,
      currentParticipants: 0,
      status: 'ACTIVE',
      password: sessionData.sessionType === 'PUBLIC' ? null : sessionData.password
    };

    const response = await api.post('/sessions', submissionData, {
      headers: { 'X-User-Id': userId?.toString() }
    });
    return response.data;
  },

  async validateSessionPassword(sessionId, password, userId) {
    const response = await api.post(`/sessions/${sessionId}/validate-password`, { password, userId }, {
      headers: { 'X-User-Id': userId?.toString() }
    });
    return response.data;
  },

  async joinSession(sessionId, password, userId) {
    const response = await api.post(`/sessions/${sessionId}/join`, { password, userId }, {
      headers: { 'X-User-Id': userId?.toString() }
    });
    return response.data;
  },

  async updateSessionStatus(sessionId, status, userId) {
    const response = await api.patch(`/sessions/${sessionId}/status`, { status }, {
      headers: { 'X-User-Id': userId?.toString() }
    });
    return response.data;
  },

  async getSessionsByStatus(status, userId) {
    const url = status ? `/sessions?status=${status}` : '/sessions';
    const response = await api.get(url, {
      headers: { 'X-User-Id': userId?.toString() }
    });
    return response.data;
  },

  async getSessionsForLinking(userId) {
    const response = await api.get('/sessions?status=ACTIVE,SCHEDULED', {
      headers: { 'X-User-Id': userId?.toString() }
    });
    return response.data.filter(session => 
      session.sessionType === 'PUBLIC' || session.sessionType === 'PROTECTED'
    );
  },

  async getAllSessions(userId) {
    const response = await api.get('/sessions/all-sessions', {
      headers: { 'X-User-Id': userId?.toString() }
    });
    return response.data;
  },

  async getSessionById(sessionId, userId) {
    const response = await api.get(`/sessions/${sessionId}`, {
      headers: { 'X-User-Id': userId?.toString() }
    });
    return response.data;
  }
};

// Session Form Logic Hook
export const useSessionForm = () => {
  const navigate = useNavigate();
  const { getUserId } = useUser();

  const [sessionData, setSessionData] = useState({
    title: "",
    month: "",
    day: "",
    year: "",
    startTime: "",
    endTime: "",
    location: "",
    locationType: "in-person",
    sessionType: "",
    password: "",
    maxParticipants: "",
    description: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setSessionData({ ...sessionData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setSessionData({ ...sessionData, password: e.target.value });
  };

  const handleParticipantsChange = (e) => {
    setSessionData({ ...sessionData, maxParticipants: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const userId = getUserId();
    if (!userId) {
      alert("User not logged in");
      setIsSubmitting(false);
      return;
    }

    if (sessionData.sessionType === 'PRIVATE' && (!sessionData.password || sessionData.password.length < 6)) {
      alert("Private sessions require a password of at least 6 characters");
      setIsSubmitting(false);
      return;
    }

    try {
      await sessionService.createSession(sessionData, userId);
      navigate('/profile', { state: { sessionCreated: true, title: sessionData.title } });
    } catch (error) {
      console.error("Error creating session:", error);
      alert("Error creating session: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  return {
    sessionData,
    isSubmitting,
    handleChange,
    handlePasswordChange,
    handleParticipantsChange,
    handleSubmit,
    handleBack
  };
};

// Sessions Page Logic Hook
export const useSessionsPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getUserId } = useUser();

  useEffect(() => {
    fetchSessions();
  }, [getUserId]);

  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      const userId = getUserId();
      const data = await sessionService.getAllSessions(userId);
      setSessions(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch sessions. Please try again later.');
      console.error("Error fetching sessions:", err);
    } finally {
      setLoading(false);
    }
  }, [getUserId]);

  return {
    sessions,
    loading,
    error,
    refetch: fetchSessions
  };
};