export const formatDate = (isoString: string): string => {
    if (!isoString) return "Invalid Date";
  
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "Invalid Date";
  
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
  
    return `${day}/${month}/${year}`;
  };
  
  export const isExpired = (isoString: string): boolean => {
    if (!isoString) return true; // If no date is provided, consider it expired.
  
    const currentDate = new Date();
    const targetDate = new Date(isoString);
  
    if (isNaN(targetDate.getTime())) return true; // If the date is invalid, consider it expired.
  
    return targetDate < currentDate; // Returns true if the target date is in the past.
  };
  