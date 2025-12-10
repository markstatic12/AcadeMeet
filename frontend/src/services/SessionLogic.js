import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { sessionService } from './SessionService';
import logger from '../utils/logger';


const to24Hour = (timeStr) => {
  if (!timeStr || typeof timeStr !== 'string') return "";
  const s = timeStr.trim();
  const m = s.match(/^(\d{1,2}):(\d{2})\s*([AaPp][Mm])?$/);
  if (!m) return s; 
  let hour = parseInt(m[1], 10);
  const minute = parseInt(m[2], 10);
  const meridiem = m[3];
  if (meridiem) {
    const up = meridiem.toUpperCase();
    if (up === 'PM' && hour < 12) hour += 12;
    if (up === 'AM' && hour === 12) hour = 0;
  }
  const pad = (n) => (n < 10 ? `0${n}` : `${n}`);
  return `${pad(hour)}:${pad(minute)}`;
};

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
    sessionPrivacy: "",
    password: "",
    maxParticipants: "",
    description: "",
    tags: [],
    noteIds: [],
    uploadedNoteFilepaths: [] 
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    setSessionData({ ...sessionData, [e.target.name]: e.target.value });
    
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

  const addUploadedNoteFilepath = (filepath) => {
    setSessionData(prev => ({ 
      ...prev, 
      uploadedNoteFilepaths: [...prev.uploadedNoteFilepaths, filepath] 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      logger.debug('Submitting session form with data:', sessionData);
    } catch (logErr) {
      console.debug('Submitting session form with data:', sessionData, logErr);
    }

    const errors = {};
    const requiredFields = [
      { name: 'title', label: 'Session Title' },
      { name: 'month', label: 'Month' },
      { name: 'day', label: 'Day' },
      { name: 'year', label: 'Year' },
      { name: 'startTime', label: 'Start Time' },
      { name: 'endTime', label: 'End Time' },
      { name: 'location', label: 'Location' },
      { name: 'sessionPrivacy', label: 'Session Type' }
    ];

    requiredFields.forEach(field => {
      if (!sessionData[field.name] || sessionData[field.name].toString().trim() === '') {
        errors[field.name] = `${field.label} is required`;
      }
    });

    if (sessionData.title && sessionData.title.length < 3) {
      errors.title = 'Title must be at least 3 characters';
    }
    if (sessionData.title && sessionData.title.length > 100) {
      errors.title = 'Title must not exceed 100 characters';
    }

    if (sessionData.month && sessionData.day && sessionData.year && sessionData.startTime) {
      const monthIndex = ['January', 'February', 'March', 'April', 'May', 'June', 
                          'July', 'August', 'September', 'October', 'November', 'December']
                          .indexOf(sessionData.month);
      
      if (monthIndex !== -1) {
        const sessionDateTime = new Date(
          parseInt(sessionData.year),
          monthIndex,
          parseInt(sessionData.day),
          parseInt(sessionData.startTime.split(':')[0]),
          parseInt(sessionData.startTime.split(':')[1])
        );
        
        const now = new Date();
        if (sessionDateTime < now) {
          errors.startTime = 'Session date and time must be in the future';
        }
      }
    }

    if (sessionData.startTime && sessionData.endTime) {
      const [startHour, startMin] = sessionData.startTime.split(':').map(Number);
      const [endHour, endMin] = sessionData.endTime.split(':').map(Number);
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;

      if (endMinutes <= startMinutes) {
        errors.endTime = 'End time must be after start time';
      }

      if (endMinutes - startMinutes < 15) {
        errors.endTime = 'Session must be at least 15 minutes long';
      }
    }

    if (sessionData.location && sessionData.location.length < 3) {
      errors.location = 'Location must be at least 3 characters';
    }

    if (sessionData.maxParticipants) {
      const maxP = parseInt(sessionData.maxParticipants);
      if (isNaN(maxP) || maxP < 1) {
        errors.maxParticipants = 'Must be at least 1 participant';
      }
      if (maxP > 1000) {
        errors.maxParticipants = 'Cannot exceed 1000 participants';
      }
    }

    if (sessionData.sessionPrivacy === 'PRIVATE' && (!sessionData.password || sessionData.password.length < 6)) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (sessionData.description && sessionData.description.length > 5000) {
      errors.description = 'Description must not exceed 5000 characters';
    }

    if (Object.keys(errors).length > 0) {
      try {
        logger.debug('Session form validation errors:', errors);
      } catch (logErr) {
        console.debug('Session form validation errors:', errors, logErr);
      }
      setFieldErrors(errors);
      if (showToast) {
        showToast('error', 'Please ensure you provide valid inputs');
      }
      setIsSubmitting(false);
      return;
    }

    try {
      try {
        logger.debug('Calling sessionService.createSession with payload:', sessionData);
      } catch (logErr) {
        console.debug('Calling sessionService.createSession with payload:', sessionData, logErr);
      }

      const createdSession = await sessionService.createSession(sessionData);
      
      if (sessionData.uploadedNoteFilepaths && sessionData.uploadedNoteFilepaths.length > 0) {
        const { noteService } = await import('./noteService');
        for (const filepath of sessionData.uploadedNoteFilepaths) {
          try {
            await noteService.linkNoteToSession(filepath, createdSession.id);
          } catch (linkError) {
            console.error('Failed to link note:', filepath, linkError);
            
          }
        }
      }
      
      if (showToast) {
        showToast('success', 'Session created successfully!');
      }
      setTimeout(() => {
        navigate('/profile', { state: { sessionCreated: true, title: sessionData.title } });
      }, 1500);
    } catch (error) {
      try {
        logger.error('Error creating session:', error);
      } catch (logErr) {
        console.error('Error creating session:', error, logErr);
      }

      if (error?.response) {
        console.debug('Create session response data:', error.response.data, 'status:', error.response.status);
      }

      if (showToast) {
        showToast('error', `Error creating session: ${error.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/profile');
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
    handleNotesChange,
    addUploadedNoteFilepath
  };
};

export const useEditSessionForm = (sessionId, showToast) => {
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
     sessionPrivacy: "",
    password: "",
    maxParticipants: "",
    description: "",
    tags: [],
    uploadedNoteFilepaths: [] 
  });

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [originalNotes, setOriginalNotes] = useState([]); 
  const [originalSessionPrivacy, setOriginalSessionPrivacy] = useState('');

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setLoading(true);
        const data = await sessionService.getSessionById(sessionId);
        
        let linkedNotes = [];
        try {
          const { noteService } = await import('./noteService');
          linkedNotes = await noteService.getLinkedNotes(sessionId);
        } catch (noteError) {
          console.warn('Could not fetch linked notes:', noteError);
        }

        setOriginalNotes(linkedNotes);

        const noteFilepaths = linkedNotes
          .map(note => note.filepath)
          .filter(fp => fp && typeof fp === 'string');

        const privacy = data.sessionPrivacy || data.sessionType || "";
        setOriginalSessionPrivacy(privacy);
        
        setSessionData({
          title: data.title || "",
          month: data.month || "",
          day: data.day || "",
          year: data.year || "",
          startTime: to24Hour(data.startTime) || "",
          endTime: to24Hour(data.endTime) || "",
          location: data.location || "",
          locationType: data.locationType || "in-person",
           sessionPrivacy: privacy,
          password: "", 
          maxParticipants: data.maxParticipants || "",
          description: data.description || "",
          tags: data.tags || [],
          uploadedNoteFilepaths: noteFilepaths
        });
      } catch (error) {
        console.error("Error fetching session:", error);
        if (showToast) {
          showToast('error', 'Failed to load session data');
        }
        navigate(`/session/${sessionId}`);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchSession();
    }
  }, [sessionId, navigate, showToast]);

  const handleChange = (e) => {
    setSessionData({ ...sessionData, [e.target.name]: e.target.value });
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

  const addUploadedNoteFilepath = (filepath) => {
    setSessionData(prev => ({ 
      ...prev, 
      uploadedNoteFilepaths: [...(prev.uploadedNoteFilepaths || []), filepath] 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const errors = {};
    const requiredFields = [
      { name: 'title', label: 'Session Title' },
      { name: 'month', label: 'Month' },
      { name: 'day', label: 'Day' },
      { name: 'year', label: 'Year' },
      { name: 'startTime', label: 'Start Time' },
      { name: 'endTime', label: 'End Time' },
      { name: 'location', label: 'Location' },
      { name: 'sessionPrivacy', label: 'Session Type' }
    ];

    requiredFields.forEach(field => {
      if (!sessionData[field.name] || sessionData[field.name].toString().trim() === '') {
        errors[field.name] = `${field.label} is required`;
      }
    });

    if (sessionData.title && sessionData.title.length < 3) {
      errors.title = 'Title must be at least 3 characters';
    }
    if (sessionData.title && sessionData.title.length > 100) {
      errors.title = 'Title must not exceed 100 characters';
    }

    if (sessionData.month && sessionData.day && sessionData.year && sessionData.startTime) {
      const monthIndex = ['January', 'February', 'March', 'April', 'May', 'June', 
                          'July', 'August', 'September', 'October', 'November', 'December']
                          .indexOf(sessionData.month);
      
      if (monthIndex !== -1) {
        const sessionDateTime = new Date(
          parseInt(sessionData.year),
          monthIndex,
          parseInt(sessionData.day),
          parseInt(sessionData.startTime.split(':')[0]),
          parseInt(sessionData.startTime.split(':')[1])
        );
        
        const now = new Date();
        if (sessionDateTime < now) {
          errors.startTime = 'Session date and time must be in the future';
        }
      }
    }

    if (sessionData.startTime && sessionData.endTime) {
      const [startHour, startMin] = sessionData.startTime.split(':').map(Number);
      const [endHour, endMin] = sessionData.endTime.split(':').map(Number);
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;

      if (endMinutes <= startMinutes) {
        errors.endTime = 'End time must be after start time';
      }

      if (endMinutes - startMinutes < 15) {
        errors.endTime = 'Session must be at least 15 minutes long';
      }
    }

    if (sessionData.location && sessionData.location.length < 3) {
      errors.location = 'Location must be at least 3 characters';
    }

    if (sessionData.maxParticipants) {
      const maxP = parseInt(sessionData.maxParticipants);
      if (isNaN(maxP) || maxP < 1) {
        errors.maxParticipants = 'Must be at least 1 participant';
      }
      if (maxP > 1000) {
        errors.maxParticipants = 'Cannot exceed 1000 participants';
      }
    }

    const isChangingToPrivate = originalSessionPrivacy !== 'PRIVATE' && sessionData.sessionPrivacy === 'PRIVATE';
    const isStayingPrivate = originalSessionPrivacy === 'PRIVATE' && sessionData.sessionPrivacy === 'PRIVATE';
    
    if (isChangingToPrivate && (!sessionData.password || sessionData.password.trim() === '')) {
      errors.password = 'Password is required when changing to private';
    } else if (sessionData.password && sessionData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (sessionData.description && sessionData.description.length > 5000) {
      errors.description = 'Description must not exceed 5000 characters';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      if (showToast) {
        showToast('error', 'Please fix the validation errors');
      }
      setIsSubmitting(false);
      return;
    }

    try {
      await sessionService.updateSession(sessionId, sessionData);
      
      const { noteService } = await import('./noteService');
      
      const originalFilepaths = originalNotes.map(note => note.filepath).filter(Boolean);
      const currentFilepaths = sessionData.uploadedNoteFilepaths || [];
      const newFilepaths = currentFilepaths.filter(fp => !originalFilepaths.includes(fp));
      
      const deletedNotes = originalNotes.filter(note => !currentFilepaths.includes(note.filepath));
      
      for (const note of deletedNotes) {
        try {
          await noteService.deleteNote(note.id);
          console.log('Deleted note:', note.id);
        } catch (deleteError) {
          console.error('Failed to delete note:', note.id, deleteError);
        }
      }
      
      for (const filepath of newFilepaths) {
        try {
          await noteService.linkNoteToSession(filepath, sessionId);
          console.log('Linked new note:', filepath);
        } catch (linkError) {
          console.error('Failed to link note:', filepath, linkError);
        }
      }
      
      if (showToast) {
        showToast('success', 'Session updated successfully!');
      }
      setTimeout(() => {
        navigate(`/session/${sessionId}`);
      }, 1500);
    } catch (error) {
      console.error("Error updating session:", error);
      if (showToast) {
        showToast('error', `Error updating session: ${error.message}`);
      }
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
    fieldErrors,
    handleChange,
    handlePasswordChange,
    handleParticipantsChange,
    handleTagsChange,
    handleSubmit,
    handleBack,
    addUploadedNoteFilepath
  };
};

export const useSessionsPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await sessionService.getAllSessions();
      
      const statusPriority = {
        'ACTIVE': 1,
        'SCHEDULED': 2,
        'COMPLETED': 3
      };
      
      const sortedData = [...data].sort((a, b) => {
        const priorityDiff = (statusPriority[a.status] || 999) - (statusPriority[b.status] || 999);
        if (priorityDiff !== 0) return priorityDiff;
        
        const dateA = new Date(`${a.year}-${a.month}-${a.day} ${a.startTime}`);
        const dateB = new Date(`${b.year}-${b.month}-${b.day} ${b.startTime}`);
        return dateA - dateB;
      });
      
      setSessions(sortedData);
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
