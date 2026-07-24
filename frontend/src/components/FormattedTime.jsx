'use client';

import { useState, useEffect } from 'react';
import ClientOnly from './ClientOnly';
import { formatTime, formatDate } from '../lib/dateUtils';

/**
 * A component for displaying formatted time with proper hydration handling
 * Renders a placeholder during SSR and updates with the correct time on the client
 * 
 * @param {Object} props - Component props
 * @param {string|Date} props.time - The time to format (ISO string, timestamp, or Date object)
 * @param {string} props.format - Format to use: 'time' or 'date' (default: 'time')
 * @param {string} props.className - Optional CSS class name
 */
export default function FormattedTime({ time, format = 'time', className = '' }) {
  // Use a placeholder for SSR to avoid hydration mismatch
  const [formattedValue, setFormattedValue] = useState('—');
  
  useEffect(() => {
    // Update the formatted value on the client side only
    if (time) {
      try {
        if (format === 'time') {
          setFormattedValue(formatTime(time));
        } else if (format === 'date') {
          setFormattedValue(formatDate(time));
        }
      } catch (error) {
        console.error('Error formatting time:', error);
        setFormattedValue('—');
      }
    }
  }, [time, format]);
  
  return (
    <ClientOnly fallback={<span className={className}>—</span>}>
      <span className={className}>{formattedValue}</span>
    </ClientOnly>
  );
}