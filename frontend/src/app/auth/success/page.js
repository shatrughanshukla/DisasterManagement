'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/app/context/ToastContext';
import { useAuth } from '@/app/context/AuthContext';

export default function AuthSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const { setUser } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  
  // Refs to track state and prevent duplicate operations
  const hasShownToast = useRef(false);
  const hasProcessedAuth = useRef(false);
  const redirectTimer = useRef(null);
  const errorRedirectTimer = useRef(null);
  
  // Set isClient to true once component mounts (client-side only)
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Display initial success message only once
  useEffect(() => {
    if (isClient && !hasShownToast.current) {
      toast.showSuccessToast('Login successful! Redirecting to dashboard...');
      hasShownToast.current = true;
    }
  }, [isClient, toast]);

  // Main authentication logic
  useEffect(() => {
    // Only run on client-side
    if (!isClient) return;
    
    // Get token and userId from URL params
    const token = searchParams.get('token');
    const userId = searchParams.get('userId');

    console.log('Auth Success Page - Token:', token ? 'Present' : 'Missing');
    console.log('Auth Success Page - UserId:', userId ? 'Present' : 'Missing');

    // Prevent processing more than once
    if (hasProcessedAuth.current) return;
    
    // Check if we've already processed this login in a previous session
    const hasProcessed = sessionStorage.getItem('auth_processed');
    
    if (hasProcessed) {
      console.log('Auth already processed, redirecting to dashboard');
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          // Update the AuthContext state with the stored user
          setUser(user);
          const redirectPath = user.role === 'teacher' ? '/dashboard/teacher' : '/dashboard/student';
          router.push(redirectPath);
        } catch (e) {
          console.error('Error parsing stored user:', e);
          router.push('/login');
        }
      } else {
        // If no user in localStorage but we have token/userId in URL, process the auth again
        if (token && userId) {
          console.log('No stored user but have token/userId, processing auth again');
          sessionStorage.removeItem('auth_processed');
        } else {
          router.push('/login');
          return;
        }
      }
      return;
    }
    
    // Mark that we've started processing this authentication
    hasProcessedAuth.current = true;
    
    const processAuthentication = async () => {
      if (!token || !userId) {
        handleAuthError('Missing token or user ID');
        return;
      }
      
      try {
        // Fetch user data to get role and other information
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const profileUrl = `${apiUrl}/api/users/profile`;
        console.log('Fetching user profile from:', profileUrl);
        
        const response = await fetch(profileUrl, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          cache: 'no-store' // Prevent caching issues
        });
        
        console.log('Profile API Response Status:', response.status);
        if (!response.ok) {
          throw new Error(`Failed to fetch user profile: ${response.status}`);
        }
        
        const userData = await response.json();
        console.log('User data received:', userData);
        
        // Create user object with token and user data
        const user = {
          _id: userId,
          name: userData.name,
          email: userData.email,
          username: userData.username,
          role: userData.role || 'student', // Default to student if role is missing
          token: token
        };

        console.log('Saving user to localStorage and AuthContext:', user);
        // Save user to localStorage
        localStorage.setItem('user', JSON.stringify(user));
        
        // Update the AuthContext state with the user
        setUser(user);
        
        // Mark this authentication as processed in session storage AFTER successful profile fetch
        sessionStorage.setItem('auth_processed', 'true');
        
        // Show success message (only if we haven't already)
        if (!hasShownToast.current) {
          toast.showSuccessToast('Successfully logged in with Google!');
          hasShownToast.current = true;
        }
        
        setLoading(false);
        
        // Redirect based on user role
        const redirectPath = userData.role === 'teacher' ? '/dashboard/teacher' : '/dashboard/student';
        console.log('Redirecting to:', redirectPath);
        
        // Add a small delay before redirecting to ensure localStorage is updated
        redirectTimer.current = setTimeout(() => {
          router.push(redirectPath);
        }, 2000);
      } catch (error) {
        console.error('Error during Google auth success:', error);
        handleAuthError(error.message);
      }
    };
    
    const handleAuthError = (errorMessage) => {
      setError(errorMessage);
      setLoading(false);
      toast.showErrorToast(`Authentication error: ${errorMessage}`);
      // Clear the auth processed flag on error
      sessionStorage.removeItem('auth_processed');
      // Clear any existing user data to prevent login loops
      localStorage.removeItem('user');
      // Clear the AuthContext state
      setUser(null);
      errorRedirectTimer.current = setTimeout(() => {
        router.push('/login');
      }, 3000);
    };
    
    processAuthentication();
    
    // Return cleanup function to clear timers and session storage if component unmounts
    return () => {
      if (redirectTimer.current) clearTimeout(redirectTimer.current);
      if (errorRedirectTimer.current) clearTimeout(errorRedirectTimer.current);
    };
  }, [isClient, searchParams, router, toast]); // Add isClient as dependency

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {error ? 'Authentication Error' : 'Completing login...'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {error 
              ? `Error: ${error}. Redirecting to login page...` 
              : 'Please wait while we redirect you to your dashboard.'}
          </p>
        </div>
        <div className="flex justify-center">
          {loading ? (
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          ) : error ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}