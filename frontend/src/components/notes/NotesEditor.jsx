import React, { useState, useRef, useEffect } from 'react';
import { LinkIcon, H1Icon, H2Icon } from '../../icons';
import { sessionService } from '../../services/SessionService';
// Removed duplicate imports
// Removed leading markdown fence

// ===== TOOLBAR BUTTON =====

export const ToolbarButton = ({ label, icon, onClick, className = '' }) => (
  <button
    type="button"
    onClick={onClick}
    className={`acm-toolbar-button ${className}`}
    title={label || 'format'}
    aria-label={label || 'toolbar button'}
  >
    {icon || label}
  </button>
);



// ===== EDITOR TOOLBAR =====

export const EditorToolbar = ({ onFormat, onLink, onSessionLink, isFavorite, onToggleFavorite, editorRef }) => {
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkOpenNewTab, setLinkOpenNewTab] = useState(false);
  const linkInputRef = useRef(null);
  const savedRangeRef = useRef(null);

  const handleSessionLink = () => {
    setShowSessionModal(true);
  };

  const openLinkModal = () => {
    try {
      const sel = window.getSelection && window.getSelection();
      if (sel && sel.rangeCount) {
        savedRangeRef.current = sel.getRangeAt(0).cloneRange();
      } else {
        savedRangeRef.current = null;
      }
    } catch (err) {
      savedRangeRef.current = null;
    }
    setShowLinkModal(true);
    setTimeout(() => linkInputRef.current && linkInputRef.current.focus(), 0);
  };

  const closeLinkModal = () => {
    setShowLinkModal(false);
    savedRangeRef.current = null;
  };

  const insertLink = (url, openInNewTab = false) => {
    try {
      if (!url) {
        closeLinkModal();
        return;
      }

      // normalize URL
      const finalUrl = /^(https?:)?\/\//i.test(url) ? url : `https://${url}`;

      const sel = window.getSelection && window.getSelection();
      // restore selection range
      if (sel) {
        sel.removeAllRanges();
        if (savedRangeRef.current) sel.addRange(savedRangeRef.current.cloneRange());
      }

      // Prefer DOM Range insertion for robustness
      if (savedRangeRef.current) {
        const range = savedRangeRef.current.cloneRange();
        // If range has content, replace it with an anchor
        const a = document.createElement('a');
        a.href = finalUrl;
        if (openInNewTab) a.setAttribute('target', '_blank');

        if (!range.collapsed) {
          // Extract contents and place inside anchor
          const contents = range.extractContents();
          a.appendChild(contents);
          range.insertNode(a);
        } else {
          // collapsed: insert anchor with the URL text
          a.textContent = finalUrl;
          range.insertNode(a);
          // move caret after the inserted link
          range.setStartAfter(a);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
        }
      } else {
        // No saved range — fall back to execCommand
        document.execCommand('createLink', false, finalUrl);
      }

      // ensure editor retains focus
      try { editorRef && editorRef.current && editorRef.current.focus(); } catch (_) {}
    } catch (err) {
      console.debug('[EditorToolbar] insertLink failed', err);
    } finally {
      closeLinkModal();
    }
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
            label="•" 
            onClick={() => onFormat('insertUnorderedList')} 
            title="Bullet List"
            className="text-lg leading-none"
          />
          {/* Numbered list removed per request */}
          
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
          
          {/* Links */}
          <ToolbarButton 
            icon={<LinkIcon />} 
            onClick={() => { if (typeof onLink === 'function') { /* still call provided callback for backwards compat */ onLink(); } openLinkModal(); }} 
            title="Add Link"
          />
          {/* Font size selector */}
          <div className="ml-2">
            <label htmlFor="fontSize" className="sr-only">Font size</label>
            <select
              id="fontSize"
              onChange={(e) => onFormat && onFormat('setFontSize', e.target.value)}
              defaultValue="16px"
              className="bg-[#0f0f0f] border border-gray-700 text-sm text-gray-300 rounded px-2 py-1 acm-fontsize-select"
            >
              <option value="12px">12</option>
              <option value="14px">14</option>
              <option value="16px">16</option>
              <option value="18px">18</option>
              <option value="20px">20</option>
              <option value="24px">24</option>
              <option value="32px">32</option>
            </select>
          </div>
          <ToolbarButton 
            label="@" 
            onClick={handleSessionLink} 
            title="Link to Session"
            className="text-blue-400 hover:text-blue-300"
          />
          
          {/* removed Clear/Quote/Code buttons per request */}
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

      {showLinkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-lg mx-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-white">Insert Link</h4>
              <button onClick={closeLinkModal} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <div className="space-y-3">
              <input ref={linkInputRef} type="text" placeholder="https://example.com" className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white" />
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-300"><input type="checkbox" id="newTab" className="w-4 h-4"/> Open in new tab</label>
                <div className="flex items-center gap-2">
                  <button onClick={() => closeLinkModal()} className="px-3 py-1 rounded bg-gray-700 text-gray-200">Cancel</button>
                  <button onClick={() => insertLink(linkInputRef.current ? linkInputRef.current.value : '')} className="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white">Insert</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};


// ===== NOTE TITLE INPUT =====

export const NoteTitleInput = ({ value, onChange }) => {
  const [localTitle, setLocalTitle] = useState(value || '');

  useEffect(() => {
    setLocalTitle(value || '');
  }, [value]);

  const handleLocalChange = (e) => {
    const v = e?.target?.value ?? e?.value ?? '';
    setLocalTitle(v);
    if (typeof onChange === 'function') {
      try {
        onChange({ target: { name: 'title', value: v } });
      } catch (err) {
        try { onChange(e); } catch (_) { /* ignore */ }
      }
    }
  };

  return (
    <div className="mb-6">
      <input
        type="text"
        name="title"
        value={localTitle}
        onChange={handleLocalChange}
        onFocus={() => console.debug('[NoteTitleInput] focus')}
        onClick={() => console.debug('[NoteTitleInput] click')}
        placeholder="Untitled Note"
        className="w-full bg-transparent text-4xl font-bold text-indigo-300 placeholder-indigo-300/50 focus:outline-none focus:text-white transition-colors"
        style={{ pointerEvents: 'auto' }}
      />
    </div>
  );
};

// ===== RICH TEXT EDITOR =====

export const RichTextEditor = ({ editorRef, initialContent = '', onContentChange, onSessionLink }) => {
  const localRef = useRef(null);
  const innerRef = editorRef || localRef;
  const [content, setContent] = useState(initialContent);
  const isEditingRef = useRef(false);

  // Only update the DOM when initialContent changes and user is not actively editing.
  useEffect(() => {
    try {
      if (innerRef && innerRef.current && initialContent !== content && !isEditingRef.current) {
        innerRef.current.innerHTML = initialContent;
        setContent(initialContent);
      }
    } catch (err) {
      // defensive: ignore DOM errors
      console.debug('[RichTextEditor] sync error', err);
    }
  }, [initialContent, content, innerRef]);

  const handleInput = (e) => {
    const el = (e && (e.target || e.currentTarget)) || innerRef.current;
    const newContent = el && el.innerHTML != null ? el.innerHTML : '';
    setContent(newContent);
    if (typeof onContentChange === 'function') onContentChange(newContent);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  const handleKeyDown = (e) => {
    // Enhanced handling for Enter and Backspace to improve editing fidelity
    const sel = window.getSelection && window.getSelection();
    const range = sel && sel.rangeCount ? sel.getRangeAt(0) : null;

    // TAB / SHIFT+TAB handling for indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const findListItem = (node) => {
        let n = node;
        while (n && n !== innerRef.current) {
          if (n.nodeType === 1 && n.tagName === 'LI') return n;
          n = n.parentNode;
        }
        return null;
      };

      const li = range ? findListItem(range.startContainer) : null;

      if (li) {
        // try browser execCommand first
        if (e.shiftKey) {
          try {
            document.execCommand('outdent');
          } catch (_) {
            outdentListItem(li);
          }
        } else {
          try {
            document.execCommand('indent');
          } catch (_) {
            // fallback: nest this li under previous li by creating a sublist
            const prev = li.previousElementSibling;
            try {
              if (prev) {
                let sublist = prev.querySelector('ul, ol');
                if (!sublist) {
                  sublist = document.createElement(li.parentNode.tagName.toLowerCase());
                  prev.appendChild(sublist);
                }
                sublist.appendChild(li);
              } else {
                // no previous sibling: increase left margin as visual fallback
                const cur = parseInt(li.style.marginLeft || '0', 10) || 0;
                li.style.marginLeft = (cur + 40) + 'px';
              }
            } catch (err) { console.debug('[RichTextEditor] indent fallback failed', err); }
          }
        }
        return;
      }

      // Not inside list item: insert four NBSPs at caret or prefix selected lines
      try {
        if (range && range.collapsed) {
          document.execCommand('insertText', false, '\u00A0\u00A0\u00A0\u00A0');
        } else if (range) {
          const text = range.toString();
          const replaced = text.split('\n').map(line => '\u00A0\u00A0\u00A0\u00A0' + line).join('\n');
          document.execCommand('insertText', false, replaced);
        }
      } catch (err) {
        try { document.execCommand('insertText', false, '\t'); } catch (_) { /* ignore */ }
      }
      return;
    }

    const findBlock = (node) => {
      const blockTags = ['P','DIV','LI','H1','H2','H3','H4','H5','H6','PRE','BLOCKQUOTE'];
      let n = node;
      while (n && n !== innerRef.current) {
        if (n.nodeType === 1 && blockTags.includes(n.tagName)) return n;
        n = n.parentNode;
      }
      return innerRef.current;
    };

    const isCaretAtStart = (r) => {
      if (!r || !r.collapsed) return false;
      const sc = r.startContainer;
      const offset = r.startOffset;
      if (sc.nodeType === 3) {
        if (offset > 0) return false;
        // check previous siblings for content
        let prev = sc.previousSibling;
        while (prev) {
          if (prev.nodeType === 3 && prev.textContent.trim() !== '') return false;
          if (prev.nodeType === 1 && prev.textContent.trim() !== '') return false;
          prev = prev.previousSibling;
        }
        return true;
      }
      // element container
      if (offset > 0) return false;
      // check if any previous sibling has content
      let p = sc.childNodes[offset-1];
      if (!p) {
        // no previous siblings
        return true;
      }
      return false;
    };

    const setCaretToEnd = (node) => {
      try {
        const sel = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(node);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
      } catch (err) { /* ignore */ }
    };

    const outdentListItem = (li) => {
      try {
        // try execCommand outdent first (may work in some browsers)
        document.execCommand('outdent');
        // if still inside li, fallback to converting li to paragraph
        if (li.parentNode && li.parentNode.contains(li)) {
          const p = document.createElement('p');
          p.innerHTML = li.innerHTML || '<br>';
          const list = li.parentNode;
          list.parentNode.insertBefore(p, list.nextSibling);
          list.removeChild(li);
          if (list.childNodes.length === 0) list.parentNode.removeChild(list);
          setCaretToEnd(p);
        }
      } catch (err) { console.debug('[RichTextEditor] outdent failed', err); }
    };

    const mergeWithPrevious = (block) => {
      try {
        const prev = block.previousElementSibling;
        if (!prev) return;
        // move contents
        while (block.firstChild) {
          prev.appendChild(block.firstChild);
        }
        // remove the empty block
        block.parentNode.removeChild(block);
        setCaretToEnd(prev);
      } catch (err) { console.debug('[RichTextEditor] merge failed', err); }
    };

    const handleEnterKey = (e, r) => {
      if (!r) return;
      const block = findBlock(r.startContainer);
      if (!block) return;
      if (block.tagName === 'LI') {
        const text = block.textContent || '';
        if (text.trim() === '') {
          // empty list item: break out of list into paragraph
          e.preventDefault();
          outdentListItem(block);
          return;
        }
        // otherwise let browser create new list item
        return;
      }
      // For inline formatting (e.g., bold/italic) allow default behavior to preserve inline tags
      return;
    };

    const handleBackspaceKey = (e, r) => {
      if (!r) return;
      const block = findBlock(r.startContainer);
      if (!block) return;
      const atStart = isCaretAtStart(r);
      if (block.tagName === 'LI') {
        if (atStart) {
          e.preventDefault();
          outdentListItem(block);
        }
        return;
      }
      if (atStart) {
        // merge with previous block
        const prev = block.previousElementSibling;
        if (prev) {
          e.preventDefault();
          mergeWithPrevious(block);
        }
      }
    };

    // Handle session linking with @ symbol
    if (e.key === '@') {
      // Trigger session linking functionality
      if (onSessionLink) {
        onSessionLink();
      }
    }

    // Handle Enter and Backspace enhanced behaviors
    if (e.key === 'Enter') {
      handleEnterKey(e, range);
      return;
    }
    if (e.key === 'Backspace' || e.key === 'Delete') {
      handleBackspaceKey(e, range);
      return;
    }

    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          document.execCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          document.execCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          document.execCommand('underline');
          break;
        default:
          break;
      }
    }
  };
  const handleMouseDown = (e) => {
    // Ensure clicks focus the editor and avoid caret being lost by other mouse handlers.
    try {
      if (innerRef && innerRef.current && document.activeElement !== innerRef.current) {
        e.preventDefault();
        innerRef.current.focus();
      }
    } catch (err) {
      /* ignore */
    }
  };

  return (
    <div className="relative">
      <div
        ref={innerRef}
        contentEditable={true}
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        data-placeholder="Start typing your notes here..."
        className="min-h-[500px] bg-[#101010] border border-gray-800 rounded-xl p-6 text-gray-300 leading-relaxed text-sm focus:outline-none focus:border-indigo-500 overflow-y-auto custom-scrollbar"
        onInput={handleInput}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        onMouseDown={handleMouseDown}
        onClick={() => innerRef.current && innerRef.current.focus()}
        onFocus={() => { isEditingRef.current = true; console.debug('[RichTextEditor] focus'); }}
        onBlur={() => { isEditingRef.current = false; console.debug('[RichTextEditor] blur'); }}
        style={{
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap',
          pointerEvents: 'auto',
          zIndex: 1
        }}
        tabIndex={0}
      />

      {/* Floating word count */}
      <div className="absolute bottom-4 right-4 px-3 py-1 rounded text-xs acm-char-count">
        {String(content || '').replace(/<[^>]*>/g, '').length} characters
      </div>
    </div>
  );
};


// ===== SESSION LINK MODAL =====


export const SessionLinkModal = ({ onClose, onSelectSession }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const sessionsData = await sessionService.getSessionsForLinking();
      setSessions(sessionsData);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSessions = sessions.filter(session =>
    session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectSession = (session) => {
    onSelectSession(session);
  };

  const formatSessionTime = (dateTime) => {
    try {
      return new Date(dateTime).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Date TBD';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Link to Session</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search Input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search sessions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin w-8 h-8 border-2 border-gray-600 border-t-blue-500 rounded-full"></div>
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>{searchTerm ? 'No sessions found matching your search.' : 'No sessions available to link.'}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredSessions.map(session => (
                <div
                  key={session.id}
                  onClick={() => handleSelectSession(session)}
                  className="bg-gray-800 hover:bg-gray-700 rounded-lg p-4 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-white font-medium mb-1">{session.title}</h4>
                      {session.description && (
                        <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                          {session.description}
                        </p>
                      )}
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>📅 {formatSessionTime(session.dateTime)}</span>
                        <span>📍 {session.location || 'Online'}</span>
                        {session.sessionType === 'PRIVATE' && (
                          <span className="bg-red-900/50 text-red-300 px-2 py-1 rounded">
                            Private
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="ml-4">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <p className="text-gray-400 text-sm">
            Select a session to insert a link in your note.
          </p>
        </div>
      </div>
    </div>
  );
};

// ===== AUTHOR FOOTER =====

export const AuthorFooter = ({ userName }) => {
  if (!userName) return null;

  return (
    <p className="mt-4 text-xs text-gray-600">
      Author: {userName}
    </p>
  );
};

export default RichTextEditor;