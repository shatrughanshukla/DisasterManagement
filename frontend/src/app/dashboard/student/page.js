'use client';


import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { FaBook, FaCalendarAlt, FaClipboardList, FaBell, FaUserCircle } from 'react-icons/fa';
import AuthDiagnosticTool from '@/app/components/AuthDiagnosticTool';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import NotificationsList from '@/app/components/NotificationsList';
import DashboardHeader from '@/app/components/DashboardHeader';


// small, accessible progress bar
function ProgressBar({ value = 0, label = 'Progress' }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-gray-600">{label}</span>
        <span className="text-xs text-gray-500">{pct}%</span>
      </div>
      <div
        className="w-full h-2 bg-gray-200 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label={label}
      >
        <div
          className="h-2 bg-gradient-to-r from-blue-600 to-indigo-600"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function StudentDashboard() {
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
        
        // Verify user role is student, redirect otherwise
        if (profileData.role !== 'student') {
          console.log('User is not a student, redirecting');
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
}, []); // getUserProfile is intentionally excluded from dependencies to prevent infinite loops
  
  // Show loading spinner when fetching profile
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 text-lg">Loading student dashboard...</p>
      </div>
    );
  }
  // If you want to vary the dummy progress per card, tweak these:
  const modules = [
    {
      key: 'earthquake',
      title: 'Earthquake',
      href: '/dashboard/student/earthquakes',
      progress: 45,
      accent: 'from-blue-600 to-indigo-600',
      img: { src: '/earthquake.png', alt: 'Seismic landscape representing earthquake preparedness' },
    },
    {
      key: 'fire',
      title: 'Fire',
      href: '/dashboard/student/fire',
      progress: 10,
      accent: 'from-rose-600 to-orange-600',
      img: { src: '/fire.jpg', alt: 'Fire safety imagery with flames and smoke' },
    },
    {
      key: 'flood',
      title: 'Flood',
      href: '/dashboard/student/flood',
      progress: 30,
      accent: 'from-cyan-600 to-blue-600',
      img: { src: '/flood.jpg', alt: 'Flooded street representing flood preparedness' },
    },

  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-700 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <DashboardHeader user={user} logout={logout} />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 py-2 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">

        {/* Header with welcome banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-6 mb-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {user?.name || 'Student'}!</h1>
              <p className="mt-2 text-blue-100">Your disaster management training dashboard</p>
            </div>
            {/* <div className="mt-4 md:mt-0 flex items-center">
              {user?.profilePic ? (
                <img 
                  src={user.profilePic} 
                  alt="Profile" 
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow" 
                />
              ) : (
                <img 
                  src="/uploads/default.png" 
                  alt="Default Profile" 
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow" 
                />
              )}
              <div className="ml-4">
                <p className="font-medium">{user?.username || 'student@example.com'}</p>
                <p className="text-sm text-blue-200">Student</p>
              </div>
            </div> */}
          </div>
        </div>

          {/* Notifications */}
          <div className="bg-white rounded-xl shadow-md p-5 sm:p-6">
            <div className="flex items-center justify-between mb-0 ">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Alerts!</h2>
              {/* optional: a small refresh hint or time */}
            </div>
            <NotificationsList />
          </div>

          {/* Three cards in a row (stack on small) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {modules.map((m) => (
              <div key={m.key} className="bg-white rounded-xl shadow-md p-5 sm:p-6 flex flex-col">
                <div className="mb-4">
                  <div className={`inline-flex items-center rounded-lg px-3 py-1 text-sm font-medium text-white bg-gradient-to-r ${m.accent} shadow-sm`}>
                    {m.title}
                  </div>
                </div>

                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-3">
                    Continue your learning module on {m.title.toLowerCase()} preparedness.
                  </p>
                                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg mb-3">
                  <img
                    src={m.img.src}
                    alt={m.img.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </div>
                  <ProgressBar value={m.progress} label={`${m.title} module`} />
                </div>

                <div className="mt-5">
                  <Link
                    href={m.href}
                    className="inline-flex items-center justify-center gap-2 w-full sm:w-auto rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 shadow-sm transition-colors"
                    prefetch
                  >
                    Continue
                    <FaArrowRight aria-hidden="true" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
        {/* Add the diagnostic tool for debugging authentication issues */}
        <AuthDiagnosticTool />
      </div>
    </>
  );
}
