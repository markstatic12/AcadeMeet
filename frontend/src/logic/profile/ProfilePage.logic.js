import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
  const [notesView, setNotesView] = useState('all');
  const [openNoteMenuId, setOpenNoteMenuId] = useState(null);
  const [openCardMenuId, setOpenCardMenuId] = useState(null);

  // User data from localStorage
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

  // Load user data from localStorage on mount
  useEffect(() => {
    const studentData = localStorage.getItem('student');
    if (studentData) {
      const student = JSON.parse(studentData);
      setUserData({
        id: student.id,
        name: student.name || 'full (name of the user)',
        email: student.email || '',
        school: 'CIT University',
        program: 'BSIT',
        studentId: '23-2684-947',
        bio: student.bio || 'No bio yet',
        profilePic: student.profilePic || null,
        coverImage: student.coverImage || null,
        followers: 0,
        following: 0,
        isOnline: true
      });
    }
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
      
      const response = await fetch(`http://localhost:8080/api/users/${userData.id}`, {
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
      
      const studentData = JSON.parse(localStorage.getItem('student'));
      const updatedStudent = {
        ...studentData,
        name: updatedData.name,
        school: updatedData.school,
        studentId: updatedData.studentId,
        bio: updatedData.bio
      };
      localStorage.setItem('student', JSON.stringify(updatedStudent));
      
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
    e.stopPropagation();
    e.preventDefault();
    setShowProfileOptionsMenu(!showProfileOptionsMenu);
  };

  const toggleTabOptionsMenu = (e) => {
    e.stopPropagation();
    e.preventDefault();
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
      if(!userData?.id) return;
      const [foRes, fiRes] = await Promise.all([
        fetch(`http://localhost:8080/api/followers/${userData.id}/followers`),
        fetch(`http://localhost:8080/api/followers/${userData.id}/following`)
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
    if(!userData?.id) return;
    try{
      await fetch('http://localhost:8080/api/followers/unfollow',{
        method:'DELETE', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ followerId, followingId: userData.id })
      });
      setFollowersList(prev=> prev.filter(u=>u.id!==followerId));
    }catch(e){ console.error('Remove follower failed', e); }
  };

  const unfollowUser = async (followingId) => {
    if(!userData?.id) return;
    try{
      await fetch('http://localhost:8080/api/followers/unfollow',{
        method:'DELETE', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ followerId: userData.id, followingId })
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
