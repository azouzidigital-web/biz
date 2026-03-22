"use client";

import { useEffect } from 'react';
import Script from 'next/script';

/**
 * TawkChat component that adds the Tawk.to live chat widget to the website.
 * This is a client component because it needs access to the window object.
 * 
 * @param {object} props
 * @param {string} props.siteId - Your Tawk site ID
 * @param {string} props.widgetId - Your Tawk widget ID
 */
export function TawkChat({ siteId, widgetId }: { siteId: string; widgetId: string }) {
  useEffect(() => {
    // Validate IDs and only run in browser
    if (typeof window === 'undefined' || !siteId || !widgetId) {
      return;
    }
    
    // Define Tawk global variables
    // @ts-ignore
    window.Tawk_API = window.Tawk_API || {};
    // @ts-ignore
    window.Tawk_LoadStart = new Date();
    
    console.log('TawkChat: Initializing with', siteId, widgetId);
    
    // Use direct embed script - this is their recommended approach
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://embed.tawk.to/${siteId}/${widgetId}`;
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    
    // Make sure script is loaded only once
    const existingScript = document.querySelector(`script[src*="tawk.to/${siteId}"]`);
    if (!existingScript) {
      document.body.appendChild(script);
    }
    
    // Cleanup function - only used in development
    return () => {
      // Only clean up in development environment
      if (process.env.NODE_ENV === 'development') {
        const tawkScript = document.querySelector(`script[src*="tawk.to/${siteId}"]`);
        if (tawkScript && tawkScript.parentNode) {
          tawkScript.parentNode.removeChild(tawkScript);
        }
        
        // Also remove any other Tawk elements
        const tawkElements = document.querySelectorAll('[class*="tawk-"]');
        tawkElements.forEach(el => {
          if (el.parentNode) {
            el.parentNode.removeChild(el);
          }
        });
        
        // Reset any global Tawk variables
        // @ts-ignore
        if (window.Tawk_API) window.Tawk_API = undefined;
        // @ts-ignore
        if (window.Tawk_LoadStart) window.Tawk_LoadStart = undefined;
      }
    };
  }, [siteId, widgetId]); // Re-run if these props change

  // This component doesn't render anything visible
  return null;
}
