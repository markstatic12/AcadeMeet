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
    bio: 'No bio yet',
    followers: 24,
    following: 12,
    isOnline: true
  };

  return (
    <DashboardLayout>
    <h1 className="text-2xl font-bold text-white mb-6">My Profile</h1>
      <div className="p-6 flex flex-col md:flex-row gap-6">
        {/* Left Side Tab - Profile Information */}
        <div className="md:w-1/3">          
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-start gap-6">
              {/* Profile Image */}
              <div className="relative">
                <div className="w-24 h-24 bg-gray-700 rounded-full">
                  {/* Placeholder for profile image */}
                </div>
                {userData.isOnline && (
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white">{userData.name}</h2>
                <p className="text-gray-400">
                  {userData.school}, {userData.program}, {userData.studentId}
                </p>
                <p className="text-gray-400 mt-2">{userData.bio}</p>
                
                <div className="flex gap-8 mt-4">
                  <div>
                    <p className="font-bold text-white">{userData.followers}</p>
                    <p className="text-gray-400">Followers</p>
                  </div>
                  <div>
                    <p className="font-bold text-white">{userData.following}</p>
                    <p className="text-gray-400">Following</p>
                  </div>
                </div>
              </div>
            </div>
            
            <Button 
              className="mt-4 w-full md:w-auto"
              variant="secondary"
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
            {activeTab === 'sessions' ? (
              <div className="bg-gray-800 rounded-lg p-6 flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-6xl mb-4 text-white">+</div>
                  <p className="text-gray-400">Create New Session</p>
                </div>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg p-6 flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-6xl mb-4 text-white">+</div>
                  <p className="text-gray-400">Select or Drag and Drop a File to Upload</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;