'use client';

import { createContext, useContext, useState } from 'react';
import Toast from '../components/Toast';

// Create context
const ToastContext = createContext();

/**
 * Toast provider component that manages toast notifications
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  /**
   * Show a toast notification
   * @param {string} message - Message to display
   * @param {string} type - Type of toast (success, error, warning, info)
   * @param {number} duration - Duration in ms to show toast
   */
  const showToast = (message, type = 'info', duration = 5000) => {
    // Use a more unique ID by combining timestamp with a random number
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setToasts((prevToasts) => [...prevToasts, { id, message, type, duration }]);
  };

  /**
   * Remove a toast notification
   * @param {number} id - ID of toast to remove
   */
  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  // Convenience methods for different toast types
  const showSuccessToast = (message, duration) => showToast(message, 'success', duration);
  const showErrorToast = (message, duration) => showToast(message, 'error', duration);
  const showWarningToast = (message, duration) => showToast(message, 'warning', duration);
  const showInfoToast = (message, duration) => showToast(message, 'info', duration);

  return (
    <ToastContext.Provider
      value={{
        showToast,
        showSuccessToast,
        showErrorToast,
        showWarningToast,
        showInfoToast,
      }}
    >
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

/**
 * Custom hook to use the toast context
 * @returns {Object} Toast context
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};