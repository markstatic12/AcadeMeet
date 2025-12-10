/**
 * Format date to "Sep 31, 2025"
 */
export const formatDate = (month, day, year) => {
  const monthAbbr = month ? month.substring(0, 3) : 'N/A';
  return `${monthAbbr} ${day}, ${year}`;
};

/**
 * Format time to "9:00 AM"
 * Handles both 24-hour format (HH:mm) and 12-hour format (h:mm a)
 */
export const formatTime = (timeString) => {
  if (!timeString) return 'N/A';
  
  try {
    // Check if time already includes AM/PM
    if (timeString.toLowerCase().includes('am') || timeString.toLowerCase().includes('pm')) {
      return timeString; // Already formatted, return as is
    }
    
    // Convert from 24-hour format to 12-hour format
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  } catch (e) {
    console.error("Error formatting time:", e);
    return timeString;
  }
};
