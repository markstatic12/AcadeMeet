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
    <div className="space-y-3">
      <label className="block text-gray-300 text-sm font-medium">
        Tags <span className="text-gray-500">({tags.length}/{maxTags})</span>
      </label>
      
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
    <div className="flex items-start gap-6 pb-8 border-b border-gray-700/30">
      <SessionProfilePic />
      <SessionTitleInput value={title} onChange={onChange} />
    </div>
  );
};


// ===== DATE SELECTOR =====

export const DateSelector = ({ month, day, year, onChange }) => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const years = Array.from({ length: 10 }, (_, i) => 2025 + i);

  return (
    <div className="space-y-3">
      <label className="block text-gray-300 text-sm font-medium">Date</label>
      <div className="grid grid-cols-3 gap-2">
        <select
          name="month"
          value={month}
          onChange={onChange}
          className="px-3 py-2.5 bg-[#1e293b] border border-gray-700 rounded-lg text-gray-300 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
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
          className="px-3 py-2.5 bg-[#1e293b] border border-gray-700 rounded-lg text-gray-300 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
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
          className="px-3 py-2.5 bg-[#1e293b] border border-gray-700 rounded-lg text-gray-300 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
        >
          <option value="">Year</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>
    </div>
  );
};


// ===== TIME SELECTOR =====

export const TimeSelector = ({ startTime, endTime, onChange }) => {
  return (
    <div className="space-y-3">
      <label className="block text-gray-300 text-sm font-medium">Time</label>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-gray-400 text-xs mb-1.5">Start Time</label>
          <input
            type="time"
            name="startTime"
            value={startTime}
            onChange={onChange}
            className="w-full px-3 py-2.5 bg-[#1e293b] border border-gray-700 rounded-lg text-gray-300 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
          />
        </div>
        <div>
          <label className="block text-gray-400 text-xs mb-1.5">End Time</label>
          <input
            type="time"
            name="endTime"
            value={endTime}
            onChange={onChange}
            className="w-full px-3 py-2.5 bg-[#1e293b] border border-gray-700 rounded-lg text-gray-300 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
          />
        </div>
      </div>
    </div>
  );
};


// ===== LOCATION INPUT =====

export const LocationInput = ({ value, onChange }) => {
  return (
    <div className="space-y-3">
      <label className="block text-gray-300 text-sm font-medium">Location</label>
      <input
        type="text"
        name="location"
        value={value}
        onChange={onChange}
        placeholder="Enter session location"
        className="w-full px-3 py-2.5 bg-[#1e293b] border border-gray-700 rounded-lg text-gray-300 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
      />
    </div>
  );
};


// ===== SESSION PRIVACY SELECTOR =====

const SessionPrivacySelector = ({ sessionType, password, maxParticipants, onChange, onPasswordChange, onParticipantsChange }) => {
  return (
    <div className="space-y-4">
      <h4 className="text-gray-300 font-semibold text-sm">Session Privacy</h4>
      
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
          <span className="text-gray-300 text-sm group-hover:text-white transition-colors">Public Session</span>
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
          <span className="text-gray-300 text-sm group-hover:text-white transition-colors">Private Session</span>
        </label>
      </div>

      {sessionType === 'PRIVATE' && (
        <div className="animate-fadeIn">
          <input
            type="password"
            name="password"
            value={password}
            onChange={onPasswordChange}
            placeholder="Enter session password (min 6 characters)"
            className="w-full px-3 py-2.5 bg-[#1e293b] border border-gray-700 rounded-lg text-gray-300 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
            minLength={6}
            required
          />
        </div>
      )}

      <div>
        <label className="block text-gray-400 text-xs mb-2">
          Maximum Participants <span className="text-gray-500">(optional)</span>
        </label>
        <input
          type="number"
          name="maxParticipants"
          value={maxParticipants}
          onChange={onParticipantsChange}
          placeholder="Enter max participants"
          min="1"
          max="100"
          className="w-full px-3 py-2.5 bg-[#1e293b] border border-gray-700 rounded-lg text-gray-300 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
        />
      </div>
    </div>
  );
};


// ===== DETAILS PANEL =====

export const DetailsPanel = ({ sessionData, onChange, onPasswordChange, onParticipantsChange, onTagsChange }) => {
  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 space-y-6 shadow-lg hover:border-gray-600/50 transition-all duration-300">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-700/30">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-white font-bold text-lg">Session Details</h3>
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

      <LocationInput
        value={sessionData.location}
        onChange={onChange}
      />

      <div className="pt-4 border-t border-gray-700/30">
        <SessionPrivacySelector
          sessionType={sessionData.sessionType}
          password={sessionData.password}
          maxParticipants={sessionData.maxParticipants}
          onChange={onChange}
          onPasswordChange={onPasswordChange}
          onParticipantsChange={onParticipantsChange}
        />
      </div>

      <div className="pt-4 border-t border-gray-700/30">
        <TagsInput
          tags={sessionData.tags || []}
          onTagsChange={onTagsChange}
          maxTags={5}
        />
      </div>
    </div>
  );
};


// ===== DESCRIPTION PANEL =====

// export the DescriptionPanel as a named export
export const DescriptionPanel = ({ value, onChange }) => {
  return (
    <div className="lg:col-span-2 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 space-y-6 shadow-lg hover:border-gray-600/50 transition-all duration-300">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-700/30">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        </div>
        <h3 className="text-white font-bold text-lg">Session Overview</h3>
      </div>

      <div className="relative">
        <textarea
          name="description"
          value={value}
          onChange={onChange}
          placeholder="Write a compelling overview of your session. Describe the topics, objectives, and what participants will learn..."
          rows={16}
          className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-lg text-gray-300 text-sm resize-none focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 placeholder-gray-600"
        />
        <div className="absolute bottom-3 right-3 text-xs text-gray-500">
          {value.length} characters
        </div>
      </div>
    </div>
  );
};


export default SessionHeader;