import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import Button from '../components/ui/Button';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFollowersManager, setShowFollowersManager] = useState(false);
  const [followTab, setFollowTab] = useState('followers'); // 'followers' | 'following'
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [showProfileOptionsMenu, setShowProfileOptionsMenu] = useState(false);
  const [showTabOptionsMenu, setShowTabOptionsMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('sessions'); // 'sessions' or 'notes'
  const [sessionsView, setSessionsView] = useState('active'); // 'active' | 'trash'
  const [notesView, setNotesView] = useState('all'); // 'all' | 'favourites' | 'archived' | 'trashed'
  const [openNoteMenuId, setOpenNoteMenuId] = useState(null);
  const leftProfileCardRef = useRef(null);
  const rightPanelRef = useRef(null);
  const [panelHeight, setPanelHeight] = useState(null);
  
  // User data from localStorage (initially)
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

  const [sessionsData, setSessionsData] = useState([]);


const userId = 1; // Replace with actual user ID as needed

useEffect(() => {
  const fetchSessions = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/sessions/user/${userId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });

      if (!res.ok) throw new Error("Failed to fetch sessions");

      const data = await res.json();
      console.log("Fetched sessions:", data);
      setSessionsData(data);
      
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  };

  fetchSessions();
}, [userId]); // optional: add userId as dependency


    

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
        // Followers feature not yet implemented; display zeros for now
        followers: 0,
        following: 0,
        isOnline: true
      });
    }
  }, []);

  // Sessions created by the user (loaded from localStorage)
  const [trashedSessions, setTrashedSessions] = useState([]);
  const [openCardMenuId, setOpenCardMenuId] = useState(null);

  const TRASH_TTL_DAYS = 14;
  const pruneTrashed = (items) => {
    const now = Date.now();
    const kept = items.filter(s => !s.deletedAt || (now - s.deletedAt) < TRASH_TTL_DAYS * 24 * 60 * 60 * 1000);
    if (kept.length !== items.length) {
      localStorage.setItem('trashedSessions', JSON.stringify(kept));
    }
    return kept;
  };

  useEffect(() => {
    try {
      const trashed = JSON.parse(localStorage.getItem('trashedSessions') || '[]');
      setTrashedSessions(pruneTrashed(trashed));
    } catch (e) {
      console.error('Failed to load sessions from localStorage', e);
    }
  }, []);

  // Keep the right panel height leveled with the left profile card and make its content scrollable
  useEffect(() => {
    const syncHeights = () => {
      const h = leftProfileCardRef.current?.offsetHeight;
      if (h && typeof h === 'number') {
        setPanelHeight(h);
      }
    };
    syncHeights();
    window.addEventListener('resize', syncHeights);
    return () => window.removeEventListener('resize', syncHeights);
  }, [userData, showEditModal, showProfileOptionsMenu]);

  // Format a 24-hour time string (HH:mm) to 12-hour with AM/PM
  const to12Hour = (t) => {
    if (!t || typeof t !== 'string' || !t.includes(':')) return '';
    const [hh, mm] = t.split(':');
    let h = parseInt(hh, 10);
    if (Number.isNaN(h)) return '';
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    if (h === 0) h = 12;
    return `${h}:${mm} ${ampm}`;
  };

  // Get display time for legacy/local entries
  const getDisplayTime = (s) => {
    if (!s) return '';
    if (s.time && /am|pm/i.test(s.time)) return s.time; // already formatted
    if (s.startTimeRaw || s.endTimeRaw) {
      const st = s.startTimeRaw ? to12Hour(s.startTimeRaw) : '';
      const et = s.endTimeRaw ? to12Hour(s.endTimeRaw) : '';
      return st && et ? `${st} - ${et}` : (st || et);
    }
    if (s.time) {
      const parts = s.time.split('-').map(p => p.trim());
      if (parts.length === 2) return `${to12Hour(parts[0])} - ${to12Hour(parts[1])}`;
      if (parts.length === 1) return to12Hour(parts[0]);
    }
    return s.time || '';
  };

  // Sample notes data
  const [notesData, setNotesData] = useState([]);
  useEffect(() => {
    try {
      const storedNotes = JSON.parse(localStorage.getItem('notes') || '[]');
      setNotesData(storedNotes);
      // auto-switch to notes if coming from create-note
      if (sessionStorage.getItem('openNotesTab') === 'true') {
        setActiveTab('notes');
        setNotesView('all'); // ensure default notes screen
        sessionStorage.removeItem('openNotesTab');
      }
    } catch (e) {
      console.error('Failed to load notes', e);
    }
  }, []);

  // Helper to persist notes changes
  const persistNotes = (next) => {
    setNotesData(next);
    localStorage.setItem('notes', JSON.stringify(next));
  };

  // Note actions
  const toggleFavouriteNote = (noteId) => {
    const next = notesData.map(n => n.id === noteId ? { ...n, isFavourite: !n.isFavourite } : n);
    persistNotes(next);
    setOpenNoteMenuId(null);
  };

  const archiveNote = (noteId) => {
    const next = notesData.map(n => n.id === noteId ? { ...n, archivedAt: n.archivedAt ? null : Date.now() } : n);
    persistNotes(next);
    setOpenNoteMenuId(null);
  };

  const deleteNote = (noteId) => {
    const next = notesData.map(n => n.id === noteId ? { ...n, deletedAt: Date.now() } : n);
    persistNotes(next);
    setOpenNoteMenuId(null);
  };

  // Restore trashed note
  const restoreTrashedNote = (noteId) => {
    const next = notesData.map(n => n.id === noteId ? { ...n, deletedAt: null } : n);
    persistNotes(next);
  };

  // Restore archived note
  const restoreArchivedNote = (noteId) => {
    const next = notesData.map(n => n.id === noteId ? { ...n, archivedAt: null } : n);
    persistNotes(next);
  };

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

  // Close options menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileOptionsMenu && !event.target.closest('.profile-options-menu')) {
        setShowProfileOptionsMenu(false);
      }
      if (showTabOptionsMenu && !event.target.closest('.tab-options-menu')) {
        setShowTabOptionsMenu(false);
      }
      if (openCardMenuId && !event.target.closest('.card-options-menu')) {
        setOpenCardMenuId(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileOptionsMenu, showTabOptionsMenu]);

  // Navigate to create session
  const handleCreateSession = (e) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('Navigating to create session page...');
    navigate('/create-session');
  };

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

  // Move session to trash
  const deleteSession = (sessionId) => {
    const toDelete = sessionsData.find(s => s.id === sessionId);
    if (!toDelete) return;
    const updated = sessionsData.filter(s => s.id !== sessionId);
    setSessionsData(updated);
    localStorage.setItem('sessions', JSON.stringify(updated));

    const newTrashItem = { ...toDelete, deletedAt: Date.now() };
    const currentTrash = pruneTrashed(JSON.parse(localStorage.getItem('trashedSessions') || '[]'));
    const nextTrash = [newTrashItem, ...currentTrash];
    setTrashedSessions(nextTrash);
    localStorage.setItem('trashedSessions', JSON.stringify(nextTrash));
    setOpenCardMenuId(null);
  };

  // Restore a trashed session back to active sessions
  const restoreSession = (sessionId) => {
    const idx = trashedSessions.findIndex(s => s.id === sessionId);
    if (idx === -1) return;
    const restored = { ...trashedSessions[idx] };
    delete restored.deletedAt;
    const nextTrash = [...trashedSessions];
    nextTrash.splice(idx, 1);
    const nextSessions = [restored, ...sessionsData];
    setTrashedSessions(nextTrash);
    setSessionsData(nextSessions);
    localStorage.setItem('trashedSessions', JSON.stringify(nextTrash));
    localStorage.setItem('sessions', JSON.stringify(nextSessions));
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
      
      // Make API call to update user profile in backend
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
      
      // Update local state
      setUserData(prev => ({
        ...prev,
        name: updatedData.name,
        school: updatedData.school,
        studentId: updatedData.studentId,
        bio: updatedData.bio
      }));
      
      // Update localStorage
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
      
      // Show success message
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-white mb-6">My Profile</h1>
      <div className="flex gap-6">
        {/* Left Side - Profile Card */}
        <div className="w-[350px]">
          <div ref={leftProfileCardRef} className="relative bg-[#1f1f1f] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
            {/* Profile Banner with Avatar */}
            <div className="relative h-44 overflow-visible">
              {userData?.coverImage ? (
                <img src={userData.coverImage} alt="cover" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#3949ab] via-[#5e6bbf] to-[#7986cb]" />
              )}
              {/* Diagonal white sweep */}
              <div className="absolute top-0 right-0 w-48 h-full bg-gradient-to-br from-white/40 to-transparent transform skew-x-[-20deg] translate-x-12"></div>
              
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 z-10">
                <div className="w-24 h-24 bg-[#0f0f0f] rounded-full p-1 overflow-hidden ring-4 ring-[#1f1f1f]">
                  {userData?.profilePic ? (
                    <img src={userData.profilePic} alt="avatar" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                  )}
                </div>
                {userData.isOnline && (
                  <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-4 border-[#0f0f0f] z-20"></div>
                )}
              </div>
            </div>

            {/* Profile Content */}
            <div className="pt-16 px-6 pb-6">
              {/* User Info */}
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold text-white mb-1">{userData.name}</h2>
                <p className="text-gray-400 text-xs">
                  {userData.school}, {userData.program}, {userData.studentId}
                </p>
              </div>

              {/* Bio */}
              <div className="mb-4">
                <p className="text-gray-400 text-sm italic bg-gray-800/50 border border-gray-700 rounded-lg p-4 min-h-[120px]">
                  {userData.bio}
                </p>
              </div>

              {/* Followers & Following */}
              <div className="flex justify-center gap-8 mb-4 py-3 border-y border-gray-800">
                <div className="text-center">
                  <p className="text-gray-400 text-xs mb-1">Followers</p>
                  {/* Hard-coded to 0 until followers feature is implemented */}
                  <p className="text-xl font-bold text-white">0</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-xs mb-1">Following</p>
                  {/* Hard-coded to 0 until followers feature is implemented */}
                  <p className="text-xl font-bold text-white">0</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button onClick={()=>{openFollowersManager();}} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 rounded-lg transition-colors">
                  Manage Followers
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Sessions and Notes */}
  <div className="flex-1 relative z-0">
          {/* Elevated Card Container - matches profile card height */}
          <div
            ref={rightPanelRef}
            style={panelHeight ? { height: panelHeight } : undefined}
            className="bg-[#1f1f1f] border border-gray-800 rounded-2xl overflow-hidden shadow-xl p-6 flex flex-col"
          >
            {/* Tabs and Options Menu */}
            <div className="flex items-center justify-between mb-6 flex-shrink-0">
              <div className="flex gap-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab('sessions');
                  }}
                  className={`px-8 py-3 rounded-xl font-semibold text-lg transition-all ${
                    activeTab === 'sessions'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  Sessions
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab('notes');
                    setNotesView('all'); // always land on main Notes screen
                  }}
                  className={`px-8 py-3 rounded-xl font-semibold text-lg transition-all ${
                    activeTab === 'notes'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  Notes
                </button>
              </div>
              <div className="relative tab-options-menu">
                <button
                  onClick={toggleTabOptionsMenu}
                  className="p-3 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-xl transition-colors"
                >
                  <ThreeDotsVerticalIcon className="w-5 h-5" />
                </button>
                {showTabOptionsMenu && (
                  activeTab === 'sessions' ? (
                    <div className="absolute right-0 mt-2 w-48 bg-[#1a1a1a] border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                      <button
                        onClick={() => {
                          // Handle history (placeholder)
                          setShowTabOptionsMenu(false);
                        }}
                        className="w-full px-4 py-3 text-left text-sm text-white hover:bg-gray-800 transition-colors flex items-center gap-3"
                      >
                        <HistoryIcon className="w-4 h-4" />
                        History
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab('sessions');
                          setSessionsView('trash');
                          setShowTabOptionsMenu(false);
                        }}
                        className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-gray-800 transition-colors flex items-center gap-3"
                      >
                        <TrashIcon className="w-4 h-4" />
                        Trash
                      </button>
                    </div>
                  ) : (
                    <div className="absolute right-0 mt-2 w-56 bg-[#1a1a1a] border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                      <button
                        onClick={() => {
                          setActiveTab('notes');
                          setNotesView('favourites');
                          setShowTabOptionsMenu(false);
                        }}
                        className="w-full px-5 py-3 text-left text-sm text-white hover:bg-gray-800 transition-colors flex items-center gap-3"
                      >
                        <BookmarkCheckIcon className="w-4 h-4 text-indigo-400" />
                        Favourite Notes
                      </button>
                      <div className="h-px w-full bg-gray-700" />
                      <button
                        onClick={() => {
                          setActiveTab('notes');
                          setNotesView('archived');
                          setShowTabOptionsMenu(false);
                        }}
                        className="w-full px-5 py-3 text-left text-sm text-white hover:bg-gray-800 transition-colors flex items-center gap-3"
                      >
                        <ArchiveIcon className="w-4 h-4 text-white" />
                        Archived Notes
                      </button>
                      <div className="h-px w-full bg-gray-700" />
                      <button
                        onClick={() => {
                          setActiveTab('notes');
                          setNotesView('trashed');
                          setShowTabOptionsMenu(false);
                        }}
                        className="w-full px-5 py-3 text-left text-sm text-red-400 hover:bg-gray-800 transition-colors flex items-center gap-3"
                      >
                        <TrashIcon className="w-4 h-4" />
                        Trashed Notes
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>

              {/* Sessions Content */}
              {activeTab === 'sessions' && sessionsView === 'active' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 w-full flex-1 overflow-y-auto pr-1 custom-scrollbar">
                {/* Create New Session Card */}
                <button
                  onClick={handleCreateSession}
                  className="bg-[#1a1a1a] border-2 border-dashed border-gray-700 hover:border-indigo-500 rounded-xl flex flex-col items-center justify-center transition-all group hover:bg-[#1f1f1f] h-[240px] w-full"
                >
                  <div className="w-16 h-16 bg-[#2a2a2a] group-hover:bg-indigo-600/20 rounded-full flex items-center justify-center mb-3 transition-colors">
                    <PlusIcon className="w-8 h-8 text-gray-600 group-hover:text-indigo-400" />
                  </div>
                  <p className="text-gray-500 group-hover:text-gray-400 text-xs font-light italic">Create New Session</p>
                </button>

                {/* Session Cards */}
                {sessionsData.map((session) => (
                  <div
                    key={session.id}
                    className="bg-[#1a1a1a] border border-gray-800 hover:border-gray-700 rounded-xl overflow-hidden transition-all hover:shadow-xl cursor-pointer group h-[240px] w-full"
                  >
                    {/* Session Thumbnail */}
                    <div className="relative h-[120px] bg-gradient-to-br from-[#1e40af] via-[#2563eb] to-[#3b82f6] overflow-hidden">
                      {/* Card menu */}
                      <div className="absolute top-2 right-2 card-options-menu z-20">
                        <button
                          onClick={(e) => { e.stopPropagation(); setOpenCardMenuId(openCardMenuId === session.id ? null : session.id); }}
                          className="p-1.5 bg-black/30 hover:bg-black/50 rounded-md text-white/80"
                          title="Options"
                        >
                          <ThreeDotsVerticalIcon className="w-4 h-4" />
                        </button>
                        {openCardMenuId === session.id && (
                          <div className="absolute right-0 mt-2 w-36 bg-[#111] border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
                            <button
                              onClick={(e) => { e.stopPropagation(); deleteSession(session.id); }}
                              className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-gray-800 flex items-center gap-2"
                            >
                              <TrashIcon className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                      {/* Colorful shapes pattern - LEFT SIDE */}
                      <div className="absolute left-0 top-0 w-1/2 h-full pointer-events-none">
                        {/* Row 1 */}
                        <div className="absolute top-2 left-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center text-white text-[8px] font-bold shadow-md">B</div>
                        <div className="absolute top-2 left-10 w-5 h-5 bg-orange-500 rounded shadow-md"></div>
                        <div className="absolute top-3 left-16 w-4 h-4 bg-cyan-400 rounded shadow-md"></div>
                        
                        {/* Row 2 */}
                        <div className="absolute top-8 left-2 w-5 h-5 bg-blue-500 rounded shadow-md"></div>
                        <div className="absolute top-7 left-9 w-6 h-6 bg-yellow-400 rounded transform rotate-12 shadow-md"></div>
                        <div className="absolute top-8 left-16 w-5 h-5 bg-purple-500 rounded shadow-md"></div>
                        
                        {/* Row 3 */}
                        <div className="absolute top-14 left-2 w-5 h-5 bg-pink-500 rounded-full shadow-md"></div>
                        <div className="absolute top-13 left-9 w-5 h-5 bg-red-500 rounded shadow-md"></div>
                        <div className="absolute top-14 left-15 w-4 h-4 bg-yellow-300 rounded-full shadow-md"></div>
                      </div>
                      
                      {/* Pink diamond accent - CENTER TOP */}
                      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 pointer-events-none">
                        <div className="w-7 h-7 bg-pink-500 rounded transform rotate-45 shadow-lg"></div>
                      </div>
                      
                      {/* Phone illustration - RIGHT BOTTOM */}
                      <div className="absolute bottom-0 right-0 w-1/2 h-full flex items-end justify-end p-2 pointer-events-none">
                        {/* Blue rectangle frame */}
                        <div className="relative">
                          {/* Outer frame */}
                          <div className="w-20 h-16 bg-[#1e40af] rounded-lg border-2 border-[#1e3a8a] shadow-xl"></div>
                          {/* Inner screen */}
                          <div className="absolute top-1 left-1 right-1 bottom-1 bg-[#2563eb] rounded"></div>
                          {/* Accent line */}
                          <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 border-r-2 border-b-2 border-white/30 rounded-br-lg"></div>
                        </div>
                      </div>
                    </div>

                    {/* Session Info */}
                    <div className="p-3 bg-[#0a0a0a]">
                      {/* Title */}
                      <h3 className="text-white font-bold text-sm mb-2 group-hover:text-indigo-400 transition-colors">
                        {session.title}
                      </h3>
                      {/* Meta Info */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-gray-400 text-[11px]">
                          <CalendarIcon className="w-3 h-3 text-indigo-400" />
                          {/* Use the new DTO fields: month, day, and year */}
                          <span>
                            {session.month} {session.day}, {session.year}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-400 text-[11px]">
                          <ClockIcon className="w-3 h-3 text-indigo-400" />
                          {/* Use the new DTO fields and your existing to12Hour helper */}
                          <span>
                            {to12Hour(session.startTime)} - {to12Hour(session.endTime)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-400 text-[11px]">
                          <LocationIcon className="w-3 h-3 text-indigo-400" />
                          <span>{session.location}</span>
                        </div>
                      </div>
                    </div>


                  </div>
                ))}
              </div>
            )}

          {/* Trashed Sessions Content */}
          {activeTab === 'sessions' && sessionsView === 'trash' && (
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-white text-xl font-bold">Trashed Sessions</h3>
                <button
                  onClick={() => setSessionsView('active')}
                  className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg text-sm"
                >
                  Back to Sessions
                </button>
              </div>
              {trashedSessions.length === 0 ? (
                <div className="bg-[#0a0a0a] border border-gray-700 rounded-2xl p-10 text-center text-gray-400">
                  No trashed sessions. Deleted sessions stay here for 14 days.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {trashedSessions.map((session) => {
                    const msLeft = session.deletedAt ? (session.deletedAt + TRASH_TTL_DAYS * 24 * 60 * 60 * 1000) - Date.now() : 0;
                    const daysLeft = Math.max(0, Math.ceil(msLeft / (24*60*60*1000)));
                    return (
                      <div key={session.id} className="relative bg-[#1a1a1a] border border-gray-800 rounded-xl overflow-hidden">
                        {/* Vertical Restore action */}
                        <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
                          <button onClick={()=>restoreSession(session.id)} className="px-2 py-1 text-xs rounded-lg bg-green-600/20 text-green-300 border border-green-500/40 hover:bg-green-600/30">Restore</button>
                        </div>
                        <div className="relative h-[120px] bg-gradient-to-br from-[#0f172a] via-[#1f2937] to-[#111827]">
                          <span className="absolute top-2 left-2 text-xs px-2 py-1 bg-red-500/20 text-red-300 rounded-full border border-red-500/30">
                            {daysLeft} day{daysLeft!==1?'s':''} left
                          </span>
                        </div>
                        
                        
                        
                        <div className="p-3 bg-[#0a0a0a]">
                            <h3 className="text-white font-bold text-sm mb-2 opacity-70 line-through">{session.title}</h3>
                            <div className="space-y-1 text-gray-500 text-[11px]">
                              <div className="flex items-center gap-1.5">
                                <CalendarIcon className="w-3 h-3 text-indigo-400" />
                                {/* Use the new DTO fields */}
                                <span>
                                  {session.month} {session.day}, {session.year}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <ClockIcon className="w-3 h-3 text-indigo-400" />
                                {/* Use the new DTO fields and your existing to12Hour helper */}
                                <span>
                                  {to12Hour(session.startTime)} - {to12Hour(session.endTime)}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <LocationIcon className="w-3 h-3 text-indigo-400" />
                                {/* Use the correct 'location' field */}
                                <span>{session.location}</span>
                              </div>
                            </div>
                          </div>

                        
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Notes Content Views */}
          {activeTab === 'notes' && notesView === 'all' && (
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
                <button
                  onClick={handleCreateNote}
                  className="bg-[#1a1a1a] border-2 border-dashed border-gray-700 hover:border-indigo-500 rounded-xl flex flex-col items-center justify-center transition-all group hover:bg-[#1f1f1f] h-[240px] w-full"
                >
                  <div className="w-16 h-16 bg-[#2a2a2a] group-hover:bg-indigo-600/20 rounded-full flex items-center justify-center mb-3 transition-colors">
                    <PlusIcon className="w-8 h-8 text-gray-600 group-hover:text-indigo-400" />
                  </div>
                  <p className="text-gray-500 group-hover:text-gray-400 text-xs font-light italic">Create New Note</p>
                </button>
                {notesData.filter(n => !n.archivedAt && !n.deletedAt).map(note => (
                  <div key={note.id} className={`bg-[#1a1a1a] border ${note.isFavourite ? 'border-yellow-400/50' : 'border-gray-800'} hover:border-gray-700 rounded-xl overflow-hidden transition-all hover:shadow-xl h-[240px] w-full flex flex-col`}> 
                    <div className="relative">
                      {/* Note card menu */}
                      <div className="absolute top-2 right-2 card-options-menu z-20">
                        <button
                          onClick={(e) => { e.stopPropagation(); setOpenNoteMenuId(openNoteMenuId === note.id ? null : note.id); }}
                          className="p-1.5 bg-black/30 hover:bg-black/50 rounded-md text-white/80"
                          title="Options"
                        >
                          <ThreeDotsVerticalIcon className="w-4 h-4" />
                        </button>
                        {openNoteMenuId === note.id && (
                          <div className="absolute right-0 mt-2 w-40 bg-[#111] border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleFavouriteNote(note.id); }}
                              className="w-full px-3 py-2 text-left text-sm text-white hover:bg-gray-800 flex items-center gap-2"
                            >
                              {note.isFavourite ? <StarSolidIcon className="w-4 h-4 text-yellow-400" /> : <StarOutlineIcon className="w-4 h-4 text-yellow-400" />}
                              {note.isFavourite ? 'Remove Favourite' : 'Add to Favourites'}
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); archiveNote(note.id); }}
                              className="w-full px-3 py-2 text-left text-sm text-white hover:bg-gray-800 flex items-center gap-2"
                            >
                              <ArchiveIcon className="w-4 h-4" />
                              {note.archivedAt ? 'Unarchive' : 'Archive'}
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                              className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-gray-800 flex items-center gap-2"
                            >
                              <TrashIcon className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        )}
                        {/* Removed corner accent star; inline star near title is sufficient */}
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="text-white font-bold text-sm mb-2 truncate flex items-center gap-1">
                        {note.title}
                        {note.isFavourite && <StarSolidIcon className="w-3 h-3 text-yellow-400" />}
                      </h3>
                      <div className="text-[11px] text-gray-400 mb-2 flex items-center gap-1">
                        <CalendarIcon className="w-3 h-3 text-indigo-400" />
                        <span>{new Date(note.createdAt).toLocaleDateString(undefined,{ month:'short', day:'numeric', year:'numeric'})}</span>
                      </div>
                      <div className="text-xs text-gray-500 line-clamp-5 overflow-hidden" dangerouslySetInnerHTML={{ __html: note.content }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'notes' && notesView === 'favourites' && (
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
              <div className="mb-4 flex items-center justify-between">
                <div className="text-white text-lg font-semibold">Favourite Notes</div>
                <button
                  onClick={() => setNotesView('all')}
                  className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg text-sm"
                >
                  Back to Notes
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
                {notesData.filter(n => n.isFavourite && !n.archivedAt && !n.deletedAt).length === 0 && (
                  <div className="col-span-full bg-[#0a0a0a] border border-gray-700 rounded-xl p-12 text-center text-gray-500 text-sm">No favourite notes yet.</div>
                )}
                {notesData.filter(n => n.isFavourite && !n.archivedAt && !n.deletedAt).map(note => (
                  <div key={note.id} className="bg-[#1a1a1a] border border-yellow-400/50 rounded-xl overflow-hidden h-[240px] w-full flex flex-col">
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="text-white font-bold text-sm mb-2 truncate flex items-center gap-1">{note.title} <StarSolidIcon className="w-3 h-3 text-yellow-400" /></h3>
                      <div className="text-[11px] text-gray-400 mb-2 flex items-center gap-1">
                        <CalendarIcon className="w-3 h-3 text-indigo-400" />
                        <span>{new Date(note.createdAt).toLocaleDateString(undefined,{ month:'short', day:'numeric', year:'numeric'})}</span>
                      </div>
                      <div className="text-xs text-gray-500 line-clamp-5 overflow-hidden" dangerouslySetInnerHTML={{ __html: note.content }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'notes' && notesView === 'archived' && (
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
              <div className="mb-4 flex items-center justify-between">
                <div className="text-white text-lg font-semibold">Archived Notes</div>
                <button
                  onClick={() => setNotesView('all')}
                  className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg text-sm"
                >
                  Back to Notes
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
                {notesData.filter(n => n.archivedAt && !n.deletedAt).map(note => (
                  <div key={note.id} className="relative bg-[#1a1a1a] border border-gray-800 rounded-xl overflow-hidden h-[240px] w-full flex flex-col">
                    {/* Vertical Restore action */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
                      <button onClick={()=>restoreArchivedNote(note.id)} className="px-2 py-1 text-xs rounded-lg bg-green-600/20 text-green-300 border border-green-500/40 hover:bg-green-600/30">Restore</button>
                    </div>
                    <div className="p-4 flex-1 flex flex-col opacity-80">
                      <h3 className="text-white font-bold text-sm mb-2 truncate">{note.title}</h3>
                      <div className="text-[11px] text-gray-400 mb-2 flex items-center gap-1">
                        <CalendarIcon className="w-3 h-3 text-indigo-400" />
                        <span>{new Date(note.createdAt).toLocaleDateString(undefined,{ month:'short', day:'numeric', year:'numeric'})}</span>
                      </div>
                      <div className="text-xs text-gray-500 line-clamp-5 overflow-hidden" dangerouslySetInnerHTML={{ __html: note.content }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'notes' && notesView === 'trashed' && (
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
              <div className="mb-4 flex items-center justify-between">
                <div className="text-white text-lg font-semibold">Trashed Notes</div>
                <button
                  onClick={() => setNotesView('all')}
                  className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg text-sm"
                >
                  Back to Notes
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
                {notesData.filter(n => n.deletedAt).map(note => (
                  <div key={note.id} className="relative bg-[#1a1a1a] border border-gray-800 rounded-xl overflow-hidden h-[240px] w-full flex flex-col">
                    {/* Vertical Restore action */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
                      <button onClick={()=>restoreTrashedNote(note.id)} className="px-2 py-1 text-xs rounded-lg bg-green-600/20 text-green-300 border border-green-500/40 hover:bg-green-600/30">Restore</button>
                    </div>
                    <div className="p-4 flex-1 flex flex-col opacity-60">
                      <h3 className="text-white font-bold text-sm mb-2 truncate line-through">{note.title}</h3>
                      <div className="text-[11px] text-gray-500 mb-2 flex items-center gap-1">
                        <CalendarIcon className="w-3 h-3 text-indigo-400" />
                        <span>{new Date(note.createdAt).toLocaleDateString(undefined,{ month:'short', day:'numeric', year:'numeric'})}</span>
                      </div>
                      <div className="text-xs text-gray-600 line-clamp-5 overflow-hidden" dangerouslySetInnerHTML={{ __html: note.content }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn p-4">
          <div className="bg-[#1a1a1a] border border-gray-700 rounded-2xl p-8 max-w-2xl w-full shadow-2xl animate-slideUp">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Edit Profile</h3>
              <button
                onClick={closeEditModal}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <CloseIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleInputChange}
                  dir="ltr"
                  style={{ direction: 'ltr', unicodeBidi: 'normal', textAlign: 'left' }}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Enter your full name"
                />
              </div>

              {/* School */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  School
                </label>
                <input
                  type="text"
                  name="school"
                  value={editForm.school}
                  onChange={handleInputChange}
                  dir="ltr"
                  style={{ direction: 'ltr', unicodeBidi: 'normal', textAlign: 'left' }}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Enter your school name"
                />
              </div>

              {/* Student ID */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Student ID
                </label>
                <input
                  type="text"
                  name="studentId"
                  value={editForm.studentId}
                  onChange={handleInputChange}
                  dir="ltr"
                  style={{ direction: 'ltr', unicodeBidi: 'normal', textAlign: 'left' }}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Enter your student ID"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={editForm.bio}
                  onChange={handleInputChange}
                  dir="ltr"
                  style={{ direction: 'ltr', unicodeBidi: 'normal', textAlign: 'left' }}
                  rows="4"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={closeEditModal}
                disabled={isEditing}
                className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={saveProfileChanges}
                disabled={isEditing}
                className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isEditing ? (
                  <>
                    <LoadingIcon className="w-5 h-5 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Followers Modal */}
      {showFollowersManager && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-gray-700 rounded-2xl p-6 w-full max-w-2xl shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-white">Manage Followers</h3>
              <button onClick={()=>setShowFollowersManager(false)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                <CloseIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="flex gap-3 mb-5">
              <button onClick={()=>setFollowTab('followers')} className={`px-4 py-2 rounded-xl text-sm border ${followTab==='followers' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'}`}>Followers</button>
              <button onClick={()=>setFollowTab('following')} className={`px-4 py-2 rounded-xl text-sm border ${followTab==='following' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'}`}>Following</button>
            </div>
            <div className="max-h-[55vh] overflow-y-auto custom-scrollbar pr-1 divide-y divide-gray-800">
              {(followTab==='followers' ? followersList : followingList).length === 0 ? (
                <div className="text-gray-400 text-sm p-6 text-center">No {followTab} yet.</div>
              ) : (
                (followTab==='followers' ? followersList : followingList).map(u=> (
                  <div key={u.id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">
                        {u.profilePic ? (
                          <img src={u.profilePic} alt={u.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-gray-300 text-xs font-semibold">{(u.name||'U').charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <div>
                        <div className="text-white text-sm font-medium">{u.name || 'User'}</div>
                        <div className="text-gray-500 text-xs">@{u.id}</div>
                      </div>
                    </div>
                    {followTab==='followers' ? (
                      <button onClick={()=>removeFollower(u.id)} className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-red-300 border border-red-500/30 text-xs">Remove</button>
                    ) : (
                      <button onClick={()=>unfollowUser(u.id)} className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-red-300 border border-red-500/30 text-xs">Unfollow</button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

// Icon Components
const ThreeDotsIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
  </svg>
);

const ThreeDotsVerticalIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
  </svg>
);

const PlusIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const NotesEmptyIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const ClockIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CalendarIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const LocationIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const HistoryIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const BookmarkCheckIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v14l-7-4-7 4V5z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9l2 2 4-4" />
  </svg>
);

const ArchiveIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M5 7V5a2 2 0 012-2h10a2 2 0 012 2v2m0 0v12a2 2 0 01-2 2H7a2 2 0 01-2-2V7m5 4h4" />
  </svg>
);

const StarOutlineIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.173c.969 0 1.371 1.24.588 1.81l-3.378 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.539 1.118l-3.379-2.454a1 1 0 00-1.175 0l-3.379 2.454c-.783.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.952 9.394c-.783-.57-.38-1.81.588-1.81h4.173a1 1 0 00.95-.69l1.386-3.967z" />
  </svg>
);

const StarSolidIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.173c.969 0 1.371 1.24.588 1.81l-3.378 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.539 1.118l-3.379-2.454a1 1 0 00-1.175 0l-3.379 2.454c-.783.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.952 9.394c-.783-.57-.38-1.81.588-1.81h4.173a1 1 0 00.95-.69l1.386-3.967z" />
  </svg>
);

const TrashIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const CloseIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const LoadingIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const EditIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

export default ProfilePage;