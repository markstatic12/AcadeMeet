import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { authService } from '../services/authService';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [program, setProgram] = useState('');
  const [yearLevel, setYearLevel] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError("Passwords don't match!");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (!program) {
      setError("Please select your program");
      return;
    }

    if (!yearLevel) {
      setError("Please select your year level");
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await authService.signup(name, email, password, program, yearLevel);
      console.log('Signup successful:', response);
      
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify({
        userId: response.userId,
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

  return (
    <AuthLayout type="signup">
      <div className="w-full max-w-md mx-auto animate-fadeIn">
        {/* Logo and Branding */}
        <div className="mb-4 animate-slideDown">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/50 transform hover:rotate-12 transition-transform duration-300">
                <span className="text-lg font-bold text-white">Am</span>
              </div>
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-[#1a1a2e] animate-pulse"></div>
            </div>
            <div>
              <span className="text-lg font-bold text-white tracking-tight">Acade<span className="text-indigo-400">Meet</span></span>
              <p className="text-xs text-gray-500">Study Together, Learn Forever</p>
            </div>
          </div>
          
          <div>
            <h1 className="text-3xl font-bold text-white mb-1.5 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              Join Us Today
            </h1>
            <p className="text-gray-400 text-xs">
              Create your account and start collaborating
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/50 text-red-400 px-3 py-2.5 rounded-xl mb-3 text-xs animate-shake flex items-start gap-2">
            <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-500/10 backdrop-blur-sm border border-green-500/50 text-green-400 px-3 py-2.5 rounded-xl mb-3 text-xs animate-slideDown flex items-start gap-2">
            <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{success}</span>
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-2.5 animate-slideUp">
          <div className="space-y-1">
            <label htmlFor="name" className="block text-xs font-semibold text-gray-300">
              Full Name
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 text-sm bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all hover:bg-white/10"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="email" className="block text-xs font-semibold text-gray-300">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                className="w-full pl-10 pr-3 py-2.5 text-sm bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all hover:bg-white/10"
                required
              />
            </div>
          </div>

          {/* Program and Year Level - Side by Side */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label htmlFor="program" className="block text-xs font-semibold text-gray-300">
                Program
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <select
                  id="program"
                  name="program"
                  value={program}
                  onChange={(e) => setProgram(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-sm bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all hover:bg-white/10 appearance-none cursor-pointer"
                  required
                >
                  <option value="" className="bg-gray-800">Select</option>
                  <option value="BSCS" className="bg-gray-800">BSCS</option>
                  <option value="BSIT" className="bg-gray-800">BSIT</option>
                  <option value="BSCE" className="bg-gray-800">BSCE</option>
                  <option value="BSCPE" className="bg-gray-800">BSCpE</option>
                  <option value="BSEE" className="bg-gray-800">BSEE</option>
                  <option value="BSME" className="bg-gray-800">BSME</option>
                  <option value="BSA" className="bg-gray-800">BSA</option>
                  <option value="BSBA" className="bg-gray-800">BSBA</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="yearLevel" className="block text-xs font-semibold text-gray-300">
                Year Level
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <select
                  id="yearLevel"
                  name="yearLevel"
                  value={yearLevel}
                  onChange={(e) => setYearLevel(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-sm bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all hover:bg-white/10 appearance-none cursor-pointer"
                  required
                >
                  <option value="" className="bg-gray-800">Select</option>
                  <option value="1" className="bg-gray-800">1st Year</option>
                  <option value="2" className="bg-gray-800">2nd Year</option>
                  <option value="3" className="bg-gray-800">3rd Year</option>
                  <option value="4" className="bg-gray-800">4th Year</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="block text-xs font-semibold text-gray-300">
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 text-sm bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all hover:bg-white/10"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="confirm-password" className="block text-xs font-semibold text-gray-300">
              Confirm Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 text-sm bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all hover:bg-white/10"
                required
              />
            </div>
          </div>

          <div className="flex items-start gap-2 text-xs pt-0.5">
            <input 
              type="checkbox" 
              id="terms"
              className="w-3.5 h-3.5 mt-0.5 rounded border-gray-600 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-0 bg-white/5" 
              required
            />
            <label htmlFor="terms" className="text-gray-400 leading-relaxed">
              I agree to the{' '}
              <a href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
                Terms of Service
              </a>
              {' '}and{' '}
              <a href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
                Privacy Policy
              </a>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full py-3 text-sm bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold rounded-xl hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#1a1a2e] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-indigo-500/30 hover-scale transform overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <span className="relative">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Creating your account...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>Create Account</span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              )}
            </span>
          </button>
        </form>

        {/* Divider */}
        <div className="my-4 flex items-center gap-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
          <span className="text-xs text-gray-500 font-medium">OR</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
        </div>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-gray-400 text-xs mb-2">
            Already have an account?
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors font-semibold group"
          >
            <span>Sign in to your account</span>
            <svg className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignupPage;