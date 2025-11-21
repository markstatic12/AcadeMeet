import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

export const useCreateSessionPage = () => {
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
    description: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setSessionData({ ...sessionData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e)   => {
    e.preventDefault();
    setIsSubmitting(true);

    const userId = getUserId();
    if (!userId) {
      alert("User not logged in");
      setIsSubmitting(false);
      return;
    }

    try {
      const headers = { "Content-Type": "application/json" };
      if (userId) {
        headers['X-User-Id'] = userId.toString();
      }

      const res = await fetch(`http://localhost:8080/api/sessions`, {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify(sessionData)
      });

      if (!res.ok) throw new Error("Failed to create session");

      const createdSession = await res.json();
      console.log("Session created:", createdSession);
      alert("Session created successfully!");
      
      navigate('/profile');
    } catch (error) {
      console.error(error);
      alert("Error creating session.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => navigate(-1);

  return {
    sessionData,
    isSubmitting,
    handleChange,
    handleSubmit,
    handleBack
  };
};
