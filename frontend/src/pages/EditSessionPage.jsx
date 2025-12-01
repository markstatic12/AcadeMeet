import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import AddNoteModal from '../components/profile/AddNoteModal';

const EditSessionPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [showAssociateNotesModal, setShowAssociateNotesModal] = useState(false);

  const handleBack = () => {
    navigate(`/session/${sessionId}`);
  };

  const handleAssociateNotes = () => {
    setShowAssociateNotesModal(true);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Session
          </button>
        </div>

        <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Edit Session</h2>
          <p className="text-gray-300 mb-6">
            Session editing functionality coming soon...
          </p>
          <p className="text-gray-400 text-sm mb-6">
            Session ID: {sessionId}
          </p>
          
          <button
            onClick={handleAssociateNotes}
            className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium"
          >
            Associate or Upload Notes
          </button>
        </div>

        {/* Associate Notes Modal */}
        <AddNoteModal
          isOpen={showAssociateNotesModal}
          onClose={() => setShowAssociateNotesModal(false)}
          sessionId={Number(sessionId)}
          onNoteAdded={(note) => {
            console.log('Note associated with session:', note);
            setShowAssociateNotesModal(false);
          }}
        />
      </div>
    </DashboardLayout>
  );
};

export default EditSessionPage;