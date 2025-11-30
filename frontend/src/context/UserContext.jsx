import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize user from localStorage on mount
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      // Store minimal user data - just the ID
      // Full user data will be fetched by components as needed
      setCurrentUser({ id: parseInt(storedUserId) });
    }
    setLoading(false);
  }, []);

  // Store user ID and tokens after login/signup
  const login = (userData) => {
    const userId = userData.id || userData.userId || userData.studentId;
    const token = userData.token;
    const refreshToken = userData.refreshToken;
    
    if (!userId) {
      throw new Error('No user ID found in response');
    }
    
    // Store user ID and tokens
    setCurrentUser({ id: userId });
    localStorage.setItem('userId', userId.toString());
    if (token) {
      localStorage.setItem('token', token);
    }
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  };

  // Clear user data on logout
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  };

  // Get current user ID (consistent accessor)
  const getUserId = () => {
    return currentUser?.id || null;
  };

  // Get auth token
  const getToken = () => {
    return localStorage.getItem('token');
  };

  // Update user ID (used after profile updates that might change the ID)
  const updateUser = (userId) => {
    if (userId) {
      setCurrentUser({ id: userId });
      localStorage.setItem('userId', userId.toString());
    }
  };

  const value = {
    currentUser,
    loading,
    login,
    logout,
    getUserId,
    getToken,
    updateUser,
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
