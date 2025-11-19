import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

export const useLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    const student = localStorage.getItem('student');
    if (student) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await authService.login(email, password);
      console.log('Login successful:', response);
      
      // Store student data in localStorage
      localStorage.setItem('student', JSON.stringify({
        studentId: response.studentId,
        name: response.name,
        email: response.email
      }));
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return {
    email,
    password,
    showPassword,
    error,
    loading,
    setEmail,
    setPassword,
    togglePasswordVisibility,
    handleSubmit
  };
};
