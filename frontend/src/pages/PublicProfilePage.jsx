import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { PublicProfileCard } from '../components/profile/PublicProfileCard';
import { PublicProfileContent } from '../components/profile/PublicProfileContent';
import { useUser } from '../context/UserContext';
import '../styles/profile/ProfilePage.css';

const PublicProfilePage = () => {
  const { userId } = useParams();
  const { user: currentUser } = useUser();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('about'); // 'about', 'schedule', 'reviews'

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await userService.getUserProfile(userId);
      
      // Mock data for now
      const mockUser = {
        id: userId,
        name: 'Sarah Johnson',
        school: 'CIT University',
        program: 'Computer Science',
        yearLevel: 3,
        bio: 'Passionate about machine learning and data science. Love helping others understand complex algorithms through practical examples. Available for study sessions and project collaboration.',
        profilePic: null,
        coverImage: null,
        isOnline: true,
        followersCount: 234,
        followingCount: 189,
        isMentor: true,
        rating: 4.8,
        totalReviews: 47,
        completedSessions: 89,
        featuredSession: {
          id: 1,
          title: 'Introduction to Machine Learning with Python',
          description: 'Learn the fundamentals of ML algorithms and practical implementation',
          participants: 12,
          maxParticipants: 15,
          tags: ['Python', 'Machine Learning', 'Data Science'],
          rating: 4.9
        }
      };
      
      setUserData(mockUser);
      // Check if current user is following this user
      setIsFollowing(false); // TODO: Get from API
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

  const handleMessage = () => {
    // TODO: Navigate to messaging or open chat
    console.log('Open message to user:', userId);
  };

  const handleBookSession = () => {
    // TODO: Navigate to session booking
    console.log('Book session with user:', userId);
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
            onMessage={handleMessage}
            onBookSession={handleBookSession}
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
