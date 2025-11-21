import React, { useState } from 'react';
import ToolbarButton from './ToolbarButton';
import { ListIcon, LinkIcon, H1Icon, H2Icon, QuoteIcon, CodeIcon, ClearIcon } from '../../icons';
import SessionLinkModal from './SessionLinkModal';

const EditorToolbar = ({ onFormat, onLink, onSessionLink, isFavorite, onToggleFavorite }) => {
  const [showSessionModal, setShowSessionModal] = useState(false);

  const handleSessionLink = () => {
    setShowSessionModal(true);
  };

  return (
    <>
      <div className="bg-[#121212] border border-gray-800 rounded-xl p-3 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-1 flex-wrap">
          {/* Text Formatting */}
          <ToolbarButton 
            label="B" 
            onClick={() => onFormat('bold')} 
            className="font-bold" 
            title="Bold (Ctrl+B)"
          />
          <ToolbarButton 
            label="I" 
            onClick={() => onFormat('italic')} 
            className="italic" 
            title="Italic (Ctrl+I)"
          />
          <ToolbarButton 
            label="U" 
            onClick={() => onFormat('underline')} 
            className="underline" 
            title="Underline (Ctrl+U)"
          />
          
          <div className="w-px h-6 bg-gray-700 mx-2" />
          
          {/* Lists and Structure */}
          <ToolbarButton 
            icon={<ListIcon />} 
            onClick={() => onFormat('insertUnorderedList')} 
            title="Bullet List"
          />
          <ToolbarButton 
            label="1." 
            onClick={() => onFormat('insertOrderedList')} 
            title="Numbered List"
          />
          
          <div className="w-px h-6 bg-gray-700 mx-2" />
          
          {/* Headings */}
          <ToolbarButton 
            icon={<H1Icon />} 
            onClick={() => onFormat('formatBlock', 'h1')} 
            title="Heading 1"
          />
          <ToolbarButton 
            icon={<H2Icon />} 
            onClick={() => onFormat('formatBlock', 'h2')} 
            title="Heading 2"
          />
          
          <div className="w-px h-6 bg-gray-700 mx-2" />
          
          {/* Special Blocks */}
          <ToolbarButton 
            icon={<QuoteIcon />} 
            onClick={() => onFormat('formatBlock', 'blockquote')} 
            title="Quote"
          />
          <ToolbarButton 
            icon={<CodeIcon />} 
            onClick={() => onFormat('formatBlock', 'pre')} 
            title="Code Block"
          />
          
          <div className="w-px h-6 bg-gray-700 mx-2" />
          
          {/* Links */}
          <ToolbarButton 
            icon={<LinkIcon />} 
            onClick={onLink} 
            title="Add Link"
          />
          <ToolbarButton 
            label="@" 
            onClick={handleSessionLink} 
            title="Link to Session"
            className="text-blue-400 hover:text-blue-300"
          />
          
          <div className="w-px h-6 bg-gray-700 mx-2" />
          
          {/* Clear Formatting */}
          <ToolbarButton 
            icon={<ClearIcon />} 
            onClick={() => onFormat('removeFormat')} 
            title="Clear Formatting"
          />
        </div>

        {/* Note Actions */}
        <div className="flex items-center gap-2">
          {onToggleFavorite && (
            <ToolbarButton 
              icon={
                <svg className="w-4 h-4" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              }
              onClick={onToggleFavorite} 
              title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              className={isFavorite ? "text-yellow-400 hover:text-yellow-300" : "text-gray-400 hover:text-yellow-400"}
            />
          )}
        </div>
      </div>

      {showSessionModal && (
        <SessionLinkModal
          onClose={() => setShowSessionModal(false)}
          onSelectSession={(session) => {
            onSessionLink && onSessionLink(session);
            setShowSessionModal(false);
          }}
        />
      )}
    </>
  );
};

export default EditorToolbar;
