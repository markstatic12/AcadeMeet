import { useState } from 'react';
import { useUser } from '../../context/UserContext';

export const usePasswordReset = () => {
  const { getUserId } = useUser();
  const [curr, setCurr] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);

  const reset = () => {
    setCurr('');
    setNext('');
    setConfirm('');
  };

  const validatePassword = (showToast) => {
    if (next.length < 6) {
      showToast('New password must be at least 6 characters', 'error');
      return false;
    }
    if (next !== confirm) {
      showToast('New password and confirmation do not match', 'error');
      return false;
    }
    const userId = getUserId();
    if (!userId) {
      showToast('No user', 'error');
      return false;
    }
    return true;
  };

  const submit = async (showToast) => {
    if (!validatePassword(showToast)) return;
    const userId = getUserId();

    try {
      setBusy(true);
      const res = await fetch('http://localhost:8080/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          currentPassword: curr,
          newPassword: next,
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        showToast(data?.error || 'Failed to change password', 'error');
      } else {
        showToast('Password updated', 'success');
        reset();
      }
    } catch (e) {
      console.error(e);
      showToast('Failed to change password', 'error');
    } finally {
      setBusy(false);
    }
  };

  return {
    curr,
    next,
    confirm,
    busy,
    setCurr,
    setNext,
    setConfirm,
    reset,
    submit,
  };
};
