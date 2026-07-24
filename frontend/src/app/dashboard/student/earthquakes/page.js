'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FaChevronDown,
  FaChevronLeft,
  FaUserCircle,
  FaPlay,
  FaBookOpen,
  FaListUl,
} from 'react-icons/fa';
import DashboardHeader from '@/app/components/DashboardHeader';

function Section({ title, children }) {
  return (
    <section className="bg-white rounded-xl shadow-md p-5 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">{title}</h2>
      {children}
    </section>
  );
}

function Accordion({ label, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium text-gray-800 hover:bg-gray-50"
        aria-expanded={open}
      >
        <span className="inline-flex items-center gap-2">
          <FaListUl className="text-gray-500" />
          {label}
        </span>
        <FaChevronDown
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>
      {open && <div className="p-4 bg-white text-sm text-gray-700">{children}</div>}
    </div>
  );
}

/* --- FAQ data (your 15 Q&As) --- */
const FAQS = [
  { q: 'What should I do during strong shaking?', a: 'Drop, cover, and hold under a sturdy table until the shaking stops.' },
  { q: 'How do I prepare a family emergency kit?', a: 'Pack water, food, flashlight, medicines, cash, ID copies, and a first-aid kit.' },
  { q: 'What to check at home after an earthquake?', a: 'Look for gas leaks, damaged wiring, water line breaks, and wall cracks.' },
  { q: 'Where is the safest place to take cover indoors?', a: 'Under a strong table or desk, away from windows and heavy objects.' },
  { q: 'How do I stay safe if I’m outside during an earthquake?', a: 'Move to an open area, away from buildings, trees, and power lines.' },
  { q: 'What should I do if I’m driving when an earthquake hits?', a: 'Pull over safely, stay inside the car, and avoid bridges or overpasses.' },
  { q: 'How can schools prepare students for earthquakes?', a: 'Conduct regular drills and teach drop–cover–hold techniques.' },
  { q: 'What items must be in an earthquake “go-bag”?', a: 'Essentials like water, dry food, flashlight, medicines, charger, and blankets.' },
  { q: 'How do I turn off gas, water, and electricity safely after an earthquake?', a: 'Use main switches and valves only if you suspect leaks or damage.' },
  { q: 'What should I avoid doing immediately after an earthquake?', a: 'Avoid using elevators, running outside, or lighting matches near gas leaks.' },
  { q: 'How can I protect pets during an earthquake?', a: 'Keep carriers, leashes, and some pet food ready in your emergency kit.' },
  { q: 'What’s the difference between an earthquake and an aftershock?', a: 'Aftershocks are smaller quakes that follow the main earthquake.' },
  { q: 'How do early warning systems work?', a: 'They detect seismic waves and send alerts seconds before shaking begins.' },
  { q: 'Why is it unsafe to run outside during an earthquake?', a: 'Falling glass, debris, and power lines can injure you.' },
  { q: 'What are the biggest earthquake myths people still believe?', a: 'Standing in a doorway is safest (it’s not), and animals can always predict quakes.' },
];

/* --- Small, nested FAQ item --- */
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-md">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between text-left px-3 py-2"
        aria-expanded={open}
      >
        <span className="font-medium text-gray-900">{q}</span>
        <FaChevronDown className={`text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="px-3 pb-3 text-gray-700">{a}</div>}
    </div>
  );
}

export default function EarthquakeModulePage() {

  return (
    <>
      <DashboardHeader />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-3">
          {/* Top bar: back + module + profile */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-5">
            <div className="flex items-center justify-between">
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
                  <span className="font-semibold text-gray-900">Earthquake</span>{' '}
                  <span className="text-blue-700">Module</span>
                </span>
              </div>
              <Link
                href="/dashboard/profile"
                className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-800"
                prefetch
              >
                <FaUserCircle className="text-xl" />
                Profile
              </Link>
            </div>
          </div>

          {/* 1. Drill Game */}
          <Section title="1. Drill Game (Simulation)">
            <div className="space-y-2">
              {/* Image with overlayed Play button */}
              <div className="relative aspect-[16/9] w-3xl overflow-hidden rounded-lg group mx-auto">
                <Image
                  src="/earthquake-game.jpg"
                  alt="Earthquake drill game preview"
                  fill
                  sizes="(max-width: 768px) 100vw, 800px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  priority={false}
                />
                {/* Soft gradient for text legibility */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent z-0" />
                {/* Play Game -> open modal */}
                <a
                href="/earthquake_drill/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="z-10 absolute left-1/2 -translate-x-1/2 bottom-5 sm:bottom-6 inline-flex items-center gap-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 shadow-md"
                >
                <FaPlay aria-hidden="true" />
                Play Game
                </a>

              </div>

              <p className="text-xs text-gray-500 text-center">
                Learn by doing — safe, guided practice.
              </p>
            </div>
          </Section>

          {/* 2. Assignment */}
          <Section title="2. Assignment (Do or Die Task)">
            <div className="space-y-4">
              <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Example:</span> “Arrange the correct evacuation steps for a classroom during an earthquake.”
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/dashboard/student/earthquakes/assignment"
                  className="inline-flex items-center gap-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 shadow-sm"
                  prefetch
                >
                  <FaBookOpen aria-hidden="true" />
                  Start Assignment
                </Link>
                <span className="text-xs text-gray-500">Estimated time: 10–15 mins</span>
              </div>
            </div>
          </Section>

          {/* 3. Knowledge & Resources */}
          <Section title="3. Knowledge & Resources">
            <div className="space-y-3">
              <Accordion label="FAQs ▾ (expand to view)">
                <div className="space-y-2">
                  {FAQS.map((item, i) => (
                    <FaqItem key={i} q={item.q} a={item.a} />
                  ))}
                </div>
              </Accordion>

              <Accordion label="Resources ▾ (expand to view)">
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <a className="text-blue-700 hover:underline" href="https://en.wikipedia.org/wiki/Earthquake">
                      Earthquake Preparedness Checklist
                    </a>
                  </li>
                  <li>
                    <a className="text-blue-700 hover:underline" href="https://en.wikipedia.org/wiki/Lists_of_21st-century_earthquakes">
                      List of 21st century earthquakes
                    </a>
                  </li>
                  <li>
                    <a className="text-blue-700 hover:underline" href="https://byjus.com/physics/protection-against-earthquake/">
                      Safety Plan
                    </a>
                  </li>
                  <li>
                    <a className="text-blue-700 hover:underline" href="https://earthquakelist.org/india/delhi/">
                      EarthQuake List Delhi
                    </a>
                  </li>
                  <li>
                    <a className="text-blue-700 hover:underline" href="https://disasterphilanthropy.org/cdp-resource/earthquakes/">
                      EarthQuake
                    </a>
                  </li>
                </ul>
              </Accordion>
            </div>
          </Section>

          {/* Footer mini-links */}
          <div className="text-center text-xs text-gray-500 pt-2 pb-6">
            <div className="inline-flex items-center gap-3">
              <Link href="/about" className="hover:text-gray-700" prefetch>
                About
              </Link>
              <span>•</span>
              <Link href="/contact" className="hover:text-gray-700" prefetch>
                Contact
              </Link>
              <span>•</span>
              <Link href="/terms" className="hover:text-gray-700" prefetch>
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}
