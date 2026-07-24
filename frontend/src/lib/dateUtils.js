'use client';

import React from 'react';

/**
 * Utility functions for consistent date and time formatting across the application
 * Designed to prevent hydration mismatches between server and client rendering
 */

/**
 * Format a date to a consistent locale string
 * @param {Date|string|number} date - Date object, ISO string, or timestamp
 * @returns {string} Formatted date string
 */
export function formatDate(date) {
  // Use a consistent locale and format options
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return formatWithOptions(date, options);
}

/**
 * Format a date to show only time
 * @param {Date|string|number} date - Date object, ISO string, or timestamp
 * @returns {string} Formatted time string
 */
export function formatTime(date) {
  // Use a consistent locale and format options for time only
  const options = { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true
  };
  return formatWithOptions(date, options).toUpperCase(); // Ensure consistent casing
}

/**
 * Format a date with specific options
 * @param {Date|string|number} date - Date object, ISO string, or timestamp
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export function formatWithOptions(date, options) {
  if (!date) return '—';
  
  try {
    // Ensure we have a Date object
    const dateObj = date instanceof Date ? date : new Date(date);
    // Use a consistent locale
    return dateObj.toLocaleString('en-US', options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '—';
  }
}

/**
 * Client-side only component for displaying the current time
 * Use this component when you need to display the current time
 * and want to avoid hydration mismatches
 */
export function ClientTime({ format = 'time' }) {
  const [formattedTime, setFormattedTime] = React.useState('—');
  
  React.useEffect(() => {
    // Update on mount
    updateTime();
    
    // Set up interval to update time
    const intervalId = setInterval(updateTime, 60000); // Update every minute
    
    // Clean up interval
    return () => clearInterval(intervalId);
    
    function updateTime() {
      const now = new Date();
      if (format === 'time') {
        setFormattedTime(formatTime(now));
      } else if (format === 'date') {
        setFormattedTime(formatDate(now));
      } else {
        setFormattedTime(formatWithOptions(now, format));
      }
    }
  }, [format]);
  
  return formattedTime;
}