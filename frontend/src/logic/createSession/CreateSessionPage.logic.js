import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useCreateSessionPage = () => {
  const navigate = useNavigate();

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

    const userId = 1; // Replace with actual user ID as needed
    try {
      const res = await fetch(`http://localhost:8080/api/sessions/create?userId=${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sessionData)
      });

      if (!res.ok) throw new Error("Failed to create session");

      const createdSession = await res.json();
      console.log("Session created:", createdSession);
      alert("Session created successfully!");
      
      // Optionally navigate to sessions page or dashboard
      // navigate('/sessions');
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
