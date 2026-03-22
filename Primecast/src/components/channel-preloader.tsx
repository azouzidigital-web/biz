"use client";

import { useEffect } from 'react';

const PRIORITY_CHANNELS = [
  'logo_cbctelevision.webp',
  'logo_cbcnews.webp',
  'logo_ctvhd.webp',
  'logo_citytv.webp',
  'logo_global.webp',
  'logo_tsn.webp',
  'logo_sportsnet.webp',
  'logo_cnninternational.webp',
  'logo_bbcnews.webp',
  'logo_disneychannel.webp',
  'logo_much.webp',
  'logo_history.webp',
  'logo_documentary_0.webp',
  'logo_showcase.webp',
  'logo_ytv.webp',
  'logo_tva.webp',
  'logo_rds_rds2.webp',
  'logo_foxnews.webp',
  'logo_nbc.webp',
  'logo_abc.webp',
  'logo_cbs.webp',
  'fox_sports.webp',
  'logo_cp24.webp',
  'logo_bnnbloomberg.webp'
];

export function ChannelPreloader() {
  useEffect(() => {
    // Immediately start preloading the most critical channel images
    const preloadPromises = PRIORITY_CHANNELS.map(logo => {
      return new Promise<void>((resolve) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = `/channel_guide/${logo}`;
        link.onload = () => resolve();
        link.onerror = () => resolve(); // Don't block on errors
        document.head.appendChild(link);
        
        // Also create an Image object for immediate caching
        const img = new Image();
        img.src = `/channel_guide/${logo}`;
      });
    });

    // Preload all other images after a short delay
    setTimeout(() => {
      const allChannels = [
        // Add more channel logos here - you can get this from your channel data
        'logo_ctvcomedy.webp', 'logo_ctvdrama.webp', 'logo_ctvlife.webp',
        'logo_ctvnature.webp', 'logo_ctvnewsnet.webp', 'logo_ctvscifi.webp',
        'logo_ctvspeed.webp', 'logo_ctvtwo.webp', 'logo_ctvwild.webp'
        // Add more as needed
      ];

      allChannels.forEach(logo => {
        const img = new Image();
        img.src = `/channel_guide/${logo}`;
      });
    }, 500);

  }, []);

  return null; // This component doesn't render anything
}
