import React, { useState } from 'react';


// ===== TAGS INPUT COMPONENT =====

export const TagsInput = ({ tags = [], onTagsChange, maxTags = 5 }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmedValue = inputValue.trim();
      
      // Validate tag
      if (!trimmedValue) return;
      if (tags.length >= maxTags) {
        alert(`Maximum ${maxTags} tags allowed`);
        return;
      }
      if (tags.includes(trimmedValue)) {
        alert('Tag already exists');
        return;
      }
      
      // Add tag
      onTagsChange([...tags, trimmedValue]);
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <label className="block text-gray-300 text-sm font-semibold">Tags</label>
        </div>
        <span className="text-xs text-gray-500 font-medium">{tags.length}/{maxTags}</span>
      </div>
      
      {/* Tags Display */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 text-indigo-300 px-3 py-1.5 rounded-full text-sm flex items-center gap-2 transition-all duration-200 hover:border-indigo-500/50"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="text-indigo-400 hover:text-indigo-200 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* Input Field */}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length >= maxTags ? `Max ${maxTags} tags reached` : "Type and press Enter to add tag"}
        disabled={tags.length >= maxTags}
        className="w-full px-3 py-2.5 bg-[#1e293b] border border-gray-700 rounded-lg text-gray-300 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
};


// ===== SESSION PROFILE PIC =====

export const SessionProfilePic = () => {
  return (
    <div className="relative group">
      <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-indigo-500/50 group-hover:scale-105">
        <svg className="w-12 h-12 text-white" fill="currentColor">
          <path d="M4 5h13v7h2V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h8v-2H4V5zm16 10l-4-4v3H9v2h7v3l4-4z" />
        </svg>
      </div>
      <button 
        type="button"
        className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-110"
      >
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
        </svg>
      </button>
    </div>
  );
};

// ===== SESSION TITLE INPUT =====

export const SessionTitleInput = ({ value, onChange }) => {
  return (
    <div className="flex-1">
      <label className="block text-gray-400 text-sm font-medium mb-2">Session Title</label>
      <input
        type="text"
        name="title"
        value={value}
        onChange={onChange}
        placeholder="Enter session name"
        required
        className="w-full bg-gray-800/30 border border-gray-700/50 text-3xl font-bold text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 px-4 py-3 rounded-lg"
      />
    </div>
  );
};


// ===== SESSION HEADER =====

export const SessionHeader = ({ title, onChange }) => {
  return (
    <div className="flex items-start gap-6 pb-8 border-b border-indigo-900/20">
      <SessionProfilePic />
      <SessionTitleInput value={title} onChange={onChange} />
    </div>
  );
};


// ===== DATE SELECTOR =====

export const DateSelector = ({ month, day, year, onChange, fieldErrors = {} }) => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const years = Array.from({ length: 10 }, (_, i) => 2025 + i);

  return (
    <div className="space-y-1">
      <div className="grid grid-cols-3 gap-2.5">
        <select
          name="month"
          value={month}
          onChange={onChange}
          className={`px-3 py-2.5 bg-[#1e293b] border rounded-lg text-gray-300 text-sm focus:outline-none transition-all duration-200 ${
            fieldErrors.month 
              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
              : 'border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
          }`}
        >
          <option value="">Month</option>
          {months.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        <select
          name="day"
          value={day}
          onChange={onChange}
          className={`px-3 py-2.5 bg-[#1e293b] border rounded-lg text-gray-300 text-sm focus:outline-none transition-all duration-200 ${
            fieldErrors.day 
              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
              : 'border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
          }`}
        >
          <option value="">Day</option>
          {days.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <select
          name="year"
          value={year}
          onChange={onChange}
          className={`px-3 py-2.5 bg-[#1e293b] border rounded-lg text-gray-300 text-sm focus:outline-none transition-all duration-200 ${
            fieldErrors.year 
              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
              : 'border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
          }`}
        >
          <option value="">Year</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>
      {(fieldErrors.month || fieldErrors.day || fieldErrors.year) && (
        <p className="text-red-400 text-xs mt-1">
          {fieldErrors.month || fieldErrors.day || fieldErrors.year}
        </p>
      )}
    </div>
  );
};


// ===== TIME SELECTOR =====

export const TimeSelector = ({ startTime, endTime, onChange, fieldErrors = {} }) => {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      <div>
        <label className="block text-gray-400 text-xs mb-1.5">Start Time</label>
        <input
          type="time"
          name="startTime"
          value={startTime}
          onChange={onChange}
          className={`w-full px-3 py-2.5 bg-[#1e293b] border rounded-lg text-gray-300 text-sm focus:outline-none transition-all duration-200 ${
            fieldErrors.startTime 
              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
              : 'border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
          }`}
        />
        {fieldErrors.startTime && (
          <p className="text-red-400 text-xs mt-1">{fieldErrors.startTime}</p>
        )}
      </div>
      <div>
        <label className="block text-gray-400 text-xs mb-1.5">End Time</label>
        <input
          type="time"
          name="endTime"
          value={endTime}
          onChange={onChange}
          className={`w-full px-3 py-2.5 bg-[#1e293b] border rounded-lg text-gray-300 text-sm focus:outline-none transition-all duration-200 ${
            fieldErrors.endTime 
              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
              : 'border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
          }`}
        />
        {fieldErrors.endTime && (
          <p className="text-red-400 text-xs mt-1">{fieldErrors.endTime}</p>
        )}
      </div>
    </div>
  );
};


// ===== LOCATION INPUT =====

export const LocationInput = ({ value, onChange }) => {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <label className="block text-gray-300 text-sm font-semibold">Location</label>
      </div>
      <input
        type="text"
        name="location"
        value={value}
        onChange={onChange}
        placeholder="e.g., Room 301, Library, or Online via Zoom"
        className="w-full px-3.5 py-2.5 bg-[#1e293b] border border-gray-700 rounded-lg text-gray-300 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 hover:border-gray-600"
      />
    </div>
  );
};


// ===== SESSION PRIVACY SELECTOR =====

const SessionPrivacySelector = ({ sessionType, password, maxParticipants, onChange, onPasswordChange, onParticipantsChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-3">
      
      <div className="flex gap-4">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="radio"
            name="sessionType"
            value="PUBLIC"
            checked={sessionType === 'PUBLIC'}
            onChange={onChange}
            className="w-4 h-4 accent-indigo-500"
          />
          <span className="text-gray-300 text-sm group-hover:text-white transition-colors">Public</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="radio"
            name="sessionType"
            value="PRIVATE"
            checked={sessionType === 'PRIVATE'}
            onChange={onChange}
            className="w-4 h-4 accent-indigo-500"
          />
          <span className="text-gray-300 text-sm group-hover:text-white transition-colors">Private</span>
        </label>
      </div>

      {sessionType === 'PRIVATE' && (
        <div className="animate-fadeIn relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={password}
            onChange={onPasswordChange}
            placeholder="Session password (min 6 chars)"
            className="w-full px-3.5 py-2.5 pr-10 bg-[#1e293b] border border-gray-700 rounded-lg text-gray-300 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
            minLength={6}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-400 transition-colors"
          >
            {showPassword ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
      )}

      <div>
        <label className="block text-gray-400 text-xs mb-1.5">
          Max Participants <span className="text-gray-500">(optional)</span>
        </label>
        <input
          type="number"
          name="maxParticipants"
          value={maxParticipants}
          onChange={onParticipantsChange}
          placeholder="e.g., 20"
          min="1"
          max="100"
          className="w-full px-3.5 py-2.5 bg-[#1e293b] border border-gray-700 rounded-lg text-gray-300 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
        />
      </div>
    </div>
  );
};


// ===== DETAILS PANEL =====

export const DetailsPanel = ({ sessionData, onChange, onPasswordChange, onParticipantsChange, onTagsChange, onUploadNotesClick, fieldErrors = {} }) => {
  return (
    <div className="bg-gradient-to-br from-[#1a1a2e]/60 via-[#16213e]/60 to-[#0f0f1e]/60 backdrop-blur-sm border border-indigo-900/30 rounded-xl p-5 shadow-lg hover:border-indigo-700/50 transition-all duration-300 h-full flex flex-col">
      <div className="flex items-center gap-2.5 pb-4 border-b border-indigo-900/20 flex-shrink-0">
        <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-white font-bold text-lg">Session Details</h3>
      </div>

      <div className="flex-1 flex flex-col space-y-4 mt-4 overflow-y-auto custom-scrollbar pr-1">
        {/* Date & Time Section */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <label className="text-gray-300 text-sm font-semibold">Date & Time</label>
          </div>
          <DateSelector
            month={sessionData.month}
            day={sessionData.day}
            year={sessionData.year}
            onChange={onChange}
          />
          <TimeSelector
            startTime={sessionData.startTime}
            endTime={sessionData.endTime}
            onChange={onChange}
          />
        </div>

        {/* Location */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <label className="text-gray-300 text-sm font-semibold">Location</label>
          </div>
          <input
            type="text"
            name="location"
            value={sessionData.location}
            onChange={onChange}
            placeholder="e.g., Room 301, Online"
            className="w-full px-3.5 py-2.5 bg-[#1e293b] border border-gray-700 rounded-lg text-gray-300 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 hover:border-gray-600"
          />
        </div>

        {/* Privacy Settings */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <label className="text-gray-300 text-sm font-semibold">Privacy</label>
          </div>
          <SessionPrivacySelector
            sessionType={sessionData.sessionType}
            password={sessionData.password}
            maxParticipants={sessionData.maxParticipants}
            onChange={onChange}
            onPasswordChange={onPasswordChange}
            onParticipantsChange={onParticipantsChange}
          />
        </div>

        {/* Tags */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <label className="text-gray-300 text-sm font-semibold">Tags</label>
            </div>
            <span className="text-xs text-gray-500 font-medium">{sessionData.tags?.length || 0}/5</span>
          </div>
          {sessionData.tags && sessionData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {sessionData.tags.map((tag, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 text-indigo-300 px-3 py-1.5 rounded-full text-sm flex items-center gap-2"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => onTagsChange(sessionData.tags.filter(t => t !== tag))}
                    className="text-indigo-400 hover:text-indigo-200"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
          <input
            type="text"
            placeholder="Type and press Enter"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const value = e.target.value.trim();
                if (value && (!sessionData.tags || sessionData.tags.length < 5) && !sessionData.tags?.includes(value)) {
                  onTagsChange([...(sessionData.tags || []), value]);
                  e.target.value = '';
                }
              }
            }}
            className="w-full px-3.5 py-2.5 bg-[#1e293b] border border-gray-700 rounded-lg text-gray-300 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
          />
        </div>

        {/* Upload Notes Section */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <label className="text-gray-300 text-sm font-semibold">Session Notes</label>
            <span className="text-xs text-gray-500 font-medium">(Optional)</span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            Upload notes or materials for this session. Participants will be able to access them.
          </p>
          <button
            type="button"
            onClick={onUploadNotesClick}
            className="w-full px-4 py-2.5 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 hover:from-indigo-600/30 hover:to-purple-600/30 border border-indigo-500/30 hover:border-indigo-500/50 text-indigo-300 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 group"
          >
            <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Upload Notes</span>
          </button>
        </div>
      </div>
    </div>
  );
};


// ===== DESCRIPTION PANEL =====

// export the DescriptionPanel as a named export
export const DescriptionPanel = ({ value, onChange }) => {
  return (
    <div className="bg-gradient-to-br from-[#1a1a2e]/60 via-[#16213e]/60 to-[#0f0f1e]/60 backdrop-blur-sm border border-indigo-900/30 rounded-xl p-5 shadow-lg hover:border-indigo-700/50 transition-all duration-300 h-full flex flex-col">
      <div className="flex items-center gap-2.5 pb-4 border-b border-indigo-900/20 flex-shrink-0">
        <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-white font-bold text-lg">Session Overview</h3>
          <p className="text-gray-400 text-xs mt-0.5">Describe what participants will learn</p>
        </div>
      </div>

      <div className="relative flex-1 mt-4">
        <textarea
          name="description"
          value={value}
          onChange={onChange}
          placeholder="Write a compelling overview of your session. Include the main topics, learning objectives, and what makes this session valuable...\n\nExample: In this session, we'll explore advanced React patterns including custom hooks, context optimization, and performance techniques. Perfect for developers looking to level up their skills."
          className="w-full h-full px-4 py-3.5 bg-gray-900/50 border border-gray-700/50 rounded-lg text-gray-300 text-base leading-relaxed resize-none focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 placeholder-gray-600"
        />
        <div className="absolute bottom-3 right-3 text-xs text-gray-500 bg-gray-900/80 px-2 py-1 rounded backdrop-blur-sm pointer-events-none">
          {value.length} characters
        </div>
      </div>
    </div>
  );
};


export default SessionHeader;