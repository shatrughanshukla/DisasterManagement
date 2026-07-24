'use client';

import { useAuth } from '../context/AuthContext';
import { FaUserCircle } from 'react-icons/fa';

export default function AuthButtons() {
  const { user, loading, logout } = useAuth();
  
  // If loading, show a loading state
  if (loading) {
    return (
      <div className="animate-pulse flex space-x-2">
        <div className="h-8 w-20 bg-gray-200 rounded"></div>
        <div className="h-8 w-20 bg-gray-200 rounded"></div>
      </div>
    );
  }
  
  // If user is logged in, show profile and logout
  if (user) {
    return (
      <div className="flex items-center space-x-3">
        <a 
          href="/profile" 
          className="flex items-center space-x-2 bg-white text-blue-700 hover:bg-blue-50 font-medium py-2 px-4 rounded-md transition-colors duration-200 shadow-sm"
        >
          {user.profilePic ? (
            <img 
              src={user.profilePic} 
              alt="Profile" 
              className="h-6 w-6 rounded-full object-cover" 
            />
          ) : (
            <FaUserCircle className="h-5 w-5" />
          )}
          <span>Profile</span>
        </a>
        <a 
          href={user.role === 'student' ? '/dashboard/student' : '/dashboard/teacher'}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 shadow-sm"
        >
          Dashboard
        </a>
      </div>
    );
  }
  
  // Default: show login and register buttons
  return (
    <>
      <a 
        href="/login" 
        className="bg-white text-blue-700 hover:bg-blue-50 font-medium py-2 px-4 rounded-md transition-colors duration-200 shadow-sm"
      >
        Sign In
      </a>
      <a 
        href="/register" 
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 shadow-sm"
      >
        Register
      </a>
    </>
  );
}