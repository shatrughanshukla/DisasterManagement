/**
 * Server-side date formatting utilities
 * These functions ensure consistent date formatting on the server
 */

/**
 * Format a date for server-side rendering
 * @param {string|Date} date - Date to format
 * @param {string} locale - Locale to use (default: 'en-US')
 * @returns {string} Formatted date string
 */
export function formatServerDate(date, locale = 'en-US') {
  if (!date) return '—';
  
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    // Use a consistent format for server rendering
    return dateObj.toLocaleString(locale, options);
  } catch (error) {
    console.error('Error formatting date on server:', error);
    return '—';
  }
}

/**
 * Pre-format dates for client hydration
 * This function takes an object with date fields and pre-formats them
 * to ensure consistent rendering between server and client
 * 
 * @param {Object} data - Data object containing date fields
 * @param {Array<string>} dateFields - Array of field names that contain dates
 * @param {string} locale - Locale to use for formatting
 * @returns {Object} Object with pre-formatted date fields
 */
export function prepareDataForHydration(data, dateFields = [], locale = 'en-US') {
  if (!data) return data;
  
  const result = { ...data };
  
  for (const field of dateFields) {
    if (result[field]) {
      result[`${field}Formatted`] = formatServerDate(result[field], locale);
    }
  }
  
  return result;
}