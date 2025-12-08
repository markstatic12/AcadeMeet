import React, { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import ProfileCard, { EditProfileModal, FollowersModal } from '../components/profile/ProfileHeader';
import TabButtons, { TabOptionMenu as TabOptionsMenu } from '../components/profile/ProfileNavigation';
import SessionsContent, { TrashedSessionsContent, HistorySessionsContent } from '../components/profile/ProfileSessions';
import { NotesContent } from '../components/profile/ProfileNotes';
import { useUser } from '../context/UserContext';
import { useProfilePage } from '../services/ProfileLogic';
import { useSessions } from '../services/ProfileLogic';
import { useNotes } from '../services/ProfileLogic';
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
    activeTab,
    sessionsView,
    openCardMenuId,
    userData,
    editForm,
    setShowEditModal,
    setShowFollowersManager,
    setFollowTab,
    setShowProfileOptionsMenu,
    setShowTabOptionsMenu,
    setActiveTab,
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
  const { notesData } = useNotes();
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
          <div
            ref={rightPanelRef}
            className="h-full relative flex flex-col"
          >
            <div className="relative flex flex-col h-full">
            <div className="flex items-center justify-between mb-6 flex-shrink-0 px-1">
              <TabButtons 
                activeTab={activeTab} 
                onTabChange={setActiveTab} 
              />
              {activeTab === 'sessions' && (
                <TabOptionsMenu
                  showMenu={showTabOptionsMenu}
                  activeTab={activeTab}
                  onToggle={toggleTabOptionsMenu}
                  onHistoryClick={() => {
                    setActiveTab('sessions');
                    setSessionsView('history');
                    setShowTabOptionsMenu(false);
                    refreshHistory();
                  }}
                  onTrashClick={() => {
                    setActiveTab('sessions');
                    setSessionsView('trash');
                    setShowTabOptionsMenu(false);
                  }}
                />
              )}
            </div>

            {activeTab === 'sessions' && sessionsView === 'active' && (
              <SessionsContent
                sessionsData={sessionsData}
                openCardMenuId={openCardMenuId}
                onCreateSession={handleCreateSession}
                onMenuToggle={setOpenCardMenuId}
                onDeleteSession={deleteSession}
              />
            )}

            {activeTab === 'sessions' && sessionsView === 'trash' && (
              <TrashedSessionsContent
                trashedSessions={trashedSessions}
                onRestore={restoreSession}
                onBackToSessions={() => setSessionsView('active')}
              />
            )}

            {activeTab === 'sessions' && sessionsView === 'history' && (
              <HistorySessionsContent
                historySessions={historySessions}
                onBackToSessions={() => setSessionsView('active')}
              />
            )}

            {activeTab === 'notes' && (
              <NotesContent notesData={notesData} />
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
