import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { PublicProfileCard } from '../components/profile/PublicProfileCard';
import { PublicProfileContent } from '../components/profile/PublicProfileContent';
import { useUser } from '../context/UserContext';
import api from '../services/apiClient';
import { BackIcon } from '../icons/icons';
import '../styles/profile/ProfilePage.css';

const PublicProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useUser(); // Get user from context
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('about'); // 'about', 'schedule'

  // Get current user ID from context
  const currentUserId = currentUser?.id;

  // Check if viewing self and redirect to own profile
  useEffect(() => {
    if (currentUserId && userId && parseInt(userId) === currentUserId) {
      navigate('/profile', { replace: true, state: { fromSearch: true } });
    }
  }, [userId, currentUserId, navigate]);

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      
      // Fetch user profile from API
      const response = await api.get(`/users/${userId}`);
      const data = response.data;
        setUserData({
          id: data.id,
          name: data.name,
          email: data.email,
          school: 'CIT University', // Default school
          program: data.program,
          yearLevel: data.yearLevel,
          bio: data.bio || 'No bio yet',
          profilePic: data.profilePic || data.profileImageUrl,
          coverImage: data.coverImage || data.coverImageUrl,
          isOnline: false, // TODO: Implement online status
          followersCount: data.followers || 0,
          followingCount: data.following || 0,
          isMentor: false, // TODO: Implement mentor status
          rating: 0, // TODO: Implement rating
          totalReviews: 0, // TODO: Implement reviews
          completedSessions: 0 // TODO: Implement completed sessions count
        });
        
        // Check if current user is following this user
        await checkFollowStatus();
    } catch (error) {
      console.error('Failed to load user profile:', error);
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
    } finally {
      setLoading(false);
    }
  };

  const checkFollowStatus = async () => {
    try {
      const response = await api.get(`/users/${userId}/is-following`);
      const data = response.data;
      setIsFollowing(data.isFollowing || false);
    } catch (error) {
      console.error('Failed to check follow status:', error);
      setIsFollowing(false);
    }
  };

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        // Unfollow
        await api.delete(`/users/${userId}/follow`);
        setIsFollowing(false);
        setUserData(prev => ({
          ...prev,
          followersCount: Math.max(0, prev.followersCount - 1)
        }));
        
        // Dispatch custom event to notify ProfilePage to refresh
        window.dispatchEvent(new CustomEvent('user-follow-changed'));
      } else {
        // Follow
        await api.post(`/users/${userId}/follow`);
        setIsFollowing(true);
        setUserData(prev => ({
          ...prev,
          followersCount: prev.followersCount + 1
        }));
        
        // Dispatch custom event to notify ProfilePage to refresh
        window.dispatchEvent(new CustomEvent('user-follow-changed'));
      }
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
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 hover:border-gray-600/50 flex items-center justify-center transition-all duration-200 group"
            aria-label="Go back"
          >
            <BackIcon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
          </button>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
              <svg className="w-5 h-5 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            User Profile
          </h1>
        </div>
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
