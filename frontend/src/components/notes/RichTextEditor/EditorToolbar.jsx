import React from 'react';
import ToolbarButton from './ToolbarButton';
import { ListIcon, LinkIcon, H1Icon, H2Icon, QuoteIcon, CodeIcon, ClearIcon } from '../../icons';

const EditorToolbar = ({ onFormat, onLink }) => {
  return (
    <div className="bg-[#121212] border border-gray-800 rounded-xl p-3 mb-4 flex items-center gap-1 flex-wrap">
      <ToolbarButton 
        label="B" 
        onClick={() => onFormat('bold')} 
        className="font-bold" 
      />
      <ToolbarButton 
        label="I" 
        onClick={() => onFormat('italic')} 
        className="italic" 
      />
      <ToolbarButton 
        label="U" 
        onClick={() => onFormat('underline')} 
        className="underline" 
      />
      <ToolbarButton 
        icon={<ListIcon />} 
        onClick={() => onFormat('insertUnorderedList')} 
      />
      <ToolbarButton 
        icon={<LinkIcon />} 
        onClick={onLink} 
      />
      <ToolbarButton 
        icon={<H1Icon />} 
        onClick={() => onFormat('formatBlock', 'h1')} 
      />
      <ToolbarButton 
        icon={<H2Icon />} 
        onClick={() => onFormat('formatBlock', 'h2')} 
      />
      <ToolbarButton 
        icon={<QuoteIcon />} 
        onClick={() => onFormat('formatBlock', 'blockquote')} 
      />
      <ToolbarButton 
        icon={<CodeIcon />} 
        onClick={() => onFormat('formatBlock', 'pre')} 
      />
      <ToolbarButton 
        icon={<ClearIcon />} 
        onClick={() => onFormat('removeFormat')} 
      />
    </div>
  );
};

export default EditorToolbar;
