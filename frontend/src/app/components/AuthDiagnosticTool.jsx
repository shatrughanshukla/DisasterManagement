'use client';

import { useState } from 'react';
import { diagnoseAuthIssues, validateToken } from '../utils/authDiagnostics';
import { runApiTests } from '../utils/apiTester';

/**
 * A diagnostic tool component that helps debug authentication issues
 * Can be added to any page where authentication debugging is needed
 */
const AuthDiagnosticTool = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isApiTesting, setIsApiTesting] = useState(false);
  const [apiTestResults, setApiTestResults] = useState(null);
  const [manualToken, setManualToken] = useState('');
  const [tokenValidation, setTokenValidation] = useState(null);

  const runDiagnostics = async () => {
    setIsLoading(true);
    try {
      const diagnosticResults = await diagnoseAuthIssues();
      setResults(diagnosticResults);
    } catch (error) {
      console.error('Error running diagnostics:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const testApiConnections = async () => {
    setIsApiTesting(true);
    try {
      // Get token from localStorage if available
      let token = null;
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.token) {
          token = user.token;
        }
      } catch (e) {
        console.error('Error getting token from localStorage:', e);
      }
      
      const results = await runApiTests(token);
      setApiTestResults(results);
    } catch (error) {
      console.error('Error testing API connections:', error);
    } finally {
      setIsApiTesting(false);
    }
  };

  const validateManualToken = () => {
    if (!manualToken.trim()) {
      setTokenValidation({ valid: false, error: 'No token provided' });
      return;
    }

    const validation = validateToken(manualToken);
    setTokenValidation(validation);
  };

  const clearLocalStorage = () => {
    localStorage.removeItem('user');
    alert('Local storage cleared. You will need to log in again.');
    window.location.href = '/login';
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white p-2 rounded-full shadow-lg z-50 opacity-70 hover:opacity-100 transition-opacity"
        title="Auth Diagnostics"
      >
        🔍
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-gray-100 p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Authentication Diagnostic Tool</h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Run Diagnostics</h3>
            <p className="text-gray-600">This will check your authentication status, token validity, and API connectivity.</p>
            <div className="flex space-x-4">
              <button
                onClick={runDiagnostics}
                disabled={isLoading}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {isLoading ? 'Running...' : 'Run Auth Diagnostics'}
              </button>
              
              <button
                onClick={testApiConnections}
                disabled={isApiTesting}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {isApiTesting ? 'Testing...' : 'Test API Connections'}
              </button>
            </div>
          </div>

          {apiTestResults && (
            <div className="border rounded-lg p-4 bg-gray-50 space-y-4">
              <h3 className="text-lg font-semibold">API Test Results</h3>
              
              {Object.entries(apiTestResults).map(([endpoint, tests]) => (
                <div key={endpoint} className="mb-4">
                  <h4 className="font-medium">{endpoint}</h4>
                  
                  {tests.map((test, index) => (
                    <div key={index} className="mb-2 bg-white p-2 rounded border">
                      <div className="flex justify-between">
                        <span className="font-medium">{test.url}</span>
                        <span className={`px-2 py-0.5 rounded text-sm ${test.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {test.status || 'Failed'} {test.statusText || ''}
                        </span>
                      </div>
                      {test.error && (
                        <div className="text-red-600 text-sm mt-1">{test.error}</div>
                      )}
                      <div className="text-gray-500 text-sm">Response time: {test.timing || 'N/A'}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
          
          {results && (
            <div className="border rounded-lg p-4 bg-gray-50 space-y-4">
              <h3 className="text-lg font-semibold">Results</h3>
              
              <div>
                <h4 className="font-medium">Environment</h4>
                <div className="bg-white p-2 rounded border overflow-x-auto">
                  <pre className="text-sm">{JSON.stringify(results.environment, null, 2)}</pre>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium">LocalStorage User</h4>
                <div className="bg-white p-2 rounded border overflow-x-auto">
                  <pre className="text-sm">{JSON.stringify(results.localStorage, null, 2)}</pre>
                </div>
              </div>
              
              {results.tokenValidation && results.tokenValidation.valid !== undefined && (
                <div>
                  <h4 className="font-medium">Token Validation</h4>
                  <div className={`p-2 rounded border ${results.tokenValidation.valid ? 'bg-green-50' : 'bg-red-50'}`}>
                    {results.tokenValidation.valid ? (
                      <div className="text-green-700">✓ Token is valid</div>
                    ) : (
                      <div className="text-red-700">✗ {results.tokenValidation.error}</div>
                    )}
                    <pre className="text-sm mt-2 bg-white p-2 rounded">{JSON.stringify(results.tokenValidation, null, 2)}</pre>
                  </div>
                </div>
              )}
              
              <div>
                <h4 className="font-medium">API Tests</h4>
                {results.apiTests.map((test, index) => (
                  <div key={index} className="mb-2 bg-white p-2 rounded border">
                    <div className="flex justify-between">
                      <span className="font-medium">{test.endpoint}</span>
                      <span className={`px-2 py-0.5 rounded text-sm ${test.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {test.status} {test.statusText}
                      </span>
                    </div>
                    {test.error && (
                      <div className="text-red-600 text-sm mt-1">{test.error}</div>
                    )}
                    <div className="text-gray-500 text-sm">Response time: {test.timing.total}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-4">Manual Token Validation</h3>
            <div className="space-y-2">
              <textarea
                value={manualToken}
                onChange={(e) => setManualToken(e.target.value)}
                placeholder="Paste JWT token here"
                className="w-full p-2 border rounded h-24"
              />
              <button
                onClick={validateManualToken}
                className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded"
              >
                Validate Token
              </button>
            </div>
            
            {tokenValidation && (
              <div className={`mt-4 p-3 rounded ${tokenValidation.valid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                {tokenValidation.valid ? (
                  <div>
                    <div className="text-green-700 font-medium">✓ Token is valid</div>
                    <div className="text-sm mt-1">Expires: {tokenValidation.expiresAt}</div>
                  </div>
                ) : (
                  <div className="text-red-700">
                    ✗ {tokenValidation.error}
                    {tokenValidation.expiredAt && (
                      <div className="text-sm mt-1">
                        Expired at: {tokenValidation.expiredAt}<br />
                        Current time: {tokenValidation.currentTime}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">Troubleshooting Actions</h3>
            <div className="space-y-2">
              <button
                onClick={clearLocalStorage}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Clear Auth Data & Redirect to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthDiagnosticTool;