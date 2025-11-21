import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { sessionService } from './SessionService';

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
    sessionType: "PUBLIC",
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

    // Validate private session password
    if (sessionData.sessionType === 'PRIVATE' && (!sessionData.password || sessionData.password.length < 6)) {
      alert("Private sessions require a password of at least 6 characters");
      setIsSubmitting(false);
      return;
    }

    try {
      await sessionService.createSession(sessionData, userId);
      
      // Show success message
      alert(`Session "${sessionData.title}" created successfully!`);
      navigate('/dashboard');
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

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const data = await sessionService.getAllSessions();
      setSessions(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch sessions. Please try again later.');
      console.error("Error fetching sessions:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    sessions,
    loading,
    error,
    refetch: fetchSessions
  };
};