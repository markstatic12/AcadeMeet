import React, { useRef } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import ProfileCard, { EditProfileModal, FollowersModal } from '../components/profile/ProfileHeader';
import TabButtons, { TabOptionMenu as TabOptionsMenu } from '../components/profile/ProfileNavigation';
import SessionsContent, { TrashedSessionsContent } from '../components/profile/ProfileSessions';
import NotesContent, { FavouritesContent, ArchivedContent, TrashedNotesContent } from '../components/profile/ProfileNotes';
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
    openFollowersManager,
    removeFollower,
    unfollowUser,
  } = useProfilePage();

  const { sessionsData, trashedSessions, deleteSession, restoreSession } = useSessions();
  const { notesData, toggleFavouriteNote, archiveNote, deleteNote, restoreTrashedNote, restoreArchivedNote } = useNotes(activeTab);
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
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
            <svg className="w-5 h-5 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          My Profile
        </h1>
      </div>
      <div className="flex gap-6 h-[calc(100vh-180px)]">
        <div className="w-[280px]">
          <ProfileCard
            ref={leftProfileCardRef}
            userData={userData}
            onManageFollowers={openFollowersManager}
          />
        </div>

        <div className="flex-1 relative z-0">
          <div
            ref={rightPanelRef}
            className="h-full relative bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 rounded-2xl overflow-hidden shadow-2xl p-6 flex flex-col transition-all hover:border-gray-600 group"
          >
            {/* Decorative background elements - subtle */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col h-full">
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
                  setActiveTab('sessions');
                  setSessionsView('trash');
                  setShowTabOptionsMenu(false);
                }}
                onFavouritesClick={() => {
                  setActiveTab('notes');
                  setNotesView('favourites');
                  setShowTabOptionsMenu(false);
                }}
                onArchivedClick={() => {
                  setActiveTab('notes');
                  setNotesView('archived');
                  setShowTabOptionsMenu(false);
                }}
                onTrashedClick={() => {
                  setActiveTab('notes');
                  setNotesView('trashed');
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
                onRestore={restoreSession}
                onBackToSessions={() => setSessionsView('active')}
              />
            )}

            {activeTab === 'notes' && notesView === 'all' && (
              <NotesContent
                notesData={notesData}
                openNoteMenuId={openNoteMenuId}
                onMenuToggle={setOpenNoteMenuId}
                onToggleFavourite={(id) => {
                  toggleFavouriteNote(id);
                  setOpenNoteMenuId(null);
                }}
                onArchive={(id) => {
                  archiveNote(id);
                  setOpenNoteMenuId(null);
                }}
                onDelete={(id) => {
                  deleteNote(id);
                  setOpenNoteMenuId(null);
                }}
              />
            )}
            {activeTab === 'notes' && notesView === 'favourites' && (
              <FavouritesContent
                notesData={notesData}
                onBackToNotes={() => setNotesView('all')}
              />
            )}
            {activeTab === 'notes' && notesView === 'archived' && (
              <ArchivedContent
                notesData={notesData}
                onBackToNotes={() => setNotesView('all')}
                onRestore={restoreArchivedNote}
              />
            )}
            {activeTab === 'notes' && notesView === 'trashed' && (
              <TrashedNotesContent
                notesData={notesData}
                onBackToNotes={() => setNotesView('all')}
                onRestore={restoreTrashedNote}
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
