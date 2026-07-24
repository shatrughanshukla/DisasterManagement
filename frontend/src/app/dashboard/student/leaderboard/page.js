// src/app/dashboard/student/leaderboard/page.js
'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { FaChevronLeft, FaSearch, FaCrown, FaMedal, FaFire } from 'react-icons/fa';
import DashboardHeader from '@/app/components/DashboardHeader';

const SAMPLE = [
  { id: 1,  name: 'Aarav Kumar',  class: '10A', section: 'A', points: 1280, streak: 17 },
  { id: 2,  name: 'Diya Sharma',  class: '10A', section: 'B', points: 1240, streak: 15 },
  { id: 3,  name: 'Ishaan Gupta', class: '10B', section: 'C', points: 1190, streak: 13 },
  { id: 4,  name: 'Meera Iyer',   class: '10B', section: 'A', points: 1110, streak: 10 },
  { id: 5,  name: 'Rohit Verma',  class: '10C', section: 'B', points: 1030, streak: 8  },
  { id: 6,  name: 'Zoya Khan',    class: '10C', section: 'A', points: 980,  streak: 9  },
  { id: 7,  name: 'Aditya Singh', class: '10A', section: 'C', points: 920,  streak: 5  },
  { id: 8,  name: 'Kavya Nair',   class: '10B', section: 'B', points: 910,  streak: 6  },
  { id: 9,  name: 'Vikram Reddy', class: '10C', section: 'C', points: 880,  streak: 3  },
  { id: 10, name: 'Nikhil Patel', class: '10B', section: 'A', points: 860,  streak: 4  },
];

const TABS = ['Global', 'Weekly', 'Monthly'];

export default function LeaderboardPage() {
  const [tab, setTab] = useState('Global');
  const [query, setQuery] = useState('');
  const [klass, setKlass] = useState('All');
  const [section, setSection] = useState('All');

  const classes = useMemo(
    () => ['All', ...Array.from(new Set(SAMPLE.map(s => s.class)))],
    []
  );
  const sections = useMemo(
    () => ['All', ...Array.from(new Set(SAMPLE.map(s => s.section)))],
    []
  );

  // simulate Weekly/Monthly views (optional)
  const tabbed = useMemo(() => {
    const factor = tab === 'Weekly' ? 0.35 : tab === 'Monthly' ? 0.7 : 1;
    return SAMPLE.map(s => ({ ...s, points: Math.round(s.points * factor) }));
  }, [tab]);

  const filtered = useMemo(() => {
    return tabbed.filter(s =>
      (!query || s.name.toLowerCase().includes(query.toLowerCase())) &&
      (klass === 'All' || s.class === klass) &&
      (section === 'All' || s.section === section)
    );
  }, [tabbed, query, klass, section]);

  // rank by points (desc)
  const ranked = useMemo(() => {
    const copy = [...filtered].sort((a, b) => b.points - a.points);
    return copy.map((s, i) => ({ rank: i + 1, ...s }));
  }, [filtered]);

  const top3 = ranked.slice(0, 3);
  const rest = ranked.slice(3);

  const badgeForRank = (r) => {
    if (r === 1) return <FaCrown className="text-yellow-500" title="#1" />;
    if (r === 2) return <FaMedal className="text-gray-400" title="#2" />;
    if (r === 3) return <FaMedal className="text-amber-600" title="#3" />;
    return <span className="inline-block w-5 text-center text-gray-900 font-semibold">{r}</span>;
  };

  return (
    <>
      <DashboardHeader />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-4">

          {/* Top bar + tabs */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard/student"
                  className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-800"
                  prefetch
                >
                  <FaChevronLeft /> Back
                </Link>
                <span className="text-sm text-gray-400">|</span>
                <span className="text-sm">
                  <span className="font-semibold text-gray-900">Student</span>{' '}
                  <span className="text-blue-700">Leaderboard</span>
                </span>
              </div>

              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                {TABS.map(t => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`px-3 py-1.5 text-sm rounded-md transition
                      ${tab === t ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'}
                    `}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Filters (now darker text) */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name…"
                  className="w-full pl-10 pr-3 py-2 border rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={klass}
                  onChange={(e) => setKlass(e.target.value)}
                  className="border rounded-lg px-3 py-2 text-sm text-gray-900"
                >
                  {classes.map(c => <option key={c} value={c}>{c === 'All' ? 'All Classes' : c}</option>)}
                </select>
                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="border rounded-lg px-3 py-2 text-sm text-gray-900"
                >
                  {sections.map(s => <option key={s} value={s}>{s === 'All' ? 'All Sections' : `Section ${s}`}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Top 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {top3.map((s) => (
              <div key={s.id} className="rounded-xl shadow-md p-5 bg-white border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar name={s.name} />
                    <div>
                      <div className="font-semibold text-gray-900">{s.name}</div>
                      <div className="text-xs text-gray-600">{s.class} • Sec {s.section}</div>
                    </div>
                  </div>
                  <div className="text-2xl">{badgeForRank(s.rank)}</div>
                </div>
                <div className="mt-4 flex items-center justify-between text-gray-900">
                  <div className="text-sm">
                    Points <span className="font-semibold">{s.points}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-orange-600">
                    <FaFire /> {s.streak} day streak
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Table (darker cells) */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-gray-800">
                  <tr>
                    <Th>Rank</Th>
                    <Th>Name</Th>
                    <Th>Class</Th>
                    <Th>Section</Th>
                    <Th>Points</Th>
                    <Th>Streak</Th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {ranked.slice(3).map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <Td className="text-gray-900 font-semibold">{badgeForRank(s.rank)}</Td>
                      <Td className="font-medium text-gray-900">{s.name}</Td>
                      <Td className="text-gray-900">{s.class}</Td>
                      <Td className="text-gray-900">{s.section}</Td>
                      <Td className="font-semibold text-gray-900">{s.points}</Td>
                      <Td>
                        <div className="inline-flex items-center gap-1 text-orange-600">
                          <FaFire /> {s.streak}
                        </div>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

function Th({ children }) {
  return (
    <th className="px-4 py-3 text-left font-semibold text-gray-800">
      {children}
    </th>
  );
}
function Td({ children, className = '' }) {
  return <td className={`px-4 py-3 ${className}`}>{children}</td>;
}

function Avatar({ name }) {
  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div className="rounded-full bg-indigo-100 text-indigo-700 grid place-items-center h-10 w-10 text-sm">
      {initials}
    </div>
  );
}
