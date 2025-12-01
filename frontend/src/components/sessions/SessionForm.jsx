import React from 'react';


// ===== SESSION PROFILE PIC =====

export const SessionProfilePic = () => {
  return (
    <div className="relative">
      <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center overflow-hidden">
        <svg className="w-16 h-16 text-indigo-400" fill="currentColor">
          <path d="M4 5h13v7h2V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h8v-2H4V5zm16 10l-4-4v3H9v2h7v3l4-4z" />
        </svg>
      </div>
      <button 
        type="button"
        className="absolute bottom-0 right-0 w-10 h-10 bg-indigo-600 hover:bg-indigo-700 rounded-full flex items-center justify-center transition-colors shadow-lg"
      >
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor">
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
      <input
        type="text"
        name="title"
        value={value}
        onChange={onChange}
        placeholder="Enter Session Name"
        className="w-full bg-transparent text-4xl font-bold text-indigo-300 placeholder-indigo-300/50 focus:outline-none focus:text-white transition-colors"
      />
    </div>
  );
};


// ===== SESSION HEADER =====

export const SessionHeader = ({ title, onChange }) => {
  return (
    <div className="flex items-center gap-6 mb-12">
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
    <div className="mb-6">
      <div className="flex gap-2">
        <select
          name="month"
          value={month}
          onChange={onChange}
          className="flex-1 px-3 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg text-gray-300 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
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
          className="flex-1 px-3 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg text-gray-300 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
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
          className="flex-1 px-3 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg text-gray-300 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
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
    <div className="mb-6">
      <div className="flex items-center gap-2">
        <input
          type="time"
          name="startTime"
          value={startTime}
          onChange={onChange}
          className="flex-1 px-3 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg text-gray-300 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
        />
        <span className="text-gray-500">—</span>
        <input
          type="time"
          name="endTime"
          value={endTime}
          onChange={onChange}
          className="flex-1 px-3 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg text-gray-300 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
        />
      </div>
    </div>
  );
};


// ===== LOCATION INPUT =====

export const LocationInput = ({ value, onChange }) => {
  return (
    <div className="mb-6">
      <input
        type="text"
        name="location"
        value={value}
        onChange={onChange}
        placeholder="Enter session location"
        className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg text-gray-300 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
      />
    </div>
  );
};


// ===== SESSION PRIVACY SELECTOR =====

const SessionPrivacySelector = ({ sessionType, password, maxParticipants, onChange, onPasswordChange, onParticipantsChange }) => {
  return (
    <div className="mb-6">
      <h4 className="text-white font-semibold mb-3">Session Privacy</h4>
      
      <div className="flex gap-4 mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sessionType"
            value="PUBLIC"
            checked={sessionType === 'PUBLIC'}
            onChange={onChange}
            className="accent-indigo-500"
          />
          <span className="text-gray-300">Public Session</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sessionType"
            value="PRIVATE"
            checked={sessionType === 'PRIVATE'}
            onChange={onChange}
            className="accent-indigo-500"
          />
          <span className="text-gray-300">Private Session</span>
        </label>
      </div>

      {sessionType === 'PRIVATE' && (
        <div className="mb-4">
          <input
            type="password"
            name="password"
            value={password}
            onChange={onPasswordChange}
            placeholder="Enter session password (min 6 characters)"
            className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg text-gray-300 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            minLength={6}
            required
          />
        </div>
      )}

      <div className="mb-4">
        <label className="block text-gray-300 text-sm mb-2">
          Maximum Participants (optional)
        </label>
        <input
          type="number"
          name="maxParticipants"
          value={maxParticipants}
          onChange={onParticipantsChange}
          placeholder="Enter max participants"
          min="1"
          max="100"
          className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg text-gray-300 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
        />
      </div>
    </div>
  );
};


// ===== DETAILS PANEL =====

export const DetailsPanel = ({ sessionData, onChange, onPasswordChange, onParticipantsChange }) => {
  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-6">
      <h3 className="text-white font-bold text-xl mb-6"> Session Details</h3>

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

      <SessionPrivacySelector
        sessionType={sessionData.sessionType}
        password={sessionData.password}
        maxParticipants={sessionData.maxParticipants}
        onChange={onChange}
        onPasswordChange={onPasswordChange}
        onParticipantsChange={onParticipantsChange}
      />
    </div>
  );
};


// ===== DESCRIPTION PANEL =====

// export the DescriptionPanel as a named export
export const DescriptionPanel = ({ value, onChange }) => {
  return (
    <div className="col-span-2 bg-[#1a1a1a] rounded-2xl p-6">
      <h3 className="text-white font-bold text-xl mb-6">Session Overview</h3>

      <textarea
        name="description"
        value={value}
        onChange={onChange}
        placeholder="Write an overview of the session..."
        rows={18}
        className="w-full px-4 py-3 bg-[#0f0f0f] border border-gray-800 rounded-lg text-gray-300 text-sm resize-none focus:outline-none focus:border-indigo-500 transition-colors"
      />
    </div>
  );
};


export default SessionHeader;