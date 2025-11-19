import React from 'react';
import RemindersSection from './RemindersSection';
import NotesSection from './NotesSection';

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
