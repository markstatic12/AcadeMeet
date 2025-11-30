import React from 'react';

export default function DeleteConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Delete",
  message = "Are you sure you want to delete this item?",
  itemName = "",
  isDeleting = false
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1a1a1a] border border-red-800 rounded-2xl p-6 w-full max-w-md mx-4"I>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-900/30 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 4v2M6.343 17.657L7.757 16.243m2.828-2.828L10.586 10m5.656 5.656l1.414 1.414M16.243 7.757l1.414 1.414M9 5a4 4 0 118 0 4 4 0 01-8 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>

        <p className="text-gray-300 mb-2">{message}</p>
        {itemName && (
          <p className="text-gray-400 text-sm font-medium mb-4 truncate">
            "{itemName}"
          </p>
        )}

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-red-300 border-t-white rounded-full"></div>
                Deleting...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
