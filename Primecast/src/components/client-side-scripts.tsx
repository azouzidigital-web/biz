"use client";

import { useEffect } from 'react';
import Script from 'next/script';

/**
 * ClientSideScripts component that handles loading all client-side only scripts
 * This approach avoids hydration mismatches by ensuring scripts only load on the client
 */
export function ClientSideScripts() {
  // Microsoft Clarity
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const clarityScript = document.createElement('script');
    clarityScript.innerHTML = `
      (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "rxwkydlt35");
    `;
    document.head.appendChild(clarityScript);
    
    return () => {
      if (clarityScript.parentNode) {
        clarityScript.parentNode.removeChild(clarityScript);
      }
    };
  }, []);
  
  // Service Worker
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
    
    const registerSW = () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered: ', registration);
        })
        .catch(error => {
          console.log('SW registration failed: ', error);
        });
    };
    
    window.addEventListener('load', registerSW);
    return () => window.removeEventListener('load', registerSW);
  }, []);
  
  // Tawk.to Chat (separate component is being used for this)
  
  return null;
}
