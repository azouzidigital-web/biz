'use client';

import { useEffect } from 'react';
import { trackPurchase } from '@/lib/facebook-pixel-events';

interface PurchaseTrackerProps {
  bookId: string;
  bookTitle: string;
  price: number;
}

export function PurchaseTracker({ bookId, bookTitle, price }: PurchaseTrackerProps) {
  useEffect(() => {
    // Track purchase event
    trackPurchase({
      id: bookId,
      title: bookTitle,
      price: price,
    });
  }, [bookId, bookTitle, price]);

  return null; // This component doesn't render anything
}
