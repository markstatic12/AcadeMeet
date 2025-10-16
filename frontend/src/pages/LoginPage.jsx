import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import AuthLayout from '../components/AuthLayout';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Logging in with:', { email, password });
    // Add login logic here
  };

  return (
    <AuthLayout>
      {/* The content here now takes up the full width of the left panel provided by AuthLayout */}
      <div className="w-full max-w-sm mx-auto"> {/* Added max-w-sm and mx-auto for better centering and width control within the flex item */}
        {/* Logo and Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-indigo-400">Am</h1>
          <h2 className="text-2xl font-semibold mt-2">Welcome to AcadeMeet</h2>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex justify-end">
            <a href="#" className="text-sm text-indigo-400 hover:underline">
              Forgot your password?
            </a>
          </div>
          <Button type="submit">Log in</Button>
        </form>

        {/* Divider and Social Login */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#2A2A4E] text-gray-400">Or log in using</span>
            </div>
          </div>
          <div className="mt-4 flex justify-center space-x-3">
            {/* Add your social login buttons here */}
            {/* Placeholder for social icons */}
            <div className="flex space-x-4">
                <img src="/src/assets/google-icon.png" alt="Google" className="h-8 w-8 cursor-pointer" /> {/* Example, replace with actual icons */}
                <img src="/src/assets/facebook-icon.png" alt="Facebook" className="h-8 w-8 cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Link to Sign Up */}
        <p className="mt-8 text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-indigo-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;