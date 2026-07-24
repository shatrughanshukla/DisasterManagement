/**
 * Authentication Diagnostics Utility
 * 
 * This utility provides functions to help diagnose authentication issues
 * in the application. It includes tools for token validation, API testing,
 * and network diagnostics.
 */

/**
 * Checks if a JWT token is valid and not expired
 * @param {string} token - The JWT token to validate
 * @returns {Object} - Token validity information
 */
export const validateToken = (token) => {
  if (!token) {
    return { valid: false, error: 'No token provided' };
  }
  
  try {
    // Split the token into parts
    const parts = token.split('.');
    if (parts.length !== 3) {
      return { valid: false, error: 'Invalid token format' };
    }
    
    // Decode the payload (middle part)
    const payload = JSON.parse(atob(parts[1]));
    
    // Check expiration
    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < currentTime) {
      return { 
        valid: false, 
        error: 'Token expired', 
        expiredAt: new Date(payload.exp * 1000).toLocaleString(),
        currentTime: new Date().toLocaleString()
      };
    }
    
    return { 
      valid: true, 
      payload,
      expiresAt: payload.exp ? new Date(payload.exp * 1000).toLocaleString() : 'No expiration'
    };
  } catch (error) {
    return { valid: false, error: `Token validation error: ${error.message}` };
  }
};

/**
 * Tests the API endpoint with the provided token
 * @param {string} endpoint - The API endpoint to test
 * @param {string} token - The JWT token to use for authentication
 * @returns {Promise<Object>} - API test results
 */
export const testApiEndpoint = async (endpoint, token) => {
  const startTime = performance.now();
  const results = { endpoint, success: false, timing: {} };
  
  try {
    // Make the request with timing information
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });
    
    const endTime = performance.now();
    results.timing.total = `${(endTime - startTime).toFixed(2)}ms`;
    
    // Get response details
    results.status = response.status;
    results.statusText = response.statusText;
    results.headers = {};
    
    // Convert headers to object
    response.headers.forEach((value, key) => {
      results.headers[key] = value;
    });
    
    // Try to parse response body
    try {
      results.data = await response.json();
    } catch (e) {
      results.data = 'Could not parse response as JSON';
    }
    
    results.success = response.ok;
    return results;
  } catch (error) {
    const endTime = performance.now();
    results.timing.total = `${(endTime - startTime).toFixed(2)}ms`;
    results.error = error.message;
    return results;
  }
};

/**
 * Runs a comprehensive authentication diagnostic
 * @returns {Promise<Object>} - Diagnostic results
 */
export const runAuthDiagnostic = async () => {
  const results = {
    timestamp: new Date().toISOString(),
    environment: {},
    localStorage: {},
    tokenValidation: {},
    apiTests: []
  };
  
  // Check environment
  results.environment = {
    nextPublicApiUrl: process.env.NEXT_PUBLIC_API_URL || 'Not set',
    baseUrl: window.location.origin,
    userAgent: navigator.userAgent
  };
  
  // Check localStorage
  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      results.localStorage.user = {
        found: true,
        hasToken: !!user.token,
        tokenPreview: user.token ? `${user.token.substring(0, 10)}...` : 'No token',
        role: user.role || 'Not specified'
      };
      
      // Validate token
      if (user.token) {
        results.tokenValidation = validateToken(user.token);
      }
      
      // Test API endpoints
      const endpoints = [
        '/api/users/profile',
        '/api/auth/verify'
      ];
      
      for (const endpoint of endpoints) {
        const apiResult = await testApiEndpoint(endpoint, user.token);
        results.apiTests.push(apiResult);
      }
    } else {
      results.localStorage.user = { found: false };
    }
  } catch (error) {
    results.localStorage.error = error.message;
  }
  
  return results;
};

/**
 * Logs diagnostic information to console in a formatted way
 * @param {Object} diagnosticResults - Results from runAuthDiagnostic
 */
export const logDiagnosticResults = (diagnosticResults) => {
  console.group('🔍 Authentication Diagnostic Results');
  console.log('Timestamp:', diagnosticResults.timestamp);
  
  console.group('Environment');
  console.table(diagnosticResults.environment);
  console.groupEnd();
  
  console.group('LocalStorage');
  console.table(diagnosticResults.localStorage.user || diagnosticResults.localStorage.error);
  console.groupEnd();
  
  if (diagnosticResults.tokenValidation.valid !== undefined) {
    console.group('Token Validation');
    console.table(diagnosticResults.tokenValidation);
    console.groupEnd();
  }
  
  console.group('API Tests');
  diagnosticResults.apiTests.forEach((test, index) => {
    console.group(`Test ${index + 1}: ${test.endpoint}`);
    console.log('Status:', test.status, test.statusText);
    console.log('Timing:', test.timing.total);
    console.log('Success:', test.success);
    if (test.error) console.error('Error:', test.error);
    console.log('Response:', test.data);
    console.groupEnd();
  });
  console.groupEnd();
  
  console.groupEnd();
};

/**
 * Run and log diagnostics in one step
 * @returns {Promise<Object>} - Diagnostic results
 */
export const diagnoseAuthIssues = async () => {
  const results = await runAuthDiagnostic();
  logDiagnosticResults(results);
  return results;
};