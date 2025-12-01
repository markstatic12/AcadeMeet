import React from 'react';
import SessionStatusBadge from '../ui/SessionStatusBadge';
import { CalendarIcon, ClockIcon, LocationIcon, UserIcon, UsersIcon, LockIcon, GlobeIcon, DocumentIcon } from '../../icons';

// Read-only Session Profile Display
export const SessionProfileDisplay = ({ session }) => {
  return (
    <div className="relative">
      <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center overflow-hidden">
        <svg className="w-16 h-16 text-indigo-400" fill="currentColor">
          <path d="M4 5h13v7h2V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h8v-2H4V5zm16 10l-4-4v3H9v2h7v3l4-4z" />
        </svg>
      </div>
      {/* Status Badge positioned on profile */}
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
        <SessionStatusBadge status={session?.status || 'ACTIVE'} />
      </div>
    </div>
  );
};

// Read-only Session Title Display
export const SessionTitleDisplay = ({ title }) => {
  return (
    <div className="flex-1">
      <h1 className="text-4xl font-bold text-white">
        {title || 'Untitled Session'}
      </h1>
    </div>
  );
};

// Read-only Session Header
export const SessionViewHeader = ({ session }) => {
  return (
    <div className="flex items-center gap-6 mb-12">
      <SessionProfileDisplay session={session} />
      <SessionTitleDisplay title={session?.title} />
    </div>
  );
};

// Read-only Date Display
export const DateDisplay = ({ month, day, year }) => {
  const formatDate = () => {
    if (!month || !day || !year) return 'Date not set';
    return `${month} ${day}, ${year}`;
  };

  return (
    <div className="mb-4 flex items-center gap-3 text-gray-300">
      <CalendarIcon className="w-4 h-4 text-indigo-400 flex-shrink-0" />
      <span className="text-sm">{formatDate()}</span>
    </div>
  );
};

// Read-only Time Display
export const TimeDisplay = ({ startTime, endTime }) => {
  const formatTime = () => {
    if (!startTime || !endTime) return 'Time not set';
    return `${startTime} - ${endTime}`;
  };

  return (
    <div className="mb-4 flex items-center gap-3 text-gray-300">
      <ClockIcon className="w-4 h-4 text-indigo-400 flex-shrink-0" />
      <span className="text-sm">{formatTime()}</span>
    </div>
  );
};

// Read-only Location Display
export const LocationDisplay = ({ location }) => {
  return (
    <div className="mb-4 flex items-center gap-3 text-gray-300">
      <LocationIcon className="w-4 h-4 text-indigo-400 flex-shrink-0" />
      <span className="text-sm">{location || 'Location not specified'}</span>
    </div>
  );
};

// Read-only Session Type Display
export const SessionTypeDisplay = ({ sessionType }) => {
  const isPrivate = sessionType === 'PRIVATE';
  
  return (
    <div className="mb-4 flex items-center gap-3 text-gray-300">
      {isPrivate ? (
        <LockIcon className="w-4 h-4 text-yellow-400 flex-shrink-0" />
      ) : (
        <GlobeIcon className="w-4 h-4 text-green-400 flex-shrink-0" />
      )}
      <span className="text-sm">{isPrivate ? 'Private Session' : 'Public Session'}</span>
    </div>
  );
};

// Read-only Participants Display
export const ParticipantsDisplay = ({ currentParticipants, maxParticipants }) => {
  if (!maxParticipants) return null;
  
  return (
    <div className="mb-4 flex items-center gap-3 text-gray-300">
      <UsersIcon className="w-4 h-4 text-indigo-400 flex-shrink-0" />
      <span className="text-sm">{currentParticipants || 0} / {maxParticipants} participants</span>
    </div>
  );
};

// Read-only Host Display
export const HostDisplay = ({ host }) => {
  return (
    <div className="mb-4 flex items-center gap-3 text-gray-300">
      <UserIcon className="w-4 h-4 text-indigo-400 flex-shrink-0" />
      <span className="text-sm">{host?.name || 'Unknown Host'}</span>
    </div>
  );
};

// Read-only Session Details Panel
export const ViewDetailsPanel = ({ session }) => {
  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-6">
      <h3 className="text-white font-bold text-xl mb-6">Session Details</h3>

      <ParticipantsDisplay
        currentParticipants={session?.currentParticipants}
        maxParticipants={session?.maxParticipants}
      />

      <DateDisplay
        month={session?.month}
        day={session?.day}
        year={session?.year}
      />

      <TimeDisplay
        startTime={session?.startTime}
        endTime={session?.endTime}
      />

      <LocationDisplay location={session?.location} />

      <HostDisplay host={session?.createdBy} />

      <SessionTypeDisplay
        sessionType={session?.sessionType}
      />
    </div>
  );
};

// Read-only Session Overview Panel
export const ViewOverviewPanel = ({ session }) => {
  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-6">
      <h3 className="text-white font-bold text-xl mb-6">Session Overview</h3>

      <div className="px-4 py-3 bg-[#0f0f0f] border border-gray-800 rounded-lg text-gray-300 text-sm min-h-[400px]">
        {session?.description || 'No description provided for this session.'}
      </div>
    </div>
  );
};

// Comments/Replies Panel  
export const CommentsPanel = () => {
  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-6">
      <h3 className="text-white font-bold text-xl mb-6">Comments & Replies</h3>
      
      {/* Comment Input */}
      <div className="mb-6">
        <textarea
          placeholder="Add a comment..."
          rows={3}
          className="w-full px-4 py-3 bg-[#0f0f0f] border border-gray-800 rounded-lg text-gray-300 text-sm resize-none focus:outline-none focus:border-indigo-500 transition-colors"
        />
        <button className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">
          Post Comment
        </button>
      </div>

      {/* Comments List */}
      <div className="space-y-4 max-h-[400px] overflow-y-auto">
        {/* Placeholder for when there are no comments */}
        <div className="text-center py-8 text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p>No comments yet</p>
          <p className="text-sm">Be the first to leave a comment!</p>
        </div>
        
        {/* Example comment structure - this will be replaced with real comments */}
        {/* <div className="border-b border-gray-800 pb-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
              U
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-white text-sm font-medium">User Name</span>
                <span className="text-gray-400 text-xs">2 hours ago</span>
              </div>
              <p className="text-gray-300 text-sm">This is a sample comment...</p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

// Associated Notes Panel
export const NotesPanel = ({ notes, loading }) => {
  const handleNoteClick = (note) => {
    const filePath = note.filePath || note.raw?.filePath;
    if (filePath) {
      window.open(`http://localhost:8080/${filePath}`, '_blank');
    }
  };

  const getFileIcon = (filePath) => {
    if (!filePath) return '📄';
    const ext = filePath.split('.').pop().toLowerCase();
    const iconMap = {
      pdf: '📕',
      doc: '📘',
      docx: '📘',
      txt: '📝',
      jpg: '🖼️',
      jpeg: '🖼️',
      png: '🖼️',
      gif: '🖼️',
      zip: '📦',
      rar: '📦',
    };
    return iconMap[ext] || '📄';
  };

  return (
    <div className="col-span-4 bg-[#1a1a1a] rounded-2xl p-6">
      <h3 className="text-white font-bold text-xl mb-6 flex items-center gap-2">
        <DocumentIcon className="w-5 h-5 text-indigo-400" />
        Associated Notes
      </h3>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin w-6 h-6 border-2 border-gray-600 border-t-indigo-500 rounded-full"></div>
        </div>
      ) : notes && notes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => {
            const noteId = note.noteId || note.id || note.raw?.id;
            const filePath = note.filePath || note.raw?.filePath;
            const title = note.title || note.raw?.title || 'Untitled Note';
            const createdAt = note.createdAt || note.raw?.createdAt;
            
            return (
              <div
                key={noteId}
                onClick={() => handleNoteClick(note)}
                className="bg-[#0f0f0f] border border-gray-800 hover:border-indigo-500 rounded-lg p-4 cursor-pointer transition-all hover:shadow-lg hover:shadow-indigo-500/10 group"
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">
                    {getFileIcon(filePath)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium text-sm mb-1 truncate group-hover:text-indigo-400 transition-colors">
                      {title}
                    </h4>
                    <p className="text-gray-400 text-xs mb-2">
                      {createdAt ? new Date(createdAt).toLocaleDateString() : 'No date'}
                    </p>
                    {filePath && (
                      <p className="text-gray-500 text-xs truncate">
                        {filePath.split('/').pop()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-lg mb-2">No notes associated yet</p>
          <p className="text-sm">Upload notes when creating or editing this session</p>
        </div>
      )}
    </div>
  );
};