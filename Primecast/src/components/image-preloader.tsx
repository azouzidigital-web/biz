"use client";

import { useEffect } from 'react';
import Script from 'next/script';

// List all images that need to be preloaded
const imagesToPreload = [
  // Channel images - High priority
  "/channels/CBC_logo.webp",
  "/channels/Crave_logo.webp",
  "/channels/CTV_logo.webp",
  "/channels/Logo_Sportsnet.webp",
  "/channels/NBA_TV_Canada.webp",
  "/channels/Paramount_Plus.webp",
  "/channels/Starz.webp",
  "/channels/Super_Channel.webp",
  "/channels/TSN_Logo.webp",
  "/channels/W_Network_Logo.webp",
  // Content images - High priority (first 6)
  "/images/Ted Lasso.webp",
  "/images/the last of us.webp",
  "/images/House of the Dragon.webp",
  "/images/Clarkson's Farm.webp",
  "/images/Cold Case_ The Tylenol Murders.webp",
  "/images/MobLand.webp",
].map(src => ({ src, priority: 'high' as const }));

const lowPriorityImages = [
  // Content images - Lower priority (rest)
  "/images/A Working Man.webp",
].map(src => ({ src, priority: 'low' as const }));

const allImages = [...imagesToPreload, ...lowPriorityImages];

// Inline script for immediate image preloading
const preloadScript = `
  (function() {
    const images = ${JSON.stringify(allImages)};
    
    // Create a preload queue
    const preloadQueue = [];
    
    // Function to preload an image with priority
    function preloadImage(imageData) {
      return new Promise((resolve) => {
        // Create preload link
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.type = 'image/webp';
        link.href = imageData.src;
        link.fetchPriority = imageData.priority;
        document.head.appendChild(link);
        
        // Create image object
        const img = new Image();
        if ('loading' in HTMLImageElement.prototype) {
          img.loading = 'eager';
        }
        if ('fetchPriority' in img) {
          img.fetchPriority = imageData.priority;
        }
        
        // Wait for load or error
        img.onload = img.onerror = () => resolve();
        img.src = imageData.src;
        
        // Store in memory cache
        preloadQueue.push(img);
      });
    }
    
    // Preload high priority images immediately
    const highPriorityImages = images.filter(img => img.priority === 'high');
    Promise.all(highPriorityImages.map(preloadImage));
    
    // Preload low priority images after a delay
    setTimeout(() => {
      const lowPriorityImages = images.filter(img => img.priority === 'low');
      Promise.all(lowPriorityImages.map(preloadImage));
    }, 1000);
  })();
`;

export function ImagePreloader() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Create a memory cache for images
      const imageCache = new Map();
      
      // Aggressive loading strategy with priority
      const loadImage = async (imageData: { src: string; priority: 'high' | 'low' }) => {
        if (imageCache.has(imageData.src)) {
          return imageCache.get(imageData.src);
        }

        try {
          // Create blob URL for faster loading
          const response = await fetch(imageData.src, {
            priority: imageData.priority === 'high' ? 'high' : 'auto'
          });
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);
          
          // Create and configure image
          const img = new Image();
          if ('loading' in img) {
            img.loading = 'eager';
          }
          if ('fetchPriority' in img) {
            img.fetchPriority = imageData.priority;
          }
          
          // Load image and cache it
          const loadPromise = new Promise<void>((resolve) => {
            img.onload = () => {
              imageCache.set(imageData.src, img);
              resolve();
            };
            img.src = blobUrl;
          });

          await loadPromise;
          URL.revokeObjectURL(blobUrl);
          return img;
        } catch (e) {
          console.error('Failed to preload:', imageData.src, e);
        }
      };

      // Load high priority images immediately
      const highPriorityImages = allImages.filter(img => img.priority === 'high');
      Promise.all(highPriorityImages.map(loadImage));

      // Load low priority images after a delay
      setTimeout(() => {
        const lowPriorityImages = allImages.filter(img => img.priority === 'low');
        Promise.all(lowPriorityImages.map(loadImage));
      }, 1000);
    }
  }, []);

  return (
    <>
      <Script id="preloader" strategy="beforeInteractive" data-priority="critical">
        {preloadScript}
      </Script>
      <div style={{ display: 'none' }}>
        {allImages.map(({src, priority}) => (
          <div key={src}>
            <link 
              key={`preload-${src}`}
              rel="preload" 
              as="image" 
              href={src} 
              type="image/webp"
              fetchPriority={priority}
              crossOrigin="anonymous"
            />
            <link 
              key={`prefetch-${src}`}
              rel="prefetch"
              as="image" 
              href={src}
              type="image/webp"
            />
            <meta 
              key={`hint-${src}`}
              name="viewport-preload"
              content={`${src}; priority=${priority}`} 
            />
          </div>
        ))}
      </div>
    </>
  );
}
