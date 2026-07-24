'use client';

import { useAuth } from '../context/AuthContext';

export default function FooterLinks() {
  const { user } = useAuth();
  
  return (
    <ul className="space-y-2">
      <li><a href="/" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
      {user ? (
        // Show profile and dashboard links for logged in users
        <>
          <li><a href="/profile" className="text-gray-400 hover:text-white transition-colors">Profile</a></li>
          <li>
            <a 
              href={user.role === 'student' ? '/dashboard/student' : '/dashboard/teacher'} 
              className="text-gray-400 hover:text-white transition-colors"
            >
              Dashboard
            </a>
          </li>
        </>
      ) : (
        // Show login and register links for guests
        <>
          <li><a href="/login" className="text-gray-400 hover:text-white transition-colors">Login</a></li>
          <li><a href="/register" className="text-gray-400 hover:text-white transition-colors">Register</a></li>
        </>
      )}
    </ul>
  );
}