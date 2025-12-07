import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { sessionService } from './SessionService';

// Session Form Logic Hook
export const useSessionForm = (showToast) => {
  const navigate = useNavigate();

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
    description: "",
    tags: [],
    noteIds: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    setSessionData({ ...sessionData, [e.target.name]: e.target.value });
    // Clear error when user types
    if (fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: null });
    }
  };

  const handlePasswordChange = (e) => {
    setSessionData({ ...sessionData, password: e.target.value });
    if (fieldErrors.password) {
      setFieldErrors({ ...fieldErrors, password: null });
    }
  };

  const handleParticipantsChange = (e) => {
    setSessionData({ ...sessionData, maxParticipants: e.target.value });
  };

  const handleTagsChange = (tags) => {
    setSessionData({ ...sessionData, tags });
  };

  const handleNotesChange = (noteIds) => {
    setSessionData({ ...sessionData, noteIds });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    const errors = {};
    const requiredFields = [
      { name: 'title', label: 'Session Title' },
      { name: 'month', label: 'Month' },
      { name: 'day', label: 'Day' },
      { name: 'year', label: 'Year' },
      { name: 'startTime', label: 'Start Time' },
      { name: 'endTime', label: 'End Time' },
      { name: 'location', label: 'Location' },
      { name: 'sessionType', label: 'Session Type' }
    ];

    requiredFields.forEach(field => {
      if (!sessionData[field.name] || sessionData[field.name].toString().trim() === '') {
        errors[field.name] = `${field.label} is required`;
      }
    });

    // Validate private session password
    if (sessionData.sessionType === 'PRIVATE' && (!sessionData.password || sessionData.password.length < 6)) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      if (showToast) {
        showToast('error', 'Please fill in all required fields');
      }
      setIsSubmitting(false);
      return;
    }

    try {
      await sessionService.createSession(sessionData);
      
      if (showToast) {
        showToast('success', 'Session created successfully!');
      }
      // Navigate after a brief delay to show the toast
      setTimeout(() => {
        navigate('/profile', { state: { sessionCreated: true, title: sessionData.title } });
      }, 1500);
    } catch (error) {
      console.error("Error creating session:", error);
      if (showToast) {
        showToast('error', `Error creating session: ${error.message}`);
      }
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
    fieldErrors,
    handleChange,
    handlePasswordChange,
    handleParticipantsChange,
    handleTagsChange,
    handleSubmit,
    handleBack,
    handleNotesChange
  };
};

// Edit Session Form Logic Hook
export const useEditSessionForm = (sessionId) => {
  const navigate = useNavigate();

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
    description: "",
    tags: []
  });

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch existing session data
  useEffect(() => {
    const fetchSession = async () => {
      try {
        setLoading(true);
        const data = await sessionService.getSessionById(sessionId);
        setSessionData({
          title: data.title || "",
          month: data.month || "",
          day: data.day || "",
          year: data.year || "",
          startTime: data.startTime || "",
          endTime: data.endTime || "",
          location: data.location || "",
          locationType: data.locationType || "in-person",
          sessionType: data.sessionType || "",
          password: "", // Don't populate password for security
          maxParticipants: data.maxParticipants || "",
          description: data.description || "",
          tags: data.tags || []
        });
      } catch (error) {
        console.error("Error fetching session:", error);
        alert("Failed to load session data");
        navigate(`/session/${sessionId}`);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchSession();
    }
  }, [sessionId, navigate]);

  const handleChange = (e) => {
    setSessionData({ ...sessionData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setSessionData({ ...sessionData, password: e.target.value });
  };

  const handleParticipantsChange = (e) => {
    setSessionData({ ...sessionData, maxParticipants: e.target.value });
  };

  const handleTagsChange = (tags) => {
    setSessionData({ ...sessionData, tags });
  };

  const handleNotesChange = (noteIds) => {
    setSessionData({ ...sessionData, noteIds });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    const requiredFields = ['title', 'month', 'day', 'year', 'startTime', 'endTime', 'location', 'sessionType'];
    const missingFields = requiredFields.filter(field => !sessionData[field] || sessionData[field].trim() === '');
    
    if (missingFields.length > 0) {
      alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
      setIsSubmitting(false);
      return;
    }

    // Validate private session password if changed
    if (sessionData.sessionType === 'PRIVATE' && sessionData.password && sessionData.password.length < 6) {
      alert("Private session password must be at least 6 characters");
      setIsSubmitting(false);
      return;
    }

    try {
      await sessionService.updateSession(sessionId, sessionData);
      alert('Session updated successfully!');
      navigate(`/session/${sessionId}`);
    } catch (error) {
      console.error("Error updating session:", error);
      console.error("Session data being sent:", sessionData);
      alert("Error updating session: " + (error.message || error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(`/session/${sessionId}`);
  };

  return {
    sessionData,
    loading,
    isSubmitting,
    handleChange,
    handlePasswordChange,
    handleParticipantsChange,
    handleTagsChange,
    handleSubmit,
    handleBack
  };
};

// Sessions Page Logic Hook
export const useSessionsPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSessions = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return {
    sessions,
    loading,
    error,
    refetch: fetchSessions
  };
};