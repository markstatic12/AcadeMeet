import React, { useRef } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import ProfileCard, { EditProfileModal, FollowersModal } from '../components/profile/ProfileHeader';
import TabButtons, { TabOptionMenu as TabOptionsMenu } from '../components/profile/ProfileNavigation';
import SessionsContent, { TrashedSessionsContent } from '../components/profile/ProfileSessions';
import NotesContent, { FavouritesContent, TrashedNotesContent } from '../components/profile/ProfileNotes';
import { useUser } from '../context/UserContext';
import { useProfilePage } from '../services/ProfileLogic';
import { useSessions } from '../services/ProfileLogic';
import { useNotes } from '../services/ProfileLogic';
import { usePanelHeight } from '../services/CommonUtils';
import { useClickOutside } from '../services/CommonUtils';
import '../styles/profile/ProfilePage.css';

const ProfilePage = () => {
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
    notesView,
    openNoteMenuId,
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
    setNotesView,
    setOpenNoteMenuId,
    setOpenCardMenuId,
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
  } = useProfilePage();

  const { getUserId } = useUser();
  const userId = getUserId();
  const { sessionsData, trashedSessions, deleteSession, restoreSession, TRASH_TTL_DAYS } = useSessions(userId);
  const { notesData, toggleFavouriteNote, refreshNotes, trashedNotes, deleteNote, restoreNote, getTrashedNotes } = useNotes(activeTab, userId);
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
      <h1 className="text-2xl font-bold text-white mb-6">My Profile</h1>
      <div className="flex gap-6">
        <div className="w-[350px]">
          <ProfileCard
            ref={leftProfileCardRef}
            userData={userData}
            onManageFollowers={openFollowersManager}
          />
        </div>

        <div className="flex-1 relative z-0">
          <div
            ref={rightPanelRef}
            style={panelHeight ? { height: panelHeight } : undefined}
            className="bg-[#1f1f1f] border border-gray-800 rounded-2xl overflow-hidden shadow-xl p-6 flex flex-col"
          >
            <div className="flex items-center justify-between mb-6 flex-shrink-0">
              <TabButtons 
                activeTab={activeTab} 
                onTabChange={(tab) => {
                  setActiveTab(tab);
                  if (tab === 'notes') setNotesView('all');
                }} 
              />
              <TabOptionsMenu
                showMenu={showTabOptionsMenu}
                activeTab={activeTab}
                onToggle={toggleTabOptionsMenu}
                onTrashClick={() => {
                  if (activeTab === 'sessions') {
                    setSessionsView('trash');
                  } else {
                    setNotesView('trash');
                  }
                  setShowTabOptionsMenu(false);
                }}
              />
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
                TRASH_TTL_DAYS={TRASH_TTL_DAYS}
                onRestore={restoreSession}
                onBackToSessions={() => setSessionsView('active')}
              />
            )}

            {activeTab === 'notes' && notesView === 'all' && (
              <NotesContent
                notesData={notesData}
                openNoteMenuId={openNoteMenuId}
                onCreateNote={(createdNote) => {
                  handleCreateNote(createdNote);
                  refreshNotes();
                }}
                onMenuToggle={setOpenNoteMenuId}
                onDelete={async (noteId, title) => {
                  if (window.confirm(`Delete "${title}"? It will be moved to trash.`)) {
                    await deleteNote(noteId);
                    refreshNotes();
                    setOpenNoteMenuId(null);
                  }
                }}
              />
            )}
            {activeTab === 'notes' && notesView === 'trash' && (
              <TrashedNotesContent
                trashedNotes={trashedNotes}
                loading={false}
                onRestore={async (noteId, title) => {
                  await restoreNote(noteId);
                  refreshNotes();
                }}
                onBackToNotes={() => setNotesView('all')}
              />
            )}
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
