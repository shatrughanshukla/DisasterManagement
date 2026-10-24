// src/app/dashboard/student/reels/page.js
'use client';

import DashboardHeader from '@/app/components/DashboardHeader';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export default function ShortsPage() {
  const videoIds = useMemo(
    () => [
      'QjlerQ865h8',
      'y1mJ6Q6y2xk',
      'OzqkSaU5yZo',
      'WcjlvHEhUWk',
      'e-ORhEE9VVg',
      '3JZ_D3ELwOQ',
      'fRh_vgS2dFE',
      'CevxZvSJLk8',
      'Rb0UmrCXxVA',
      'YqeW9_5kURI',
    ],
    []
  );

  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    if (!query.trim()) return videoIds;
    return videoIds.filter((id) => id.toLowerCase().includes(query.toLowerCase()));
  }, [query, videoIds]);

  const [active, setActive] = useState(0);
  const containerRef = useRef(null);
  const sectionRefs = useRef([]);

  useEffect(() => {
    sectionRefs.current = sectionRefs.current.slice(0, filtered.length);
  }, [filtered.length]);

  // Track which section is most visible
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const idx = sectionRefs.current.findIndex((el) => el === visible.target);
        if (idx !== -1) setActive(idx);
      },
      { root: containerRef.current, threshold: 0.6 }
    );
    sectionRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [filtered]);

  // Key navigation (one screen per press)
  const handleKey = useCallback((e) => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const page = window.innerHeight;
    if (['ArrowDown', 'PageDown', ' '].includes(e.key)) {
      e.preventDefault();
      el.scrollBy({ top: page, behavior: 'smooth' });
    }
    if (['ArrowUp', 'PageUp'].includes(e.key)) {
      e.preventDefault();
      el.scrollBy({ top: -page, behavior: 'smooth' });
    }
  }, []);

  const scrollToIndex = useCallback((i) => {
    const el = sectionRefs.current[i];
    if (!el || !containerRef.current) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const next = useCallback(() => {
    if (active < filtered.length - 1) scrollToIndex(active + 1);
  }, [active, filtered.length, scrollToIndex]);

  const prev = useCallback(() => {
    if (active > 0) scrollToIndex(active - 1);
  }, [active, scrollToIndex]);

  return (
    <div className="h-screen w-full bg-black text-white">
      {/* Sticky header */}
        <DashboardHeader />

      {/* Scroll container */}
      <div
        ref={containerRef}
        tabIndex={0}
        onKeyDown={handleKey}
        className="h-[calc(100vh-52px)] overflow-y-auto snap-y snap-mandatory scroll-smooth overscroll-contain focus:outline-none"
      >
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          filtered.map((id, idx) => (
            <section
              key={id}
              ref={(el) => (sectionRefs.current[idx] = el)}
              className="h-screen snap-start flex items-center justify-center relative bg-black"
            >
              <div
                className="relative h-[85vh] w-[calc(85vh*9/16)] max-w-[85vw] rounded-2xl overflow-hidden bg-neutral-900 shadow-2xl"
                style={{ aspectRatio: '9 / 16' }}
              >
                {/* Lite, click-to-load embed */}
                <LiteYT id={id} />

                {/* Badge */}
                <div className="absolute left-2 top-2 text-[11px] px-2 py-1 rounded-full bg-black/50">
                  {idx + 1}/{filtered.length}
                </div>

                {/* Right control rail */}
                <ControlsRail
                  onPrev={prev}
                  onNext={next}
                  youtubeUrl={`https://www.youtube.com/watch?v=${id}`}
                />
              </div>

              {/* Hints */}
              {idx === active && (
                <div className="pointer-events-none absolute bottom-4 text-center text-xs text-white/70">
                  <p className="hidden sm:block">
                    Scroll ▾ or use ↑ ↓ / Space / PageUp / PageDown
                  </p>
                  <p className="sm:hidden">Swipe up/down</p>
                </div>
              )}
            </section>
          ))
        )}
      </div>
    </div>
  );
}

/* --- Right-side toolbar --- */
function ControlsRail({ onPrev, onNext, youtubeUrl }) {
  return (
    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3">
      <RailButton label="Previous" onClick={onPrev}>↑</RailButton>
      <RailButton label="Next" onClick={onNext}>↓</RailButton>
      <div className="h-2" />
      <a
        href={youtubeUrl}
        target="_blank"
        rel="noreferrer"
        className="text-[11px] px-2 py-1 rounded-full bg-black/55 hover:bg-black/70 border border-white/15"
        title="Open on YouTube"
      >
        yt
      </a>
    </div>
  );
}

function RailButton({ children, label, onClick }) {
  return (
    <button
      onClick={onClick}
      title={label}
      className="text-[12px] w-9 h-9 grid place-items-center rounded-full bg-black/55 hover:bg-black/70 border border-white/15"
    >
      <span aria-hidden>{children}</span>
    </button>
  );
}

function EmptyState() {
  return (
    <div className="h-screen snap-start grid place-items-center text-center px-6">
      <div className="max-w-md">
        <p className="mb-2 font-medium text-white">No videos yet</p>
        <p className="text-sm text-white/70">
          Add your YouTube/Shorts IDs to the <code>videoIds</code> array in this file.
        </p>
        <div className="mt-4 text-left text-xs bg-white/5 border border-white/10 p-3 rounded-lg overflow-x-auto">
          <p className="mb-1">Example:</p>
          <pre>{`const videoIds = [
  'dQw4w9WgXcQ',
  'jNQXAC9IVRw',
  'kXYiU_JCYtU',
  '9bZkp7q19f0',
];`}</pre>
        </div>
      </div>
    </div>
  );
}

/* --- Inline Lite YouTube component (click-to-load) --- */
function LiteYT({ id }) {
  const [load, setLoad] = useState(false);
  const thumb = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  const src =
    `https://www.youtube-nocookie.com/embed/${id}?` +
    [
      'autoplay=1',
      'mute=1',
      'playsinline=1',
      'controls=0',
      'loop=1',
      `playlist=${id}`,
      'modestbranding=1',
      'rel=0',
    ].join('&');

  return (
    <div className="absolute inset-0">
      {!load ? (
        <button
          onClick={() => setLoad(true)}
          className="group relative h-full w-full"
          aria-label="Play video"
        >
          <img src={thumb} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20" />
          <div className="absolute inset-0 grid place-items-center">
            <div className="h-16 w-16 rounded-full bg-white/90 grid place-items-center text-black text-2xl">
              ▶
            </div>
          </div>
        </button>
      ) : (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={src}
          title={`YouTube Short ${id}`}
          loading="eager"
          allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      )}
    </div>
  );
}
