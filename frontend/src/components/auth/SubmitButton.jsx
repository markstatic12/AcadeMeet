import React from 'react';

const SubmitButton = ({ loading }) => {
  return (
    <button
      type="submit"
      disabled={loading}
      className="group relative w-full py-3 text-sm bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold rounded-xl hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#1a1a2e] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-indigo-500/30 hover-scale transform overflow-hidden"
    > 
      Login
    </button>
  );
};

export default SubmitButton;
