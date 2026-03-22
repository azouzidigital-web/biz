'use client';

import { useEffect } from 'react';
import { sendPageViewEvent } from '@/lib/facebook-conversions';

export default function FacebookConversions() {
  useEffect(() => {
    // Track PageView with a delay to ensure page is loaded
    const timer = setTimeout(() => {
      sendPageViewEvent();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return null; // This component doesn't render anything
}
