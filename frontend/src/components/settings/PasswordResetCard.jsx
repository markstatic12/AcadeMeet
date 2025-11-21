import React from 'react';
import FormField from './FormField';
import { usePasswordReset } from '../../services/SettingsLogic';

const PasswordResetCard = ({ showToast }) => {
  const {
    curr,
    next,
    confirm,
    busy,
    setCurr,
    setNext,
    setConfirm,
    reset,
    submit,
  } = usePasswordReset();

  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white">Password Reset</h3>
      </div>
      <div className="h-px w-full bg-gray-700 my-4" />
      
      <div className="max-w-2xl">
        <div className="space-y-5">
          <FormField
            label="Current Password"
            type="password"
            value={curr}
            onChange={(e) => setCurr(e.target.value)}
            placeholder=""
            required
          />
          
          <FormField
            label="New Password"
            type="password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            placeholder="Enter your new password"
            required
          />
          
          <FormField
            label="Confirm New Password"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Re-enter your new password"
            required
          />
          
          <div className="flex gap-3 pt-2">
            <button
              disabled={busy}
              onClick={reset}
              className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              disabled={busy}
              onClick={() => submit(showToast)}
              className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
            >
              {busy ? 'Saving…' : 'Done'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PasswordResetCard;
