import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize user from token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Token exists, user is authenticated
      // User ID will be extracted from JWT by backend
      setCurrentUser({ authenticated: true });
    }
    setLoading(false);
  }, []);

  // Store tokens after login/signup (NO userId stored for security)
  const login = (userData) => {
    const token = userData.token;
    const refreshToken = userData.refreshToken;
    
    if (!token) {
      throw new Error('No token found in response');
    }
    
    // Store ONLY tokens - user ID will be extracted from JWT by backend
    setCurrentUser({ authenticated: true });
    localStorage.setItem('token', token);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  };

  // Clear tokens on logout
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  };

  // Get auth token
  const getToken = () => {
    return localStorage.getItem('token');
  };

  const value = {
    currentUser,
    loading,
    login,
    logout,
    getToken,
    isAuthenticated: !!currentUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
