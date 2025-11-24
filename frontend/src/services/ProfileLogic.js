import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';



export const useProfilePage = () => {
  const navigate = useNavigate();
  const { getUserId } = useUser();
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
  const [notesView, setNotesView] = useState('all');
  const [openNoteMenuId, setOpenNoteMenuId] = useState(null);
  const [openCardMenuId, setOpenCardMenuId] = useState(null);

  // User data from centralized context
  const [userData, setUserData] = useState({
    id: null,
    name: '',
    email: '',
    school: '',
    program: '',
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

  // Fetch user data from backend using user ID
  useEffect(() => {
    const fetchUserData = async () => {
      const userId = getUserId();
      if (!userId) return;

      try {
        const response = await fetch(`http://localhost:8080/api/users/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setUserData({
            id: userId,
            name: data.name || 'full (name of the user)',
            email: data.email || '',
            school: data.school || 'CIT University', // default school
            program: data.program || 'BSIT', // default program
            studentId: data.studentId || '23-2684-947', // default student ID
            bio: data.bio || 'No bio yet',
            profilePic: data.profilePic || null,
            coverImage: data.coverImage || null,
            followers: 0,
            following: 0,
            isOnline: true
          });

          setEditForm({
            name: data.name || '',
            school: data.school || 'Caraga State University',
            studentId: data.studentId || '',
            bio: data.bio || ''
          });
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, [getUserId]);

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
      
      const currentUserId = getUserId();
      if (!currentUserId) {
        alert('User not authenticated');
        return;
      }
      
      const response = await fetch(`http://localhost:8080/api/users/${currentUserId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json'
        },
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

  // Navigate to create note
  const handleCreateNote = (e) => {
    e.stopPropagation();
    e.preventDefault();
    navigate('/create-note');
  };

  // Followers manager helpers
  const openFollowersManager = async () => {
    setShowFollowersManager(true);
    await refreshFollowLists();
  };

  const refreshFollowLists = async () => {
    try{
      const userId = getUserId();
      if(!userId) return;
      const [foRes, fiRes] = await Promise.all([
        fetch(`http://localhost:8080/api/followers/${userId}/followers`),
        fetch(`http://localhost:8080/api/followers/${userId}/following`)
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
    const userId = getUserId();
    if(!userId) return;
    try{
      await fetch('http://localhost:8080/api/followers/unfollow',{
        method:'DELETE', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ followerId, followingId: userId })
      });
      setFollowersList(prev=> prev.filter(u=>u.id!==followerId));
    }catch(e){ console.error('Remove follower failed', e); }
  };

  const unfollowUser = async (followingId) => {
    const userId = getUserId();
    if(!userId) return;
    try{
      await fetch('http://localhost:8080/api/followers/unfollow',{
        method:'DELETE', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ followerId: userId, followingId })
      });
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
    activeTab,
    sessionsView,
    notesView,
    openNoteMenuId,
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
    setNotesView,
    setOpenNoteMenuId,
    setOpenCardMenuId,
    
    // Actions
    openEditModal,
    closeEditModal,
    handleInputChange,
    saveProfileChanges,
    toggleProfileOptionsMenu,
    toggleTabOptionsMenu,
    handleCreateSession,
    handleCreateNote,
    openFollowersManager,
    removeFollower,
    unfollowUser,
  };
};

// Notes hook for profile page
export const useNotes = (activeTab) => {
  const { getUserId } = useUser();
  const [notesData, setNotesData] = useState([]);

  useEffect(() => {
    const userId = getUserId();
    
    // If no user is authenticated, don't fetch notes - just like useSessions
    if (!userId) {
      console.warn('User not authenticated');
      setNotesData([]);
      return;
    }

    const fetchNotes = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/notes/user/${userId}/active`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) throw new Error('Failed to fetch notes');

        const data = await res.json();
        console.log('Fetched notes for user', userId, ':', data);
        
        // Normalize the data to match expected format
        const normalized = (Array.isArray(data) ? data : []).map(n => ({
          id: n.noteId || n.id,
          title: n.title || 'Untitled Note',
          content: n.content || '',
          createdAt: n.createdAt || new Date().toISOString(),
          isFavourite: false,
          archivedAt: null,
          deletedAt: null,
        }));
        
        setNotesData(normalized);
      } catch (err) {
        console.error('Failed to fetch notes from server:', err);
        setNotesData([]);
      }
    };

    if (userId) {
      fetchNotes();
    }
  }, [activeTab, getUserId]);

  const toggleFavourite = (noteId) => {
    setNotesData(prevNotes =>
      prevNotes.map(note =>
        note.id === noteId ? { ...note, isFavourite: !note.isFavourite } : note
      )
    );
  };

  const archiveNote = (noteId) => {
    setNotesData(prevNotes =>
      prevNotes.filter(note => note.id !== noteId)
    );
  };

  const deleteNote = (noteId) => {
    setNotesData(prevNotes =>
      prevNotes.filter(note => note.id !== noteId)
    );
  };

  const restoreTrashedNote = () => {
    // Refresh from server to get the restored notes
    const userId = getUserId();
    if (userId) {
      fetch(`http://localhost:8080/api/notes/user/${userId}/active`)
        .then(res => res.json())
        .then(data => {
          const normalized = (Array.isArray(data) ? data : []).map(n => ({
            id: n.noteId || n.id,
            title: n.title || 'Untitled Note',
            content: n.content || '',
            createdAt: n.createdAt || new Date().toISOString(),
            isFavourite: false,
            archivedAt: null,
            deletedAt: null,
          }));
          setNotesData(normalized);
        })
        .catch(err => console.error('Failed to refresh notes:', err));
    }
  };

  const restoreArchivedNote = () => {
    // Refresh from server to get the restored notes
    const userId = getUserId();
    if (userId) {
      fetch(`http://localhost:8080/api/notes/user/${userId}/active`)
        .then(res => res.json())
        .then(data => {
          const normalized = (Array.isArray(data) ? data : []).map(n => ({
            id: n.noteId || n.id,
            title: n.title || 'Untitled Note',
            content: n.content || '',
            createdAt: n.createdAt || new Date().toISOString(),
            isFavourite: false,
            archivedAt: null,
            deletedAt: null,
          }));
          setNotesData(normalized);
        })
        .catch(err => console.error('Failed to refresh notes:', err));
    }
  };

  // Provide API-compatible names expected by components
  const toggleFavouriteNote = (noteId) => toggleFavourite(noteId);

  return {
    notesData,
    toggleFavourite: toggleFavourite,
    toggleFavouriteNote,
    archiveNote,
    deleteNote,
    restoreTrashedNote,
    restoreArchivedNote
  };
};

// Sessions hook for profile page
const TRASH_TTL_DAYS = 3;

const pruneTrashed = (items) => {
  const now = Date.now();
  const kept = items.filter(s => !s.deletedAt || (now - s.deletedAt) < TRASH_TTL_DAYS * 24 * 60 * 60 * 1000);
  if (kept.length !== items.length) {
    localStorage.setItem('trashedSessions', JSON.stringify(kept));
  }
  return kept;
};

export const useSessions = () => {
  const [sessionsData, setSessionsData] = useState([]);
  const [trashedSessions, setTrashedSessions] = useState([]);
  const { getUserId } = useUser();


  // Fetch sessions from API
  useEffect(() => {

    const userId = getUserId();
    if (!userId) {
      console.warn("User not authenticated");
      return;
    }


    const fetchSessions = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/sessions/user/${userId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        });

        if (!res.ok) throw new Error("Failed to fetch sessions");

        const data = await res.json();
        console.log("Fetched sessions:", data);
        
        // Normalize the data
        const normalized = (Array.isArray(data) ? data : []).map(s => ({
          id: s.id,
          title: s.title,
          date: s.date || new Date().toISOString(),
          time: s.time || '00:00',
          location: s.location || 'TBD',
          participants: s.participants || 0,
          status: s.status || 'ACTIVE'
        }));
        
        setSessionsData(normalized);
        localStorage.setItem('sessions', JSON.stringify(normalized));
      } catch (err) {
        console.warn("Failed to fetch sessions from server, falling back to localStorage", err);
        try {
          const storedSessions = JSON.parse(localStorage.getItem('sessions') || '[]');
          setSessionsData(storedSessions);
        } catch (e) {
          console.error("Failed to parse stored sessions", e);
          setSessionsData([]);
        }
      }
    };

    if (userId) {
      fetchSessions();
    }

    // Load trashed sessions
    try {
      const stored = JSON.parse(localStorage.getItem('trashedSessions') || '[]');
      setTrashedSessions(pruneTrashed(stored));
    } catch (e) {
      console.error('Failed to parse trashed sessions', e);
      setTrashedSessions([]);
    }
  }, [getUserId]);

  const deleteSession = (sessionId) => {
    setSessionsData(prevSessions => {
      const toDelete = prevSessions.find(s => s.id === sessionId);
      if (!toDelete) return prevSessions;

      const withoutDeleted = prevSessions.filter(s => s.id !== sessionId);
      const deletedSession = { ...toDelete, deletedAt: Date.now() };
      
      setTrashedSessions(prevTrash => {
        const newTrash = [...prevTrash, deletedSession];
        localStorage.setItem('trashedSessions', JSON.stringify(newTrash));
        return newTrash;
      });

      localStorage.setItem('sessions', JSON.stringify(withoutDeleted));
      return withoutDeleted;
    });
  };

  const restoreSession = (sessionId) => {
    setTrashedSessions(prevTrash => {
      const toRestore = prevTrash.find(s => s.id === sessionId);
      if (!toRestore) return prevTrash;

      const updatedTrash = prevTrash.filter(s => s.id !== sessionId);
      // Clear deletedAt and re-add to sessions
      const restored = { ...toRestore, deletedAt: null };

      setSessionsData(prev => {
        const newSessions = [restored, ...prev];
        localStorage.setItem('sessions', JSON.stringify(newSessions));
        return newSessions;
      });

      localStorage.setItem('trashedSessions', JSON.stringify(updatedTrash));
      return updatedTrash;
    });
  };

  return {
    sessionsData,
    trashedSessions,
    deleteSession,
    restoreSession,
    TRASH_TTL_DAYS
  };
};
