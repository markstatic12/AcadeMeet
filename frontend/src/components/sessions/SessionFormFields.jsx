import React from 'react';

// ===== SESSION TITLE INPUT =====
export const SessionTitleInput = ({ value, onChange }) => (
  <input
    type="text"
    name="title"
    value={value}
    onChange={onChange}
    placeholder="Enter Session Name"
    className="w-full bg-transparent text-4xl font-bold text-indigo-300 placeholder-indigo-300/50 focus:outline-none focus:text-white transition-colors"
  />
);

// ===== LOCATION INPUT WITH TYPE SELECTOR =====
export const LocationInput = ({ locationType, location, onChange }) => (
  <div className="mb-6">
    <div className="mb-3 flex gap-2">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name="locationType"
          value="in-person"
          checked={locationType === 'in-person'}
          onChange={onChange}
          className="accent-indigo-500"
        />
        <span className="text-sm text-gray-300">In-Person</span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name="locationType"
          value="online"
          checked={locationType === 'online'}
          onChange={onChange}
          className="accent-indigo-500"
        />
        <span className="text-sm text-gray-300">Online</span>
      </label>
    </div>

    <input
      type="text"
      name="location"
      value={location}
      onChange={onChange}
      placeholder={locationType === 'online' ? 'Enter link or call URL' : 'Enter location'}
      className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg text-gray-300 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
    />
  </div>
);

// ===== DESCRIPTION PANEL =====
export const DescriptionPanel = ({ value, onChange }) => (
  <div className="col-span-2 bg-[#1a1a1a] rounded-2xl p-6">
    <h3 className="text-white font-bold text-xl mb-6">Session Overview</h3>
    <textarea
      name="description"
      value={value}
      onChange={onChange}
      placeholder="Describe the session..."
      rows={18}
      className="w-full px-4 py-3 bg-[#0f0f0f] border border-gray-800 rounded-lg text-gray-300 text-sm resize-none focus:outline-none focus:border-indigo-500 transition-colors"
    />
  </div>
);

export default { SessionTitleInput, LocationInput, DescriptionPanel };