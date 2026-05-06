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
  
  // Facebook Pixel
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const pixelScript = document.createElement('script');
    pixelScript.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '1592382432022194');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(pixelScript);
    
    // Noscript fallback for users without JavaScript
    const noscript = document.createElement('noscript');
    noscript.innerHTML = `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=1592382432022194&ev=PageView&noscript=1" />`;
    document.head.appendChild(noscript);
    
    return () => {
      if (pixelScript.parentNode) {
        pixelScript.parentNode.removeChild(pixelScript);
      }
      if (noscript.parentNode) {
        noscript.parentNode.removeChild(noscript);
      }
    };
  }, []);
  
  // Tawk.to Chat (separate component is being used for this)
  
  return null;
}
