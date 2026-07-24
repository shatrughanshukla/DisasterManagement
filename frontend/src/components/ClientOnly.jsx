'use client';

import { useEffect, useState } from 'react';

/**
 * A wrapper component that only renders its children on the client side
 * This prevents hydration mismatches for components that use browser-only APIs
 * or need to display dynamic content that differs between server and client
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The content to render client-side only
 * @param {React.ReactNode} props.fallback - Optional fallback to show during SSR (default: null)
 */
export default function ClientOnly({ children, fallback = null }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // On the server or during initial hydration, render fallback (or nothing)
  if (!isClient) {
    return fallback;
  }

  // On the client, render children normally
  return children;
}