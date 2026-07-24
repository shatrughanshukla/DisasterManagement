'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  ShieldAlert,
  MessageSquare,
  Clapperboard,
  Trophy,
  Info,
  UserRound,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Phone,
} from 'lucide-react';

import {useAuth} from "../context/AuthContext";

const HELPLINES = [
  { service: 'General Emergency (all services)', numbers: ['112'] },
  { service: 'Police', numbers: ['100'] },
  { service: 'Fire Service', numbers: ['101'] },
  { service: 'Ambulance', numbers: ['102'] },
  { service: 'NDMA (National Disaster Mgmt Auth)', numbers: ['1078', '011-26701728'] },
  { service: 'NDRF (National Disaster Response F)', numbers: ['011-24363260', '9711077372'] },
  { service: 'Relief Commissioner for Natural Calamities', numbers: ['1070'] },
  { service: 'Medical State Helplines', numbers: ['108'] },
  { service: 'Children Helpline', numbers: ['1098'] },
  { service: 'Women Helpline', numbers: ['1091', '181'] },
  { service: 'Missing Children & Women’s Affairs', numbers: ['1094'] },
  { service: 'SOS to Earthquake/Flood/Disaster', numbers: ['1092'] },
];

const DashboardHeader = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const {logout} = useAuth();

  const profileMenuRef = useRef(null);
  const profileBtnRef = useRef(null);
  const helpMenuRef = useRef(null);
  const helpBtnRef = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      const t = e.target;
      const clickedProfile =
        profileMenuRef.current?.contains(t) || profileBtnRef.current?.contains(t);
      const clickedHelp =
        helpMenuRef.current?.contains(t) || helpBtnRef.current?.contains(t);

      if (!clickedProfile) setProfileOpen(false);
      if (!clickedHelp) setHelpOpen(false);
    }
    function onEsc(e) {
      if (e.key === 'Escape') {
        setProfileOpen(false);
        setHelpOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  const navLink =
    'text-white hover:bg-blue-600 hover:bg-opacity-75 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 inline-flex items-center gap-2';

  const telHref = (num) => `tel:${num.replace(/\s+/g, '')}`;

  return (
    <nav className="bg-gradient-to-r from-blue-700 to-indigo-800 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/dashboard/student" className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-white" aria-hidden="true" />
              <span className="text-white font-bold text-xl tracking-tight">
                Disaster Dashboard
              </span>
            </a>
          </div>

          {/* Nav links (desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            <a href="/dashboard/chatbot" className={navLink}>
              <MessageSquare className="h-4 w-4" aria-hidden="true" />
              Chatbot
            </a>
            <a href="/dashboard/student/reels" className={navLink}>
              <Clapperboard className="h-4 w-4" aria-hidden="true" />
              Shorts
            </a>
            <a href="/dashboard/student/leaderboard" className={navLink}>
              <Trophy className="h-4 w-4" aria-hidden="true" />
              LeaderBoard
            </a>

            {/* Emergency Contact dropdown */}
            <div className="relative" ref={helpMenuRef}>
              <button
                ref={helpBtnRef}
                onClick={() => {
                  setHelpOpen((v) => !v);
                  setProfileOpen(false);
                }}
                className="flex items-center gap-2 text-white bg-white/0 hover:bg-blue-600 hover:bg-opacity-75 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                aria-haspopup="menu"
                aria-expanded={helpOpen}
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                Emergency Contact
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${helpOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>

              {helpOpen && (
                <div
                  role="menu"
                  aria-label="Emergency contacts"
                  className="absolute right-0 mt-2 w-[26rem] max-w-[90vw] origin-top-right rounded-md bg-white shadow-xl ring-1 ring-black/5 focus:outline-none overflow-hidden"
                >
                  {/* Header - tighter padding */}
                  <div className="px-3 py-2 bg-gray-50 border-b text-sm font-semibold text-gray-700">
                    🇮🇳 Emergency & Disaster Helplines
                  </div>

                  {/* List */}
                  <div className="max-h-96 overflow-y-auto">
                    <ul className="divide-y">
                      {HELPLINES.map((h, idx) => {
                        const firstFour = idx < 4;
                        return (
                          <li key={h.service} className="px-3 py-2">
                            {firstFour ? (
                              // Compact single-row layout for first 4 items
                              <div className="flex items-center justify-between gap-3">
                                <div className="text-sm font-medium text-gray-900 truncate">
                                  {h.service}
                                </div>
                                <div className="flex flex-wrap items-center gap-1.5 justify-end">
                                  {h.numbers.map((n) => (
                                    <a
                                      key={n}
                                      href={telHref(n)}
                                      className="inline-flex items-center rounded-md border border-gray-200 px-1.5 py-[2px] text-[11px] font-mono text-blue-800 hover:bg-blue-100 bg-blue-50"
                                      title={`Call ${n}`}
                                    >
                                      {n}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              // Default stacked layout for the rest
                              <>
                                <div className="text-sm font-medium text-gray-900">
                                  {h.service}
                                </div>
                                <div className="mt-1 flex flex-wrap gap-1.5">
                                  {h.numbers.map((n) => (
                                    <a
                                      key={n}
                                      href={telHref(n)}
                                      className="inline-flex items-center rounded-md border border-gray-200 px-1.5 py-[2px] text-[11px] font-mono text-blue-800 hover:bg-blue-100 bg-blue-50"
                                      title={`Call ${n}`}
                                    >
                                      {n}
                                    </a>
                                  ))}
                                </div>
                              </>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <a href="/dashboard/about" className={navLink}>
              <Info className="h-4 w-4" aria-hidden="true" />
              About
            </a>

            {/* Profile dropdown */}
            <div className="relative" ref={profileMenuRef}>
              <button
                ref={profileBtnRef}
                onClick={() => {
                  setProfileOpen((v) => !v);
                  setHelpOpen(false);
                }}
                className="flex items-center gap-2 text-white bg-white/0 hover:bg-blue-600 hover:bg-opacity-75 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                aria-haspopup="menu"
                aria-expanded={profileOpen}
              >
                <UserRound className="h-5 w-5 text-white" aria-hidden="true" />
                <span>Profile</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${profileOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>

              {profileOpen && (
                <div
                  role="menu"
                  aria-label="Profile menu"
                  className="absolute right-0 mt-2 w-52 origin-top-right rounded-md bg-white shadow-xl ring-1 ring-black/5 focus:outline-none overflow-hidden"
                >
                  <a
                    href="/profile"
                    role="menuitem"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setProfileOpen(false)}
                  >
                    <User className="h-4 w-4" aria-hidden="true" />
                    My Account
                  </a>
                  <a
                    href="/dashboard/settings"
                    role="menuitem"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setProfileOpen(false)}
                  >
                    <Settings className="h-4 w-4" aria-hidden="true" />
                    Settings
                  </a>
                  <div className="h-px bg-gray-200" />
                  <button
                    onClick={logout}
                    type="button"
                    role="menuitem"
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                  >
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* (Optional) Mobile: add a hamburger later if needed */}
        </div>
      </div>
    </nav>
  );
};

export default DashboardHeader;
