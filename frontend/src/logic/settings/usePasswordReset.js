import { useState, useEffect } from 'react';

export const usePasswordReset = () => {
  const [curr, setCurr] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const s = localStorage.getItem('student');
    if (s) {
      setStudent(JSON.parse(s));
    }
  }, []);

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
    if (!student) {
      showToast('No user', 'error');
      return false;
    }
    return true;
  };

  const submit = async (showToast) => {
    if (!validatePassword(showToast)) return;

    try {
      setBusy(true);
      const res = await fetch('http://localhost:8080/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: student.id,
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
