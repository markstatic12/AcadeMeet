import React, { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import ProfileCard, { EditProfileModal, FollowersModal } from '../components/profile/ProfileHeader';
import { TabOptionMenu as TabOptionsMenu } from '../components/profile/ProfileNavigation';
import SessionsContent, { TrashedSessionsContent, HistorySessionsContent } from '../components/profile/ProfileSessions';
import { useUser } from '../context/UserContext';
import { useProfilePage } from '../services/ProfileLogic';
import { useSessions } from '../services/ProfileLogic';
import { usePanelHeight } from '../services/CommonUtils';
import { useClickOutside } from '../services/CommonUtils';
import { BackIcon } from '../icons/icons';
import '../styles/profile/ProfilePage.css';

const ProfilePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const fromSearch = location.state?.fromSearch;
  const leftProfileCardRef = useRef(null);
  const rightPanelRef = useRef(null);

  const {
    showEditModal,
    showFollowersManager,
    followTab,
    followersList,
    followingList,
    showProfileOptionsMenu,
    showTabOptionsMenu,
    isEditing,
    sessionsView,
    openCardMenuId,
    userData,
    editForm,
    setShowEditModal,
    setShowFollowersManager,
    setFollowTab,
    setShowProfileOptionsMenu,
    setShowTabOptionsMenu,
    setSessionsView,
    setOpenCardMenuId,
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
  } = useProfilePage();

  const { sessionsData, trashedSessions, historySessions, deleteSession, restoreSession, refreshHistory } = useSessions();
  const panelHeight = usePanelHeight(leftProfileCardRef, [userData, showEditModal, showProfileOptionsMenu]);

  useClickOutside([
    {
      condition: showProfileOptionsMenu,
      selector: '.profile-options-menu',
      callback: () => setShowProfileOptionsMenu(false),
    },
    {
      condition: showTabOptionsMenu,
      selector: '.tab-options-menu',
      callback: () => setShowTabOptionsMenu(false),
    },
    {
      condition: openCardMenuId,
      selector: '.card-options-menu',
      callback: () => setOpenCardMenuId(null),
    },
  ]);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex items-center gap-4">
          {fromSearch && (
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 hover:border-gray-600/50 flex items-center justify-center transition-all duration-200 group"
              aria-label="Go back"
            >
              <BackIcon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            </button>
          )}
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
              <svg className="w-5 h-5 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            My Profile
          </h1>
        </div>
      </div>
      <div className="flex gap-6 h-[calc(100vh-180px)]">
        <div className="w-[280px] opacity-0 animate-fadeSlideUp" style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}>
          <ProfileCard
            ref={leftProfileCardRef}
            userData={userData}
            onManageFollowers={openFollowersManager}
          />
        </div>

        <div className="flex-1 relative z-0 opacity-0 animate-fadeSlideUp" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
          <div className="relative bg-[#161A2B] border border-indigo-900/40 rounded-2xl shadow-2xl shadow-indigo-950/30 transition-all hover:shadow-indigo-500/40 hover:border-indigo-500/60 h-full flex flex-col">
            <div className="relative flex flex-col h-full overflow-hidden">
            {/* Full width label header */}
            <div className="flex-shrink-0 p-6 relative">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950/40 via-purple-950/30 to-indigo-950/40 backdrop-blur-xl border border-indigo-500/20 px-8 py-5 shadow-xl">
                {/* Animated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/15 to-indigo-500/10 animate-gradient-x"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
                
                {/* Glowing edges */}
                <div className="absolute inset-0 rounded-2xl">
                  <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent"></div>
                  <div className="absolute bottom-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent"></div>
                </div>
                
                <h2 className="relative text-2xl font-bold bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent tracking-tight flex items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600/30 to-purple-600/30 border-2 border-indigo-400/30 flex items-center justify-center shadow-lg shadow-indigo-500/20 backdrop-blur-sm">
                    <svg className="w-5 h-5 text-indigo-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  My Study Sessions
                </h2>
              </div>
              
              {/* Tab Options Menu positioned absolutely outside overflow-hidden container */}
              <div className="absolute top-10 right-10 z-50">
                <TabOptionsMenu
                    showMenu={showTabOptionsMenu}
                    onToggle={toggleTabOptionsMenu}
                    onHistoryClick={() => {
                      setSessionsView('history');
                      setShowTabOptionsMenu(false);
                      refreshHistory();
                    }}
                    onTrashClick={() => {
                      setSessionsView('trash');
                      setShowTabOptionsMenu(false);
                    }}
                  />
              </div>
            </div>

            {sessionsView === 'active' && (
              <SessionsContent
                sessionsData={sessionsData}
                openCardMenuId={openCardMenuId}
                onCreateSession={handleCreateSession}
                onMenuToggle={setOpenCardMenuId}
                onDeleteSession={deleteSession}
              />
            )}

            {sessionsView === 'trash' && (
              <TrashedSessionsContent
                trashedSessions={trashedSessions}
                onRestore={restoreSession}
                onBackToSessions={() => setSessionsView('active')}
              />
            )}

            {sessionsView === 'history' && (
              <HistorySessionsContent
                historySessions={historySessions}
                onBackToSessions={() => setSessionsView('active')}
              />
            )}

            </div>
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={showEditModal}
        editForm={editForm}
        isEditing={isEditing}
        onInputChange={handleInputChange}
        onClose={closeEditModal}
        onSave={saveProfileChanges}
      />

      <FollowersModal
        isOpen={showFollowersManager}
        followTab={followTab}
        followersList={followersList}
        followingList={followingList}
        onClose={() => setShowFollowersManager(false)}
        onTabChange={setFollowTab}
        onRemoveFollower={removeFollower}
        onUnfollow={unfollowUser}
      />
    </DashboardLayout>
  );
};

export default ProfilePage;
