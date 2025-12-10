import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/apiClient';
import { authService } from '../services/authService';
import logger from '../utils/logger';

const UserContext = createContext(null);

// Helper function to fetch user data from backend
const fetchUserData = async () => {
  try {
    // Use axios apiClient (sends cookies automatically with withCredentials: true)
    const response = await api.get('/users/me');
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      logger.debug('User not authenticated (401)');
    } else {
      logger.debug('Error fetching user data:', error.message);
    }
    return null;
  }
};

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize user from cookie on mount (if cookie exists, server will authenticate)
  useEffect(() => {
    const initializeUser = async () => {
      // Try to fetch user data - if cookie exists and is valid, this will succeed
      // If no cookie or invalid, this will fail silently (we're on a public page)
      const userData = await fetchUserData();
      if (userData) {
        setCurrentUser({
          authenticated: true,
          id: userData.id,
          name: userData.name,
          email: userData.email,
          profilePic: userData.profilePic || userData.profileImageUrl,
          program: userData.program,
          yearLevel: userData.yearLevel,
          bio: userData.bio,
        });
      } else {
        // No valid session - user is not logged in (normal for signup/login pages)
        setCurrentUser(null);
      }
      setLoading(false);
    };

    initializeUser();
  }, []);

  // Store user data after login/signup (cookie is set by server automatically)
  const login = async (userData) => {
    // Server has already set HttpOnly cookie - just fetch and store user data
    const fullUserData = await fetchUserData();
    if (fullUserData) {
      setCurrentUser({
        authenticated: true,
        id: fullUserData.id,
        name: fullUserData.name,
        email: fullUserData.email,
        profilePic: fullUserData.profilePic || fullUserData.profileImageUrl,
        program: fullUserData.program,
        yearLevel: fullUserData.yearLevel,
        bio: fullUserData.bio,
      });
    } else {
      // Fallback: use data from login response if /users/me fails
      setCurrentUser({
        authenticated: true,
        id: userData.id,
        name: userData.name,
        email: userData.email,
        profilePic: userData.profilePic,
        program: userData.program,
        yearLevel: userData.yearLevel,
        bio: userData.bio,
      });
    }
  };

  // Clear user state and call backend logout to clear cookies
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      logger.error('Logout error:', error);
    }
    setCurrentUser(null);
  };

  // Get auth token - not needed anymore (cookies are httpOnly)
  // Kept for backward compatibility but returns null
  const getToken = () => {
    logger.warn('getToken() called but tokens are now in HttpOnly cookies');
    return null;
  };

  // Refresh user data (for profile updates)
  const refreshUser = async () => {
    const userData = await fetchUserData();
    if (userData) {
      setCurrentUser({
        authenticated: true,
        id: userData.id,
        name: userData.name,
        email: userData.email,
        profilePic: userData.profilePic || userData.profileImageUrl,
        program: userData.program,
        yearLevel: userData.yearLevel,
        bio: userData.bio,
      });
    }
    return userData;
  };

  const value = {
    currentUser,
    loading,
    login,
    logout,
    getToken,
    refreshUser,
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
