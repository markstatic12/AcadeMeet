import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import AuthLayout from '../components/AuthLayout';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    console.log('Signing up with:', { name, email, password });
    // Add signup logic here
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-sm mx-auto"> {/* Added max-w-sm and mx-auto */}
        {/* Logo and Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-indigo-400">Am AcadeMeet</h1>
          <h2 className="text-2xl font-semibold mt-2">Create an Account</h2>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            id="confirm-password"
            name="confirm-password"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button type="submit">Sign up</Button>
        </form>
        
        {/* Divider and Social Login */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#2A2A4E] text-gray-400">Or continue using</span>
            </div>
          </div>
          <div className="mt-4 flex justify-center space-x-3">
             {/* Placeholder for social icons */}
            <div className="flex space-x-4">
                <img src="/src/assets/google-icon.png" alt="Google" className="h-8 w-8 cursor-pointer" /> {/* Example, replace with actual icons */}
                <img src="/src/assets/facebook-icon.png" alt="Facebook" className="h-8 w-8 cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Link to Log In */}
        <p className="mt-8 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default SignupPage;