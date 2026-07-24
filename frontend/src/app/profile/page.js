'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { FaUserCircle, FaEnvelope, FaIdCard, FaUserGraduate, FaChalkboardTeacher, FaSignOutAlt } from 'react-icons/fa';

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    // If not loading and no user, redirect to login
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3 bg-gradient-to-b from-blue-600 to-indigo-700 p-8 text-center">
            <div className="flex justify-center">
              {user.profilePic ? (
                <img 
                  src={user.profilePic} 
                  alt="Profile" 
                  className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg" 
                />
              ) : (
                <img 
                  src="/uploads/default.png" 
                  alt="Default Profile" 
                  className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg" 
                />
              )}
            </div>
            <h2 className="mt-6 text-xl font-bold text-white">{user.name}</h2>
            <p className="text-blue-200 text-sm">{user.role === 'student' ? 'Student' : 'Teacher'}</p>
            
            <div className="mt-8 border-t border-blue-500 pt-4">
              <button 
                onClick={logout}
                className="mt-4 flex items-center justify-center w-full text-white bg-blue-800 bg-opacity-30 hover:bg-opacity-50 px-4 py-2 rounded-lg transition-colors"
              >
                <FaSignOutAlt className="mr-2" />
                Sign Out
              </button>
            </div>
          </div>
          
          <div className="md:w-2/3 p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile Information</h1>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <FaIdCard className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                  <p className="text-base font-medium text-gray-900">{user.name}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <FaUserCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Username</h3>
                  <p className="text-base font-medium text-gray-900">{user.username}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <FaEnvelope className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                  <p className="text-base font-medium text-gray-900">{user.email}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  {user.role === 'student' ? (
                    <FaUserGraduate className="h-5 w-5 text-blue-600" />
                  ) : (
                    <FaChalkboardTeacher className="h-5 w-5 text-blue-600" />
                  )}
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Role</h3>
                  <p className="text-base font-medium text-gray-900 capitalize">{user.role}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Dashboard Access</h2>
              <a 
                href={user.role === 'student' ? '/dashboard/student' : '/dashboard/teacher'}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Go to Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}