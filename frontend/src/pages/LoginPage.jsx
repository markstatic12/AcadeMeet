import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { authService } from '../services/authService';
import logo from '../assets/academeet-white.svg';

const LoginPage = () => {
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

  return (
    <AuthLayout type="login">
      <div className="w-full max-w-md mx-auto animate-fadeIn">
        {/* Logo and Branding */}
          <div className="mb-8 animate-slideDown">
          <div className="flex items-center gap-3 mb-6">
              <div className="relative group">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/40 transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
                  <img src={logo} alt="AcadeMeet Logo" className="w-8 h-8 object-contain transition-transform duration-300 group-hover:scale-105" />
                </div>
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20 group-hover:ring-white/30 transition-all duration-300"></div>
              </div>
            <div>
              <span className="text-xl font-bold text-white tracking-tight">Acade<span className="text-indigo-400">Meet</span></span>
              <p className="text-xs text-gray-500">Study Together, Learn Forever</p>
            </div>
          </div>
          
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-gray-400 text-sm">
              Sign in to continue your learning journey
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/50 text-red-400 px-4 py-3 rounded-2xl mb-5 text-sm animate-shake flex items-start gap-3">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 animate-slideUp">
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-300">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all hover:bg-white/10"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-300">
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3 bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all hover:bg-white/10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-indigo-400 transition-colors focus:outline-none"
                tabIndex="-1"
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm pt-1">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-600 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-0 bg-white/5" />
              <span className="text-gray-400 group-hover:text-gray-300 transition-colors">Remember me</span>
            </label>
            <a href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full py-3.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold rounded-2xl hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#1a1a2e] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-indigo-500/30 hover-scale transform overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <span className="relative">
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Logging in...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>Log in</span>
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              )}
            </span>
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
          <span className="text-xs text-gray-500 font-medium">OR</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
        </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-3">
            Don't have an account yet?
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors font-semibold group"
          >
            <span>Create a free account</span>
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;