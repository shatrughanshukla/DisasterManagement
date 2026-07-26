'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function FooterLinks() {
  const { user } = useAuth();

  return (
    <ul className="space-y-2">
      <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
      {user ? (
        // Show profile and dashboard links for logged in users
        <>
          <li><Link href="/profile" className="text-gray-400 hover:text-white transition-colors">Profile</Link></li>
          <li>
            <Link
              href={user.role === 'student' ? '/dashboard/student' : '/dashboard/teacher'}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Dashboard
            </Link>
          </li>
        </>
      ) : (
        // Show login and register links for guests
        <>
          <li><Link href="/login" className="text-gray-400 hover:text-white transition-colors">Login</Link></li>
          <li><Link href="/register" className="text-gray-400 hover:text-white transition-colors">Register</Link></li>
        </>
      )}
    </ul>
  );
}
