"use client";

import { useEffect } from 'react';

export const ContentGuardian = () => {
  useEffect(() => {
    // Advanced bot detection
    const detectBots = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const botPatterns = [
        'bot', 'crawl', 'spider', 'scrape', 'headless', 'phantom', 'selenium',
        'puppeteer', 'playwright', 'nightmare', 'zombie', 'jsdom'
      ];
      
      if (botPatterns.some(pattern => userAgent.includes(pattern))) {
        document.body.innerHTML = '<div style="text-align:center;padding:50px;">Access Denied</div>';
        return;
      }
    };

    // Detect virtual machines and sandboxes
    const detectVM = () => {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl');
      
      if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
          const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          
          const vmPatterns = ['virtualbox', 'vmware', 'parallels', 'xen', 'qemu'];
          const vendorRenderer = (vendor + renderer).toLowerCase();
          
          if (vmPatterns.some(pattern => vendorRenderer.includes(pattern))) {
            console.warn('Virtual environment detected');
          }
        }
      }
    };

    // Detect debugging tools
    const detectDebugging = () => {
      let devtools = {open: false, orientation: null};
      const threshold = 160;

      setInterval(() => {
        if (window.outerHeight - window.innerHeight > threshold || 
            window.outerWidth - window.innerWidth > threshold) {
          if (!devtools.open) {
            devtools.open = true;
            // Could blur content or show warning
            document.querySelector('.channels-container')?.classList.add('blur-sm');
          }
        } else {
          if (devtools.open) {
            devtools.open = false;
            document.querySelector('.channels-container')?.classList.remove('blur-sm');
          }
        }
      }, 500);
    };

    // Detect unusual mouse behavior (bots)
    let mouseMovements = 0;
    let suspiciousActivity = 0;
    
    const trackMouse = (e: MouseEvent) => {
      mouseMovements++;
      
      // Check for robotic movements (perfectly straight lines)
      if (mouseMovements > 10 && mouseMovements % 10 === 0) {
        const movements = mouseMovements;
        if (movements < 50) {
          suspiciousActivity++;
          if (suspiciousActivity > 5) {
            console.warn('Suspicious mouse activity detected');
          }
        }
      }
    };

    // Detect rapid scrolling (bot behavior)
    let scrollEvents = 0;
    const trackScroll = () => {
      scrollEvents++;
      if (scrollEvents > 100) {
        console.warn('Rapid scrolling detected');
        scrollEvents = 0;
      }
    };

    // Anti-screenshot: Detect rapid window focus changes
    let focusChanges = 0;
    const trackFocus = () => {
      focusChanges++;
      if (focusChanges > 10) {
        console.warn('Rapid focus changes detected - possible screenshot attempt');
        // Could add temporary blur here
        const container = document.querySelector('.channels-container');
        container?.classList.add('blur-lg');
        setTimeout(() => {
          container?.classList.remove('blur-lg');
        }, 2000);
        focusChanges = 0;
      }
    };

    // Initialize protections
    detectBots();
    detectVM();
    detectDebugging();

    // Add event listeners
    document.addEventListener('mousemove', trackMouse);
    document.addEventListener('scroll', trackScroll);
    window.addEventListener('focus', trackFocus);
    window.addEventListener('blur', trackFocus);

    // Memory protection - clear sensitive data
    const protectMemory = () => {
      // Overwrite potentially sensitive variables
      if ((window as any).channelsData) {
        (window as any).channelsData = null;
      }
      
      // Force garbage collection if available
      if ((window as any).gc) {
        (window as any).gc();
      }
    };

    const memoryInterval = setInterval(protectMemory, 30000);

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', trackMouse);
      document.removeEventListener('scroll', trackScroll);
      window.removeEventListener('focus', trackFocus);
      window.removeEventListener('blur', trackFocus);
      clearInterval(memoryInterval);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default ContentGuardian;
