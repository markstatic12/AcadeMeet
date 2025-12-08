import React from 'react';
import { CloseIcon } from '../../icons/icons';

const ParticipantsModal = ({ 
  isOpen, 
  participants, 
  isHost,
  onClose, 
  onRemoveParticipant 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="relative bg-gradient-to-b from-gray-900 to-gray-800 border border-gray-700/50 rounded-3xl p-8 w-full max-w-2xl shadow-2xl shadow-indigo-500/10 animate-scaleIn overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-600/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-3xl font-bold text-white tracking-tight">Participants</h3>
            <button
              onClick={onClose}
              className="p-2.5 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-xl transition-all hover:rotate-90 hover:scale-110 border border-transparent hover:border-gray-700"
            >
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>
          
          <div className="max-h-[55vh] overflow-y-auto custom-scrollbar pr-2 space-y-2">
            {participants.length === 0 ? (
              <div className="text-gray-400 text-sm p-12 text-center bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-2xl border border-gray-800">
                <div className="text-5xl mb-3 opacity-50">👥</div>
                <p className="text-base font-semibold">No participants yet.</p>
                <p className="text-xs text-gray-500 mt-2">Be the first to join!</p>
              </div>
            ) : (
              participants.map((participant, index) => (
                <div 
                  key={participant.id} 
                  className="flex items-center justify-between p-3 hover:bg-gradient-to-r hover:from-gray-800/50 hover:to-gray-700/50 rounded-xl transition-all group border border-transparent hover:border-gray-700/50 animate-slideInLeft" 
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-500/30 transition-transform group-hover:scale-110 group-hover:rotate-6 border-2 border-white/10">
                      {participant.profilePic ? (
                        <img 
                          src={`http://localhost:8080${participant.profilePic}`} 
                          alt={participant.name} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <span className="text-white text-sm font-bold">
                          {(participant.name || 'U').charAt(0).toUpperCase()}
                        </span>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="text-white text-sm font-bold group-hover:text-indigo-400 transition-all">
                          {participant.name || 'User'}
                        </div>
                        {participant.isHost && (
                          <span className="px-2 py-0.5 bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-400 text-xs font-bold rounded-md border border-amber-500/40">
                            Host
                          </span>
                        )}
                      </div>
                      <div className="text-gray-500 text-xs font-medium">@{participant.id}</div>
                    </div>
                  </div>
                  
                  {/* Show remove button only if current user is host and the participant is not the host */}
                  {isHost && !participant.isHost && (
                    <button
                      onClick={() => onRemoveParticipant(participant.id)}
                      className="relative overflow-hidden px-4 py-2 rounded-lg bg-gradient-to-r from-gray-800 to-gray-900 hover:from-red-600/30 hover:to-red-700/30 text-red-300 border border-red-500/40 hover:border-red-500/60 text-xs font-bold transition-all hover:scale-110 shadow-lg group/btn"
                    >
                      <span className="relative z-10 flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Remove
                      </span>
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantsModal;
