/**
 * Authentication Utility Functions
 * 
 * This file contains utility functions for authentication-related operations
 * such as token validation, token decoding, and authentication state management.
 */

import { jwtDecode } from 'jwt-decode';

/**
 * Validates a JWT token by checking if it exists and hasn't expired
 * @param {string} token - The JWT token to validate
 * @returns {Object} - Object containing validation result and additional information
 */
export const validateToken = (token) => {
  if (!token) {
    return { valid: false, error: 'No token provided' };
  }
  
  try {
    // Decode the token to get its payload
    const decoded = jwtDecode(token);
    
    // Check if token has expiration claim
    if (!decoded.exp) {
      return { 
        valid: false, 
        error: 'Token has no expiration date',
        payload: decoded
      };
    }
    
    // Check if token is expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      return { 
        valid: false, 
        error: 'Token expired', 
        expiredAt: new Date(decoded.exp * 1000).toLocaleString(),
        currentTime: new Date().toLocaleString(),
        payload: decoded
      };
    }
    
    // Token is valid
    return { 
      valid: true, 
      payload: decoded,
      expiresAt: new Date(decoded.exp * 1000).toLocaleString() 
    };
  } catch (error) {
    return { 
      valid: false, 
      error: `Token validation error: ${error.message}` 
    };
  }
};

/**
 * Safely clears authentication state from localStorage and memory
 */
export const clearAuthState = () => {
  try {
    localStorage.removeItem('user');
    return true;
  } catch (error) {
    console.error('Error clearing auth state:', error);
    return false;
  }
};

/**
 * Gets the base API URL from environment variables or defaults to relative path
 * @returns {string} - The base API URL
 */
export const getApiBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || '';
};