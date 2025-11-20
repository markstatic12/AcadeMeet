import React from 'react';
import RemindersSection from './Reminders';
import NotesSection from './Notes';

const RightSidebar = ({ 
  reminders,
  activeNotesTab,
  onNotesTabChange,
  notes,
  notesLoading,
  notesError
}) => {
  return (
    <div className="space-y-6">
      <RemindersSection reminders={reminders} />
      
      <NotesSection
        activeTab={activeNotesTab}
        onTabChange={onNotesTabChange}
        notes={notes}
        loading={notesLoading}
        error={notesError}
      />
    </div>
  );
};

export default RightSidebar;
