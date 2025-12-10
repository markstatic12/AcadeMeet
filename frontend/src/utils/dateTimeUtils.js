export const formatDate = (month, day, year) => {
  const monthAbbr = month ? month.substring(0, 3) : 'N/A';
  return `${monthAbbr} ${day}, ${year}`;
};


export const formatTime = (timeString) => {
  if (!timeString) return 'N/A';
  
  try {
    if (timeString.toLowerCase().includes('am') || timeString.toLowerCase().includes('pm')) {
      return timeString; 
    }
    
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
