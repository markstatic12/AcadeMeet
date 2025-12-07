import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { authFetch } from './apiHelper';
import { sessionService } from './SessionService';



export const useProfilePage = () => {
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFollowersManager, setShowFollowersManager] = useState(false);
  const [followTab, setFollowTab] = useState('followers');
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [showProfileOptionsMenu, setShowProfileOptionsMenu] = useState(false);
  const [showTabOptionsMenu, setShowTabOptionsMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('sessions');
  const [sessionsView, setSessionsView] = useState('active');
  const [openCardMenuId, setOpenCardMenuId] = useState(null);
  const [completedSessions, setCompletedSessions] = useState([]); //NOT YET IMPLEMENTED

  // User data from centralized context
  const [userData, setUserData] = useState({
    id: null,
    name: '',
    email: '',
    school: '',
    program: '',
    yearLevel: null,
    studentId: '',
    bio: 'No bio yet',
    coverImage: null,
    followers: 0,
    following: 0,
    isOnline: true
  });

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: '',
    school: '',
    studentId: '',
    bio: ''
  });

  // Fetch user data from backend using JWT
  const refreshUserData = async () => {
    try {
      const response = await authFetch('/users/me');
      if (response.ok) {
        const data = await response.json();
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
      }
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
      const response = await authFetch('/users/me', {
        method: 'PUT',
        body: JSON.stringify({
          name: editForm.name,
          school: editForm.school,
          studentId: editForm.studentId,
          bio: editForm.bio
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      const updatedData = await response.json();
      
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
      const meResponse = await authFetch('/users/me');
      const meData = await meResponse.json();
      const userId = meData.id;
      
      // Update userData with fresh counts from /users/me
      setUserData(prev => ({
        ...prev,
        followers: meData.followers || 0,
        following: meData.following || 0
      }));
      
      const [foRes, fiRes] = await Promise.all([
        authFetch(`/users/${userId}/followers`),
        authFetch(`/users/${userId}/following`)
      ]);
      const [followers, following] = await Promise.all([
        foRes.ok ? foRes.json() : Promise.resolve([]),
        fiRes.ok ? fiRes.json() : Promise.resolve([])
      ]);
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
      // Remove a follower means they unfollow us
      // We need to call the unfollow endpoint from their perspective
      // This might require a different endpoint, for now just refresh the list
      await refreshFollowLists();
    }catch(e){ console.error('Remove follower failed', e); }
  };

  const unfollowUser = async (followingId) => {
    try{
      const response = await authFetch(`/users/${followingId}/follow`,{
        method:'DELETE'
      });
      
      if (response.ok || response.status === 204) {
        // Refresh user data to get accurate counts
        await refreshUserData();
        // Update local lists
        setFollowingList(prev=> prev.filter(u=>u.id!==followingId));
      }
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
    activeTab,
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
    setActiveTab,
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

// Notes hook for profile page (simplified - upload only)
export const useNotes = () => {
  const [notesData, setNotesData] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await authFetch('/notes/me/active');
        if (!response.ok) {
          console.error('Failed to fetch notes:', response.statusText);
          setNotesData([]);
          return;
        }
        const data = await response.json();
        const normalized = (Array.isArray(data) ? data : []).map(n => ({
          id: n.noteId || n.id,
          title: n.title || 'Untitled Note',
          content: n.content || '',
          createdAt: n.createdAt || new Date().toISOString(),
          raw: n
        }));
        setNotesData(normalized);
      } catch (err) {
        console.error('Failed to fetch notes from server:', err);
        setNotesData([]);
      }
    };

    fetchNotes();
  }, []);

  return { notesData };
};

// Sessions hook for profile page
export const useSessions = () => {
  const [sessionsData, setSessionsData] = useState([]);
  const [trashedSessions, setTrashedSessions] = useState([]);
  const [historySessions, setHistorySessions] = useState([]);

  // Fetch ACTIVE sessions from backend
  const fetchActiveSessions = async () => {
    try {
      const res = await authFetch('/sessions/user/me', {
        method: "GET",
      });

      if (!res.ok) throw new Error("Failed to fetch sessions");

      const data = await res.json();
      console.log("Fetched sessions:", data);
      
      // Filter only ACTIVE sessions
      const activeSessions = (Array.isArray(data) ? data : []).filter(s => s.status === 'ACTIVE');
      setSessionsData(activeSessions);
    } catch (err) {
      console.error("Failed to fetch active sessions:", err);
      setSessionsData([]);
    }
  };

  // Fetch TRASH sessions from backend
  const fetchTrashedSessions = async () => {
    try {
      const res = await authFetch('/sessions/user/me', {
        method: "GET",
      });

      if (!res.ok) throw new Error("Failed to fetch trashed sessions");

      const data = await res.json();
      
      // Filter only TRASH sessions
      const trashed = (Array.isArray(data) ? data : []).filter(s => s.status === 'TRASH');
      setTrashedSessions(trashed);
    } catch (err) {
      console.error("Failed to fetch trashed sessions:", err);
      setTrashedSessions([]);
    }
  };

  // Fetch COMPLETED (history) sessions from backend
  const fetchCompletedSessions = async () => {
    try {
      const res = await authFetch('/sessions/user/me/history', {
        method: "GET",
      });

      if (!res.ok) throw new Error("Failed to fetch completed sessions");
      const data = await res.json();
      
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
    restoreSession,
    refreshHistory: fetchCompletedSessions
  };
};
