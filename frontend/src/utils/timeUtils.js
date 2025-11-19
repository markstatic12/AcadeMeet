// Format a 24-hour time string (HH:mm) to 12-hour with AM/PM
export const to12Hour = (t) => {
  if (!t || typeof t !== 'string' || !t.includes(':')) return '';
  const [hh, mm] = t.split(':');
  let h = parseInt(hh, 10);
  if (Number.isNaN(h)) return '';
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${mm} ${ampm}`;
};
