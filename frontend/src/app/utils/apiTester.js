/**
 * API Testing Utility
 * 
 * This utility provides functions to test API endpoints and diagnose connection issues.
 */

/**
 * Tests an API endpoint with various configurations
 * @param {string} endpoint - The API endpoint to test
 * @param {Object} options - Test options
 * @returns {Promise<Object>} - Test results
 */
export const testApiEndpoint = async (endpoint, options = {}) => {
  const {
    method = 'GET',
    token = null,
    body = null,
    baseUrls = [
      '', // Relative URL (uses Next.js API routes)
      'http://localhost:5000', // Direct backend URL
      process.env.NEXT_PUBLIC_API_URL || '' // Environment variable URL
    ],
    timeout = 5000,
    includeCredentials = true
  } = options;
  
  const results = [];
  
  // Test each base URL
  for (const baseUrl of baseUrls) {
    if (!baseUrl && baseUrls.length > 1) continue; // Skip empty base URL if we have alternatives
    
    const fullUrl = `${baseUrl}${endpoint}`;
    const result = {
      url: fullUrl,
      success: false,
      status: null,
      statusText: null,
      timing: null,
      error: null,
      data: null
    };
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const startTime = performance.now();
      
      const fetchOptions = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
        ...(includeCredentials ? { credentials: 'include' } : {}),
        signal: controller.signal
      };
      
      const response = await fetch(fullUrl, fetchOptions);
      clearTimeout(timeoutId);
      
      const endTime = performance.now();
      result.timing = `${(endTime - startTime).toFixed(2)}ms`;
      
      result.status = response.status;
      result.statusText = response.statusText;
      
      // Try to parse response as JSON
      try {
        result.data = await response.json();
      } catch (e) {
        // If not JSON, get text
        result.data = await response.text();
      }
      
      result.success = response.ok;
    } catch (error) {
      result.error = error.name === 'AbortError' 
        ? `Request timed out after ${timeout}ms` 
        : error.message;
    }
    
    results.push(result);
  }
  
  return results;
};

/**
 * Tests all critical API endpoints and returns results
 * @param {string} token - JWT token for authenticated requests
 * @returns {Promise<Object>} - Test results for all endpoints
 */
export const testAllEndpoints = async (token = null) => {
  const endpoints = [
    { path: '/api/users/profile', method: 'GET', requiresAuth: true },
    { path: '/api/auth/login', method: 'POST', requiresAuth: false, body: { email: 'test@example.com', password: 'password' } },
    { path: '/api/auth/refresh', method: 'POST', requiresAuth: false, body: { token } }
  ];
  
  const results = {};
  
  for (const endpoint of endpoints) {
    const options = {
      method: endpoint.method,
      ...(endpoint.requiresAuth && token ? { token } : {}),
      ...(endpoint.body ? { body: endpoint.body } : {})
    };
    
    results[endpoint.path] = await testApiEndpoint(endpoint.path, options);
  }
  
  return results;
};

/**
 * Logs API test results to console in a formatted way
 * @param {Object} results - Results from testAllEndpoints
 */
export const logApiTestResults = (results) => {
  console.group('🔌 API Connection Test Results');
  
  for (const [endpoint, tests] of Object.entries(results)) {
    console.group(`Endpoint: ${endpoint}`);
    
    tests.forEach((test, index) => {
      console.group(`Test ${index + 1}: ${test.url}`);
      console.log(`Status: ${test.status || 'N/A'} ${test.statusText || ''}`);
      console.log(`Success: ${test.success}`);
      console.log(`Timing: ${test.timing || 'N/A'}`);
      
      if (test.error) {
        console.error(`Error: ${test.error}`);
      }
      
      if (test.data) {
        console.log('Response data:', test.data);
      }
      
      console.groupEnd();
    });
    
    console.groupEnd();
  }
  
  console.groupEnd();
};

/**
 * Run and log API tests in one step
 * @param {string} token - JWT token for authenticated requests
 * @returns {Promise<Object>} - Test results
 */
export const runApiTests = async (token = null) => {
  const results = await testAllEndpoints(token);
  logApiTestResults(results);
  return results;
};