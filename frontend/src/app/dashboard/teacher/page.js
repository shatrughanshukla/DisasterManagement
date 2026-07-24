'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import AuthDiagnosticTool from '@/app/components/AuthDiagnosticTool';
import { FaBook, FaUsers, FaClipboardList, FaBell, FaUserTie, FaChalkboardTeacher } from 'react-icons/fa';

export default function TeacherDashboard() {
  const { user, loading, getUserProfile, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  
  const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  // If not loading and no user, redirect to login
  if (!loading && !user) {
    console.log('No user detected, redirecting to login');
    router.push('/login');
    return; // Early return prevents further execution
  }
  
  // If user exists, get the latest profile data
  if (user) {
    let isMounted = true; // Flag to track component mount state
    
    // Set loading state before API call
    setIsLoading(true);
    
    // Add a small delay to prevent rapid consecutive calls
    const timeoutId = setTimeout(async () => {
      try {
        // Get user profile data with allowRetry=false to prevent infinite loops
        const profileData = await getUserProfile(false);
        
        // If component unmounted during the API call, don't update state
        if (!isMounted) {
          console.log('Component unmounted, skipping state updates');
          return;
        }
        
        console.log('Profile loaded successfully');
        setIsLoading(false);
        
        // If profile data is null, redirect to login
        if (!profileData) {
          console.log('No profile data returned, redirecting to login');
          router.push('/login');
          return;
        }
        
        // Verify user role is teacher, redirect otherwise
        if (profileData.role !== 'teacher') {
          console.log('User is not a teacher, redirecting');
          router.push(`/dashboard/${profileData.role}`);
          return;
        }
      } catch (error) {
        // Only update state and redirect if component is still mounted
        if (isMounted) {
          console.error('Error fetching user profile:', error);
          setIsLoading(false);
          router.push('/login');
        }
      }
    }, 300);
    
    // Cleanup function to handle unmounting
    return () => {
      console.log('Dashboard useEffect cleanup - preventing state updates after unmount');
      clearTimeout(timeoutId);
      isMounted = false;
    };
  } else {
    setIsLoading(false);
  }
}, [loading, user, router]); // getUserProfile is intentionally excluded from dependencies to prevent infinite loops
  
  // Show loading spinner when fetching profile
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 text-lg">Loading teacher dashboard...</p>
      </div>
    );
  }

  const renderTabContent = () => {
    switch(activeTab) {
      case 'overview':
        return (
          <div className="bg-white rounded-lg shadow-md p-6 w-full">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                <div className="flex items-center">
                  <div className="bg-indigo-500 rounded-full p-3 mr-4">
                    <FaBook className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">Courses</h3>
                    <p className="text-2xl font-bold text-indigo-600">3</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <div className="flex items-center">
                  <div className="bg-amber-500 rounded-full p-3 mr-4">
                    <FaUsers className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">Students</h3>
                    <p className="text-2xl font-bold text-amber-600">42</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                <div className="flex items-center">
                  <div className="bg-teal-500 rounded-full p-3 mr-4">
                    <FaClipboardList className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">Assignments</h3>
                    <p className="text-2xl font-bold text-teal-600">12</p>
                  </div>
                </div>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold mb-3 text-gray-700">Recent Activities</h3>
            <div className="space-y-3">
              {[
                { title: 'New Disaster Preparedness Course Published', time: '1 hour ago', icon: FaBook },
                { title: 'Graded: Earthquake Safety Assignments', time: 'Yesterday', icon: FaClipboardList },
                { title: 'Added 5 new students to Flood Management course', time: '2 days ago', icon: FaUsers }
              ].map((activity, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-md">
                  <activity.icon className="text-gray-500 mr-3" />
                  <div>
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'courses':
        return (
          <div className="bg-white rounded-lg shadow-md p-6 w-full">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">My Courses</h2>
            <div className="space-y-4">
              {[
                { title: 'Earthquake Safety and Preparedness', students: 18, progress: 65 },
                { title: 'Flood Management and Response', students: 15, progress: 42 },
                { title: 'Fire Safety Protocols', students: 9, progress: 78 }
              ].map((course, index) => (
                <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-lg">{course.title}</h3>
                    <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {course.students} students
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-indigo-600 h-2.5 rounded-full" 
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'students':
        return (
          <div className="bg-white rounded-lg shadow-md p-6 w-full">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Students</h2>
            <p className="text-gray-700">Your student list will appear here.</p>
          </div>
        );
      case 'assignments':
        return (
          <div className="bg-white rounded-lg shadow-md p-6 w-full">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Assignments</h2>
            <p className="text-gray-700">Your assignments will appear here.</p>
          </div>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-700 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-center flex-col mb-6 pt-2">
              {user?.profilePic ? (
                <img 
                  src={user.profilePic} 
                  alt="Profile" 
                  className="w-16 h-16 rounded-full object-cover mb-2" 
                />
              ) : (
                <img 
                  src="/uploads/default.png" 
                  alt="Default Profile" 
                  className="w-16 h-16 rounded-full object-cover mb-2" 
                />
              )}
              <h2 className="text-xl font-bold text-gray-800">{user?.name || 'Loading...'}</h2>
              <p className="text-sm text-gray-500">{user?.email || 'teacher@example.com'}</p>
            </div>
            
            <nav className="space-y-1">
              {[
                { name: 'Overview', id: 'overview', icon: FaChalkboardTeacher },
                { name: 'My Courses', id: 'courses', icon: FaBook },
                { name: 'Students', id: 'students', icon: FaUsers },
                { name: 'Assignments', id: 'assignments', icon: FaClipboardList },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center w-full px-4 py-3 text-left rounded-md transition-colors ${activeTab === item.id ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100 text-gray-700'}`}
                >
                  <item.icon className="mr-3" />
                  <span className="font-medium">{item.name}</span>
                </button>
              ))}
              {/* Profile and Logout */}
              <div className="pt-4 mt-4 border-t border-gray-200">
                <button
                  onClick={() => router.push('/profile')}
                  className="flex items-center w-full px-4 py-3 text-left rounded-md hover:bg-gray-100 text-gray-700 transition-colors"
                >
                  <FaUserTie className="mr-3 text-indigo-500" />
                  <span className="font-medium">My Profile</span>
                </button>
                
                <button
                  onClick={logout}
                  className="flex items-center w-full px-4 py-3 text-left rounded-md hover:bg-red-50 text-red-600 transition-colors mt-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </nav>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Teacher Dashboard</h1>
              <p className="text-gray-700">Welcome back, {user?.name || 'Teacher'}! Here's your disaster management teaching overview.</p>
            </div>
            {renderTabContent()}
          </div>
        </div>
      </div>
      
      {/* Add the diagnostic tool for debugging authentication issues */}
      <AuthDiagnosticTool />
    </div>
  );
}