import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import Button from '../components/ui/Button';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // User data from localStorage (initially)
  const [userData, setUserData] = useState({
    id: null,
    name: '',
    email: '',
    school: '',
    program: '',
    studentId: '',
    bio: 'No bio yet',
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
        name: student.name || 'User',
        email: student.email || '',
        school: 'CIT University',
        program: 'BSIT',
        studentId: '23-2684-947',
        bio: student.bio || 'No bio yet',
        followers: 0,
        following: 0,
        isOnline: true
      });
    }
  }, []);

  // Sample sessions data (empty initially)
  const sessionsData = [];

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
  const toggleOptionsMenu = () => {
    setShowOptionsMenu(!showOptionsMenu);
  };

  // Close options menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showOptionsMenu && !event.target.closest('.options-menu')) {
        setShowOptionsMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showOptionsMenu]);

  // Navigate to create session
  const handleCreateSession = () => {
    console.log('Navigating to sessions page...');
    navigate('/sessions');
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
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Side - Profile Information */}
        <div className="lg:w-1/3">          
          <div className="bg-[#1f1f1f] border border-gray-800 rounded-2xl p-6 shadow-xl">
            {/* Profile Image with Online Status */}
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                {/* Placeholder for profile image - show initials */}
                <span className="text-4xl font-bold text-white">
                  {userData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              </div>
              {userData.isOnline && (
                <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 rounded-full border-4 border-[#1f1f1f]"></div>
              )}
            </div>

            {/* Profile Info */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">{userData.name}</h2>
              <p className="text-gray-400 text-sm">
                {userData.school}, {userData.program}, {userData.studentId}
              </p>
            </div>

            {/* Bio */}
            <div className="mb-6">
              <p className="text-gray-300 text-sm bg-gray-800/50 border border-gray-700 rounded-lg p-3 min-h-[80px]">
                {userData.bio}
              </p>
            </div>
            
            {/* Followers & Following */}
            <div className="flex justify-center gap-12 mb-6 py-4 border-y border-gray-800">
              <div className="text-center">
                <p className="text-2xl font-bold text-white mb-1">{userData.followers}</p>
                <p className="text-gray-400 text-sm">Followers</p>
              </div>
              <div className="w-px bg-gray-800"></div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white mb-1">{userData.following}</p>
                <p className="text-gray-400 text-sm">Following</p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-xl transition-colors shadow-lg shadow-indigo-500/20"
              >
                Manage Followers
              </Button>
              <div className="relative options-menu">
                <button
                  onClick={toggleOptionsMenu}
                  className="p-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-xl transition-colors"
                  title="Options"
                >
                  <ThreeDotsIcon className="w-5 h-5" />
                </button>
                
                {/* Dropdown Menu */}
                {showOptionsMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#1a1a1a] border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-slideDown">
                    <button
                      onClick={() => {
                        openEditModal();
                        setShowOptionsMenu(false);
                      }}
                      className="w-full px-4 py-3 text-left text-white hover:bg-gray-800 transition-colors flex items-center gap-3"
                    >
                      <EditIcon className="w-4 h-4" />
                      Edit Profile
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Sessions and Notes */}
        <div className="lg:w-2/3">
          {/* Tab Buttons */}
          <div className="flex gap-3 mb-6">
            <button
              className="px-8 py-3 rounded-xl font-medium transition-all bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
            >
              Sessions
            </button>
            <button
              className="px-8 py-3 rounded-xl font-medium transition-all bg-[#1f1f1f] text-gray-400 hover:text-white hover:bg-gray-800 border border-gray-800"
              onClick={() => navigate('/notes')}
            >
              Notes
            </button>
            <div className="relative ml-auto options-menu">
              <button
                onClick={toggleOptionsMenu}
                className="p-3 bg-[#1f1f1f] text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-colors border border-gray-800"
                title="More options"
              >
                <ThreeDotsIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Dynamic Content Area */}
          <div className="min-h-[500px]">
            {/* Sessions Content */}
            <div className="block">
              {sessionsData.length === 0 ? (
                <div className="bg-[#1f1f1f] border border-gray-800 rounded-2xl p-12 flex flex-col items-center justify-center h-[500px]">
                  <div className="w-24 h-24 bg-indigo-600/10 rounded-full flex items-center justify-center mb-6">
                    <PlusIcon className="w-12 h-12 text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">No Sessions Yet</h3>
                  <p className="text-gray-400 mb-6 text-center max-w-md">
                    Create your first study session and start collaborating with others
                  </p>
                  <button 
                    onClick={handleCreateSession}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors shadow-lg shadow-indigo-500/20 flex items-center gap-2"
                  >
                    <PlusIcon className="w-5 h-5" />
                    Create New Session
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sessionsData.map((session) => (
                    <div key={session.id} className="bg-[#1f1f1f] border border-gray-800 rounded-xl p-6">
                      {/* Session card content */}
                    </div>
                  ))}
                </div>
              )}
            </div>
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
    </DashboardLayout>
  );
};

// Icon Components
const ThreeDotsIcon = ({ className }) => (
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