import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/apiClient';
import { authService } from '../services/authService';
import logger from '../utils/logger';

const UserContext = createContext(null);

const fetchUserData = async () => {
  try {
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
  const location = useLocation();

  useEffect(() => {
    const initializeUser = async () => {
      const publicPaths = ['/login', '/signup', '/'];
      if (publicPaths.includes(location.pathname)) {
        setCurrentUser(null);
        setLoading(false);
        return;
      }

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
        setCurrentUser(null);
      }
      setLoading(false);
    };

    initializeUser();
  }, [location.pathname]);

  const login = async (userData) => {
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

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      logger.error('Logout error:', error);
    }
    setCurrentUser(null);
  };

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
