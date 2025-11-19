import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

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

  // Redirect to dashboard if already logged in
  useEffect(() => {
    const student = localStorage.getItem('student');
    if (student) {
      navigate('/dashboard');
    }
  }, [navigate]);

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
      
      // Store student data in localStorage
      localStorage.setItem('student', JSON.stringify({
        studentId: response.studentId,
        name: response.name,
        email: response.email,
        program: program,
        yearLevel: yearLevel
      }));
      
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
