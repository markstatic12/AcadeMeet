import React from 'react';

const AuthLayout = ({ children, type = 'login' }) => {
  const welcomeTexts = {
    login: {
      title: "Welcome Back!",
      subtitle: "We're excited to see you again. Continue your learning journey with AcadeMeet."
    },
    signup: {
      title: "Join Our Community",
      subtitle: "Start your journey with thousands of students collaborating and learning together."
    }
  };

  const currentText = welcomeTexts[type] || welcomeTexts.login;

  return (
    <div className="min-h-screen h-screen flex bg-gradient-to-br from-[#0f0f1e] via-[#1a1a2e] to-[#16213e] overflow-hidden">
      {/* Left Panel - Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 relative overflow-hidden">
        {/* Background Gradient Orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
        
        <div className="w-full max-w-md relative z-10">
          {children}
        </div>
      </div>

      {/* Right Panel - Enhanced Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#2d1b69] via-[#1e1547] to-[#0f0f1e] items-center justify-center relative overflow-hidden">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Floating Orbs */}
        <div className="absolute top-20 right-20 w-20 h-20 bg-yellow-400 rounded-full opacity-60 blur-xl animate-pulse"></div>
        <div className="absolute top-32 right-40 w-16 h-16 bg-yellow-300 rounded-full opacity-50 blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-28 right-60 w-12 h-12 bg-yellow-200 rounded-full opacity-40 blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Main Illustration Container */}
        <div className="relative z-10 flex flex-col items-center animate-fadeIn" style={{ animationDuration: '1.2s' }}>
          {/* Floating Books Stack */}
          <div className="absolute -left-40 top-16 space-y-3 animate-slideUp" style={{ animationDelay: '0.3s' }}>
            <div className="w-28 h-4 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-md shadow-2xl transform -rotate-2"></div>
            <div className="w-28 h-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-md shadow-2xl transform rotate-1 ml-3"></div>
            <div className="w-28 h-4 bg-gradient-to-r from-indigo-400 to-indigo-500 rounded-md shadow-2xl transform -rotate-1"></div>
          </div>

          {/* Laptop/Monitor */}
          <div className="relative group">
            {/* Monitor Stand */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gradient-to-b from-gray-700 to-gray-800 rounded-b-xl"></div>
            
            {/* Monitor Base */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-40 h-3 bg-gradient-to-b from-gray-800 to-gray-900 rounded-full shadow-2xl"></div>
            
            {/* Screen Frame */}
            <div className="relative bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 rounded-2xl p-3 shadow-2xl transform group-hover:scale-105 transition-transform duration-500">
              {/* Screen Glow */}
              <div className="absolute inset-0 bg-indigo-500/20 rounded-2xl blur-xl"></div>
              
              {/* Screen Content */}
              <div className="relative w-80 h-56 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-lg overflow-hidden">
                {/* Browser Bar */}
                <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-2 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                  </div>
                  <div className="flex-1 bg-white rounded px-2 py-0.5 text-xs text-gray-400">academeet.com</div>
                </div>
                
                {/* Code Lines Animation */}
                <div className="p-4 space-y-2 font-mono text-xs">
                  <div className="flex gap-2">
                    <span className="text-purple-500">const</span>
                    <span className="text-blue-600">study</span>
                    <span className="text-gray-400">=</span>
                    <span className="text-green-600">'together'</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-purple-500">function</span>
                    <span className="text-yellow-600">learn</span>
                    <span className="text-gray-400">()</span>
                    <span className="text-gray-400">{'{'}</span>
                  </div>
                  <div className="pl-4 text-green-600">return 'success'</div>
                  <div className="text-gray-400">{'}'}</div>
                </div>

                {/* Cursor Blink */}
                <div className="absolute bottom-20 left-20 w-0.5 h-4 bg-indigo-600 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Plant Decoration */}
          <div className="absolute -right-32 bottom-8 animate-slideUp" style={{ animationDelay: '0.6s' }}>
            <div className="w-20 h-28 relative">
              {/* Pot */}
              <div className="absolute bottom-0 w-20 h-12 bg-gradient-to-b from-purple-600 to-purple-800 rounded-t-full"></div>
              {/* Leaves */}
              <div className="absolute bottom-10 left-6 w-8 h-12 bg-green-500 rounded-full transform -rotate-45"></div>
              <div className="absolute bottom-12 left-8 w-8 h-12 bg-green-400 rounded-full transform rotate-45"></div>
              <div className="absolute bottom-14 left-6 w-6 h-10 bg-green-600 rounded-full"></div>
            </div>
          </div>

          {/* Floating Notes/Papers */}
          <div className="absolute -right-48 top-24 space-y-2 animate-slideDown" style={{ animationDelay: '0.4s' }}>
            <div className="w-16 h-20 bg-gradient-to-br from-white to-gray-100 rounded-lg shadow-xl transform rotate-12 p-2">
              <div className="space-y-1">
                <div className="h-1 bg-indigo-300 rounded w-full"></div>
                <div className="h-1 bg-indigo-200 rounded w-3/4"></div>
                <div className="h-1 bg-indigo-200 rounded w-full"></div>
              </div>
            </div>
          </div>

          {/* Welcome Text Below Monitor */}
          <div className="mt-24 text-center max-w-md px-8 animate-slideUp" style={{ animationDelay: '0.7s' }}>
            <h3 className="text-2xl font-bold text-white mb-3 bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
              {currentText.title}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {currentText.subtitle}
            </p>
          </div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-indigo-400 rounded-full opacity-60 animate-ping" style={{ animationDuration: '3s', animationDelay: '0s' }}></div>
          <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-purple-400 rounded-full opacity-60 animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-pink-400 rounded-full opacity-60 animate-ping" style={{ animationDuration: '5s', animationDelay: '2s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;