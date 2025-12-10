import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext(null);

// Helper function to fetch user data from backend
const fetchUserData = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const response = await fetch('http://localhost:8080/api/users/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        return null;
      }
      throw new Error('Failed to fetch user data');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize user from token on mount and fetch full user data
  useEffect(() => {
    const initializeUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        // Fetch complete user data from backend
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
      }
      setLoading(false);
    };

    initializeUser();
  }, []);

  // Store tokens after login/signup and fetch user data
  const login = async (userData) => {
    const token = userData.token;
    const refreshToken = userData.refreshToken;
    
    if (!token) {
      throw new Error('No token found in response');
    }
    
    // Store tokens
    localStorage.setItem('token', token);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }

    // Fetch and store complete user data
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
