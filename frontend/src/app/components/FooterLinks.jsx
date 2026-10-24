'use client';

import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function FooterLinks() {
  const { user } = useAuth();

  return (
    <ul className="space-y-2">
      <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
      {user ? (
        // Show profile and dashboard links for logged in users
        <>
          <li><Link to="/profile" className="text-gray-400 hover:text-white transition-colors">Profile</Link></li>
          <li>
            <Link
              to={user.role === 'student' ? '/dashboard/student' : '/dashboard/teacher'}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Dashboard
            </Link>
          </li>
        </>
      ) : (
        // Show login and register links for guests
        <>
          <li><Link to="/login" className="text-gray-400 hover:text-white transition-colors">Login</Link></li>
          <li><Link to="/register" className="text-gray-400 hover:text-white transition-colors">Register</Link></li>
        </>
      )}
    </ul>
  );
}
