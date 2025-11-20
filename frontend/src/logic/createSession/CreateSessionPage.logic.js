import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtUtils } from '../../utils/jwtUtils';

export const useCreateSessionPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const [sessionData, setSessionData] = useState({
    title: "",
    month: "",
    day: "",
    year: "",
    startTime: "",
    endTime: "",
    location: "",
    description: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setSessionData({ ...sessionData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Check if JWT token exists
    if (!jwtUtils.hasToken()) {
      setError('User not authenticated. Please login again.');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await jwtUtils.fetchWithJWT(
        `http://localhost:8080/api/sessions/create`,
        {
          method: "POST",
          body: JSON.stringify(sessionData)
        }
      );

      if (!res.ok) throw new Error("Failed to create session");

      const createdSession = await res.json();
      console.log("Session created:", createdSession);
      alert("Session created successfully!");
      
      // Navigate back to profile page
      navigate('/profile');
    } catch (error) {
      console.error(error);
      setError(error.message || "Error creating session.");
      alert("Error creating session.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => navigate(-1);

  return {
    sessionData,
    isSubmitting,
    error,
    handleChange,
    handleSubmit,
    handleBack
  };
};
