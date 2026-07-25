'use client';


import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { FaBook, FaCalendarAlt, FaClipboardList, FaBell, FaUserCircle } from 'react-icons/fa';
import { FaHouseDamage, FaFire, FaWater, FaArrowRight } from 'react-icons/fa';
import AuthDiagnosticTool from '@/app/components/AuthDiagnosticTool';
import Link from 'next/link';
import AlertTicker from '@/app/components/AlertTicker';
import ReadinessRing from '@/app/components/ReadinessRing';
import DashboardHeader from '@/app/components/DashboardHeader';

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
  const modules = [
    {
      key: 'earthquake',
      title: 'Earthquake',
      href: '/dashboard/student/earthquakes',
      progress: 45,
      icon: FaHouseDamage,
      img: { src: '/earthquake.png', alt: 'Seismic landscape representing earthquake preparedness' },
    },
    {
      key: 'fire',
      title: 'Fire',
      href: '/dashboard/student/fire',
      progress: 10,
      icon: FaFire,
      img: { src: '/fire.jpg', alt: 'Fire safety imagery with flames and smoke' },
    },
    {
      key: 'flood',
      title: 'Flood',
      href: '/dashboard/student/flood',
      progress: 30,
      icon: FaWater,
      img: { src: '/flood.jpg', alt: 'Flooded street representing flood preparedness' },
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F4F1E8' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brick mx-auto"></div>
          <p className="mt-4 font-body font-medium" style={{ color: '#1E3A5F' }}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <DashboardHeader user={user} logout={logout} />
      <div className="min-h-screen font-body p-4 py-2 sm:px-6 lg:px-8" style={{ background: '#F4F1E8' }}>
        <div className="max-w-7xl mx-auto space-y-4">

          {/* Welcome banner */}
          <div className="rounded-xl p-6 mb-6 relative overflow-hidden" style={{ background: '#1E3A5F' }}>
            <div
              className="absolute top-0 right-0 bottom-0 w-2"
              style={{ background: '#F4C430' }}
              aria-hidden="true"
            />
            <h1 className="font-display text-2xl md:text-3xl" style={{ color: '#F4F1E8' }}>
              Welcome back, {user?.name || 'Student'}
            </h1>
            <p className="mt-2" style={{ color: '#C7D3E0' }}>Your disaster management training dashboard</p>
          </div>

          {/* Alert ticker */}
          <div>
            <h2 className="font-display text-sm mb-2 uppercase tracking-wide" style={{ color: '#1E3A5F' }}>Alerts</h2>
            <AlertTicker />
          </div>

          {/* Module cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {modules.map((m) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.key}
                  className="bg-white rounded-xl p-5 sm:p-6 flex flex-col border-2"
                  style={{ borderColor: '#E8E2CF' }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center flex-none"
                      style={{ background: '#1E3A5F' }}
                    >
                      <Icon style={{ color: '#F4C430' }} size={20} aria-hidden="true" />
                    </div>
                    <ReadinessRing value={m.progress} label={`${m.title} module progress`} size={48} />
                  </div>

                  <h3 className="font-display text-base mb-2" style={{ color: '#1E3A5F' }}>{m.title}</h3>

                  <div className="flex-1">
                    <p className="text-sm mb-3" style={{ color: '#5A6B7A' }}>
                      Continue your learning module on {m.title.toLowerCase()} preparedness.
                    </p>
                    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg mb-1">
                      <img
                        src={m.img.src}
                        alt={m.img.alt}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="mt-5">
                    <Link
                      href={m.href}
                      className="inline-flex items-center justify-center gap-2 w-full rounded-md text-sm font-medium px-4 py-2 transition-colors"
                      style={{ background: '#B5372F', color: '#F4F1E8' }}
                      prefetch
                    >
                      Continue
                      <FaArrowRight aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
        {/* Add the diagnostic tool for debugging authentication issues */}
        <AuthDiagnosticTool />
      </div>
    </>
  );
}
