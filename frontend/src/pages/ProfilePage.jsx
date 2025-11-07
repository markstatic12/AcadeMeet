import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import Button from '../components/ui/Button';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('sessions');
  
  // Placeholder user data - this should come from your auth context or API
  const userData = {
    name: 'Zander Aligato',
    school: 'CIT University',
    program: 'BSIT',
    studentId: '23-2684-947',
    bio: 'This is my bio...',
    followers: 24,
    following: 12,
    isOnline: true
  };

  // Sample notes data
  const notesData = [
    {
      id: 1,
      title: 'Introduction to Springboot',
      createdAt: '09/31/2025',
      tags: ['Springboot'],
      preview: 'Introduction to'
    }
  ];

  // Handle tab switching
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <DashboardLayout>
    <h1 className="text-2xl font-bold text-white mb-6">My Profile</h1>
      <div className="p-2 flex flex-col md:flex-row gap-10">
        {/* Left Side Tab - Profile Information */}
        <div className="md:w-1/4">          
          <div className="bg-gray-800 rounded-lg p-6">
            {/* Profile Image with Online Status */}
            <div className="relative w-32 h-32 mb-4">
              <div className="w-full h-full bg-gray-700 rounded-full overflow-hidden">
                {/* Placeholder for profile image */}
              </div>
              {userData.isOnline && (
                <div className="absolute top-1 right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
              )}
            </div>

            {/* Profile Info - Centered */}
            <div className="text-left mb-6">
              <h2 className="text-xl font-bold text-white">{userData.name}</h2>
              <p className="text-gray-400 text-sm mt-1">
                {userData.school}, {userData.program}, {userData.studentId}
              </p>
              <p className="text-gray-400 mt-4 mb-6 border border-gray-600 rounded-md p-2">{userData.bio}</p>
              
              <div className="flex justify-center gap-12 my-6">
                <div className="text-center">
                  <p className="text-gray-400 text-sm">Followers</p>
                  <p className="text-xl font-bold text-white">{userData.followers}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-sm">Following</p>
                  <p className="text-xl font-bold text-white">{userData.following}</p>
                </div>
              </div>
            </div>
            
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition-colors"
            >
              Manage Followers
            </Button>
          </div>
        </div>

        {/* Right Side Tab - Sessions and Notes */}
        <div className="md:w-2/3">
          <div className="flex gap-4 mb-6">
            <button
              className={`px-6 py-2 rounded-md ${
                activeTab === 'sessions'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400'
              }`}
              onClick={() => setActiveTab('sessions')}
            >
              Sessions
            </button>
            <button
              className={`px-6 py-2 rounded-md ${
                activeTab === 'notes'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400'
              }`}
              onClick={() => setActiveTab('notes')}
            >
              Notes
            </button>
          </div>

          {/* Dynamic Content Area */}
          <div className="min-h-[400px]">
            {/* Sessions Content */}
            <div className={`${activeTab === 'sessions' ? 'block' : 'hidden'}`}>
              <div className="bg-gray-800 rounded-lg p-6 flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-6xl mb-4 text-white">+</div>
                  <p className="text-gray-400">Create New Session</p>
                </div>
              </div>
            </div>

            {/* Notes Content */}
            <div className={`${activeTab === 'notes' ? 'block' : 'hidden'}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Upload Card */}
                <div className="bg-gray-800 rounded-lg p-6 flex items-center justify-center aspect-square">
                  <div className="text-center">
                    <div className="text-6xl mb-4 text-white">+</div>
                    <p className="text-gray-400">Select or Drag and Drop a File to Upload</p>
                  </div>
                </div>

                {/* Notes Cards */}
                {notesData.map((note) => (
                  <div key={note.id} className="bg-white rounded-lg overflow-hidden">
                    <div className="p-4">
                      <h3 className="text-black font-bold text-lg">{note.title}</h3>
                      {note.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="inline-block bg-blue-600 text-white text-xs px-2 py-1 rounded-md mt-2"
                        >
                          {tag}
                        </span>
                      ))}
                      <p className="text-gray-600 text-sm mt-2">{note.preview}</p>
                    </div>
                    <div className="bg-gray-100 px-4 py-2 text-xs text-gray-500">
                      created on {note.createdAt}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          </div>
        </div>
    </DashboardLayout>
  );
};

export default ProfilePage;