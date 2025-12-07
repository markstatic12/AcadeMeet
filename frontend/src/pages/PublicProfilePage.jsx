import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { PublicProfileCard } from '../components/profile/PublicProfileCard';
import { PublicProfileContent } from '../components/profile/PublicProfileContent';
import { useUser } from '../context/UserContext';
import { mockUsers } from '../data/mockData';
import '../styles/profile/ProfilePage.css';

const PublicProfilePage = () => {
  const { userId } = useParams();
  const { user: currentUser } = useUser();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('about'); // 'about', 'schedule'

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await userService.getUserProfile(userId);
      
      // Find user from mock data based on userId from URL params
      const foundUser = mockUsers.find(user => user.id === parseInt(userId));
      
      if (foundUser) {
        // Use the complete user data from mockUsers
        setUserData({
          ...foundUser,
          profilePic: foundUser.profileImageUrl,
          coverImage: foundUser.coverImageUrl
        });
        // Check if current user is following this user
        setIsFollowing(false); // TODO: Get from API
      } else {
        // Fallback to default mock user if not found
        setUserData({
          id: userId,
          name: 'User Not Found',
          school: 'CIT University',
          program: 'Unknown',
          yearLevel: 1,
          bio: 'This user profile is not available.',
          profilePic: null,
          coverImage: null,
          isOnline: false,
          followersCount: 0,
          followingCount: 0,
          isMentor: false,
          rating: 0,
          totalReviews: 0,
          completedSessions: 0
        });
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      // TODO: API call to follow/unfollow
      setIsFollowing(!isFollowing);
      // Update followers count
      setUserData(prev => ({
        ...prev,
        followersCount: isFollowing ? prev.followersCount - 1 : prev.followersCount + 1
      }));
    } catch (error) {
      console.error('Failed to follow/unfollow:', error);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[calc(100vh-180px)]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading profile...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!userData) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[calc(100vh-180px)]">
          <div className="text-center">
            <div className="text-6xl mb-4">👤</div>
            <h2 className="text-2xl font-bold text-white mb-2">User Not Found</h2>
            <p className="text-gray-400">The profile you're looking for doesn't exist.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
            <svg className="w-5 h-5 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          User Profile
        </h1>
      </div>

      <div className="flex gap-6 h-[calc(100vh-180px)]">
        {/* Left Sidebar - Identity Card */}
        <div className="w-[280px] opacity-0 animate-fadeSlideUp" style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}>
          <PublicProfileCard
            userData={userData}
            isFollowing={isFollowing}
            onFollow={handleFollow}
          />
        </div>

        {/* Right Panel - Portfolio Feed */}
        <div className="flex-1 relative z-0 opacity-0 animate-fadeSlideUp" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
          <PublicProfileContent
            userData={userData}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PublicProfilePage;
