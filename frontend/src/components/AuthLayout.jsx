import React from 'react';
import deskIllustration from '../assets/desk-background.jpg'; // Make sure this path is correct

const AuthLayout = ({ children }) => {
  return (
    // Outer container: Full screen, dark background
    <div className="min-h-screen flex items-center justify-center bg-[#21213E] text-white p-4">
      {/* Main content box: Has the dark left panel and the illustration right panel */}
      <div className="flex w-full max-w-7xl h-[600px] bg-[#2A2A4E] rounded-xl shadow-lg overflow-hidden">
        {/* Left Side: Form Container */}
        <div className="w-[40%] flex items-center justify-center p-8"> {/* Adjusted width and centered content */}
          {children} {/* This is where LoginPage or SignupPage content will go */}
        </div>

        {/* Right Side: Illustration */}
        {/* We'll use a fixed width for the left, and let the right fill the rest */}
        <div 
          className="flex-grow bg-cover bg-center" 
          style={{ backgroundImage: `url(${deskIllustration})` }}
        >
          {/* This div just holds the background image */}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;