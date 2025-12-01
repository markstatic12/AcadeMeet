import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { sessionService } from './SessionService';
import { noteService } from './noteService';

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
  const [pendingNote, setPendingNote] = useState(null);

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

    // Validate required fields
    const requiredFields = ['title', 'month', 'day', 'year', 'startTime', 'endTime', 'location', 'sessionType'];
    const missingFields = requiredFields.filter(field => !sessionData[field] || sessionData[field].trim() === '');
    
    if (missingFields.length > 0) {
      alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
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
      
      // If there's a pending note, upload and associate it with the new session
      if (pendingNote) {
        try {
          // Get the created session ID - we need to fetch it first
          const sessions = await sessionService.getAllSessions(userId);
          const newSession = sessions.find(s => s.title === sessionData.title);
          
          if (newSession) {
            await noteService.uploadFileNote(
              pendingNote,
              { title: pendingNote.name, sessionIds: [newSession.id] },
              userId
            );
          }
        } catch (noteError) {
          console.error("Error uploading note with session:", noteError);
          // Don't fail the session creation if note upload fails
        }
        setPendingNote(null);
      }
      
      // Instead of a blocking alert, navigate to dashboard and pass a success flag
      // so the dashboard or sessions page can render a non-blocking success modal.
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
    handleBack,
    pendingNote,
    setPendingNote
  };
};

// Sessions Page Logic Hook
export const useSessionsPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getUserId } = useUser();

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