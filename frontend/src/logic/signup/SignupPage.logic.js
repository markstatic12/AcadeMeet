import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useUser } from '../../context/UserContext';

export const useSignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [program, setProgram] = useState('');
  const [yearLevel, setYearLevel] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login: loginUser, isAuthenticated } = useUser();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    if (password !== confirmPassword) {
      setError("Passwords don't match!");
      return false;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    if (!program) {
      setError("Please select your program");
      return false;
    }

    if (!yearLevel) {
      setError("Please select your year level");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await authService.signup(name, email, password, program, yearLevel);
      console.log('Signup successful:', response);
      
      // Store user data via centralized context
      loginUser({
        ...response,
        program: program,
        yearLevel: yearLevel
      });
      
      // Show success message
      setSuccess('Account created successfully! Redirecting to dashboard...');
      
      // Navigate to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      setError(error.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return {
    // State
    name,
    email,
    password,
    confirmPassword,
    showPassword,
    showConfirmPassword,
    program,
    yearLevel,
    error,
    success,
    loading,
    // Setters
    setName,
    setEmail,
    setPassword,
    setConfirmPassword,
    setProgram,
    setYearLevel,
    // Handlers
    handleSubmit,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
  };
};
