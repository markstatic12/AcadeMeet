import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import api from './apiClient';
import { sessionService } from './SessionService';



export const useProfilePage = () => {
  const navigate = useNavigate();
  const { currentUser, refreshUser } = useUser(); // Get user and refresh function from context
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFollowersManager, setShowFollowersManager] = useState(false);
  const [followTab, setFollowTab] = useState('followers');
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [showProfileOptionsMenu, setShowProfileOptionsMenu] = useState(false);
  const [showTabOptionsMenu, setShowTabOptionsMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [sessionsView, setSessionsView] = useState('active');
  const [openCardMenuId, setOpenCardMenuId] = useState(null);
  const [completedSessions, setCompletedSessions] = useState([]); //NOT YET IMPLEMENTED

  // User data from centralized context - initialize from currentUser
  const [userData, setUserData] = useState({
    id: currentUser?.id || null,
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    school: 'CIT University',
    program: currentUser?.program || '',
    yearLevel: currentUser?.yearLevel || null,
    studentId: '',
    bio: currentUser?.bio || 'No bio yet',
    coverImage: null,
    profilePic: currentUser?.profilePic || null,
    profileImageUrl: currentUser?.profilePic || null,
    followers: 0,
    following: 0,
    isOnline: true
  });

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: currentUser?.name || '',
    school: '',
    studentId: '',
    bio: currentUser?.bio || ''
  });

  // Sync userData with currentUser from context when it changes
  useEffect(() => {
    if (currentUser) {
      setUserData({
        id: currentUser.id,
        name: currentUser.name || 'User',
        email: currentUser.email || '',
        school: 'CIT University',
        program: currentUser.program || '',
        yearLevel: currentUser.yearLevel || null,
        studentId: '',
        bio: currentUser.bio || 'No bio yet',
        coverImage: null,
        profilePic: currentUser.profilePic || null,
        profileImageUrl: currentUser.profilePic || null,
        followers: 0,
        following: 0,
        isOnline: true
      });
    }
  }, [currentUser]);

  // Fetch user data from backend using JWT (for profile-specific data like followers/following)
  const refreshUserData = async () => {
    try {
      // Refresh user context data first
      await refreshUser();
      
      const response = await api.get('/users/me');
      const data = response.data;
      console.log('Profile loaded user data:', data);
        setUserData({
          id: data.id,
          name: data.name || 'User',
          email: data.email || '',
          school: data.school || 'CIT University',
          program: data.program || '',
          yearLevel: data.yearLevel || null,
          studentId: data.studentId || '',
          bio: data.bio || 'No bio yet',
          profilePic: data.profilePic || null,
          profileImageUrl: data.profileImageUrl || data.profilePic || null,
          coverImage: data.coverImage || data.coverImageUrl || null,
          followers: data.followers || 0,
          following: data.following || 0,
          isOnline: true
        });

        setEditForm({
          name: data.name || '',
          school: data.school || '',
          studentId: data.studentId || '',
          bio: data.bio || ''
        });
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  useEffect(() => {
    refreshUserData();
    
    // Listen for follow changes from other pages
    const handleFollowChange = () => {
      console.log('Follow change detected, refreshing user data...');
      refreshUserData();
    };
    
    window.addEventListener('user-follow-changed', handleFollowChange);
    
    return () => {
      window.removeEventListener('user-follow-changed', handleFollowChange);
    };
  }, []);

  // Open edit modal
  const openEditModal = () => {
    setEditForm({
      name: userData.name,
      school: userData.school,
      studentId: userData.studentId,
      bio: userData.bio
    });
    setShowEditModal(true);
  };

  // Close edit modal
  const closeEditModal = () => {
    setShowEditModal(false);
    setEditForm({
      name: '',
      school: '',
      studentId: '',
      bio: ''
    });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Save profile changes
  const saveProfileChanges = async () => {
    try {
      setIsEditing(true);
      
      // Use /users/me endpoint - user ID extracted from JWT token
      const response = await api.put('/users/me', {
        name: editForm.name,
        school: editForm.school,
        studentId: editForm.studentId,
        bio: editForm.bio
      });
      
      const updatedData = response.data;
      
      setUserData(prev => ({
        ...prev,
        name: updatedData.name,
        school: updatedData.school,
        studentId: updatedData.studentId,
        bio: updatedData.bio
      }));
      
      closeEditModal();
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsEditing(false);
    }
  };

  // Toggle options menu
  const toggleProfileOptionsMenu = (e) => {
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
      e.preventDefault();
    }
    setShowProfileOptionsMenu(!showProfileOptionsMenu);
  };

  const toggleTabOptionsMenu = (e) => {
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
      e.preventDefault();
    }
    setShowTabOptionsMenu(!showTabOptionsMenu);
  };

  // Navigate to create session
  const handleCreateSession = (e) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('Navigating to create session page...');
    navigate('/create-session');
  };

  // Followers manager helpers
  const openFollowersManager = async () => {
    setShowFollowersManager(true);
    await refreshFollowLists();
  };

  const refreshFollowLists = async () => {
    try{
      const meResponse = await api.get('/users/me');
      const meData = meResponse.data;
      const userId = meData.id;
      
      // Update userData with fresh counts from /users/me
      setUserData(prev => ({
        ...prev,
        followers: meData.followers || 0,
        following: meData.following || 0
      }));
      
      const [followersRes, followingRes] = await Promise.all([
        api.get(`/users/${userId}/followers`),
        api.get(`/users/${userId}/following`)
      ]);
      const followers = followersRes.data;
      const following = followingRes.data;
      setFollowersList(Array.isArray(followers)? followers: []);
      setFollowingList(Array.isArray(following)? following: []);
    }catch(err){
      console.error('Failed to load follow lists', err);
      setFollowersList([]);
      setFollowingList([]);
    }
  };

  const removeFollower = async (followerId) => {
    try{
      await api.delete(`/users/me/followers/${followerId}`);
      // Refresh user data to get accurate counts
      await refreshUserData();
      // Update local lists - remove from followers
      setFollowersList(prev=> prev.filter(u=>u.id!==followerId));
    }catch(e){ console.error('Remove follower failed', e); }
  };

  const unfollowUser = async (followingId) => {
    try{
      await api.delete(`/users/${followingId}/follow`);
      // Refresh user data to get accurate counts
      await refreshUserData();
      // Update local lists
      setFollowingList(prev=> prev.filter(u=>u.id!==followingId));
    }catch(e){ console.error('Unfollow failed', e); }
  };

  return {
    // State
    showEditModal,
    showFollowersManager,
    followTab,
    followersList,
    followingList,
    showProfileOptionsMenu,
    showTabOptionsMenu,
    isEditing,
    sessionsView,
    openCardMenuId,
    userData,
    editForm,
    
    // Setters
    setShowEditModal,
    setShowFollowersManager,
    setFollowTab,
    setShowProfileOptionsMenu,
    setShowTabOptionsMenu,
    setSessionsView,
    setOpenCardMenuId,
    
    // Actions
    openEditModal,
    closeEditModal,
    handleInputChange,
    saveProfileChanges,
    toggleProfileOptionsMenu,
    toggleTabOptionsMenu,
    handleCreateSession,
    openFollowersManager,
    removeFollower,
    unfollowUser,
  };
};

// Sessions hook for profile page
export const useSessions = () => {
  const [sessionsData, setSessionsData] = useState([]);
  const [trashedSessions, setTrashedSessions] = useState([]);
  const [historySessions, setHistorySessions] = useState([]);

  // Fetch ACTIVE sessions from backend
  const fetchActiveSessions = async () => {
    try {
      const res = await api.get('/sessions/user/me');
      const data = res.data;
      console.log("Fetched sessions:", data);
      
      // Backend already filters to ACTIVE and SCHEDULED sessions
      const activeSessions = (Array.isArray(data) ? data : [])
        .sort((a, b) => {
          // Define status priority: ACTIVE first, then SCHEDULED
          const statusPriority = { 'ACTIVE': 1, 'SCHEDULED': 2 };
          const priorityDiff = (statusPriority[a.status] || 999) - (statusPriority[b.status] || 999);
          
          if (priorityDiff !== 0) return priorityDiff;
          
          // Within same status, sort by start time
          const dateA = new Date(`${a.year}-${a.month}-${a.day} ${a.startTime}`);
          const dateB = new Date(`${b.year}-${b.month}-${b.day} ${b.startTime}`);
          return dateA - dateB;
        });
      
      setSessionsData(activeSessions);
    } catch (err) {
      console.error("Failed to fetch active sessions:", err);
      setSessionsData([]);
    }
  };

  // Fetch TRASH sessions from backend
  const fetchTrashedSessions = async () => {
    try {
      const res = await api.get('/sessions/user/me/trash');
      const data = res.data;
      
      // Data is already filtered to TRASH on backend
      const trashed = (Array.isArray(data) ? data : []);
      setTrashedSessions(trashed);
    } catch (err) {
      console.error("Failed to fetch trashed sessions:", err);
      setTrashedSessions([]);
    }
  };

  // Fetch COMPLETED (history) sessions from backend
  const fetchCompletedSessions = async () => {
    try {
      const res = await api.get('/sessions/user/me/history');
      const data = res.data;
      
      const completed = (Array.isArray(data) ? data : []);
      setHistorySessions(completed);
    } catch (err) {
      console.error("Failed to fetch completed sessions:", err);
      setHistorySessions([]);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchActiveSessions();
    fetchTrashedSessions();
    fetchCompletedSessions();
  }, []);



  const deleteSession = async (sessionId) => {
    try {
      await sessionService.updateSessionStatus(sessionId, 'TRASH');
      
      // Refresh both active and trashed sessions from backend
      await fetchActiveSessions();
      await fetchTrashedSessions();
    } catch (error) {
      console.error('Error trashing session:', error);
      alert(`Failed to trash session: ${error.message}`);
    }
  };

  const restoreSession = async (sessionId) => {
    try {
      await sessionService.updateSessionStatus(sessionId, 'ACTIVE');
      
      // Refresh both active and trashed sessions from backend
      await fetchActiveSessions();
      await fetchTrashedSessions();
    } catch (error) {
      console.error('Error restoring session:', error);
      alert(`Failed to restore session: ${error.message}`);
    }
  };

  return {
    sessionsData,
    trashedSessions,
    historySessions,
    deleteSession,
    restoreSession,
    refreshHistory: fetchCompletedSessions
  };
};
