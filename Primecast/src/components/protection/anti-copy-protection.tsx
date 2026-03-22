"use client";

import { useEffect, useRef } from 'react';

interface AntiCopyProtectionProps {
  children: React.ReactNode;
  domain?: string;
}

export function AntiCopyProtection({ children, domain = "IPTV-PRO.CA" }: AntiCopyProtectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Disable text selection
    const handleSelectStart = (e: Event) => {
      e.preventDefault();
      return false;
    };

    // Disable drag and drop
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // Disable keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable F12 (Developer Tools)
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }

      // Disable Ctrl+Shift+I (Developer Tools)
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
      }

      // Disable Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault();
        return false;
      }

      // Disable Ctrl+U (View Source)
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        return false;
      }

      // Disable Ctrl+S (Save Page)
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        return false;
      }

      // Disable Ctrl+A (Select All)
      if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        return false;
      }

      // Disable Ctrl+C (Copy)
      if (e.ctrlKey && e.key === 'c') {
        e.preventDefault();
        return false;
      }

      // Disable Ctrl+V (Paste)
      if (e.ctrlKey && e.key === 'v') {
        e.preventDefault();
        return false;
      }

      // Disable Ctrl+X (Cut)
      if (e.ctrlKey && e.key === 'x') {
        e.preventDefault();
        return false;
      }

      // Disable Ctrl+P (Print)
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        return false;
      }
    };

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('keydown', handleKeyDown);

    // Disable text selection via CSS
    if (containerRef.current) {
      containerRef.current.style.userSelect = 'none';
      containerRef.current.style.webkitUserSelect = 'none';
      containerRef.current.style.mozUserSelect = 'none';
      containerRef.current.style.msUserSelect = 'none';
    }

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Developer Tools Detection
  useEffect(() => {
    let devtools = { 
      open: false, 
      orientation: null as string | null 
    };

    const threshold = 160;

    const detectDevTools = () => {
      if (
        window.outerHeight - window.innerHeight > threshold ||
        window.outerWidth - window.innerWidth > threshold
      ) {
        if (!devtools.open) {
          devtools.open = true;
          // Redirect or show warning
          alert('Developer tools detected! This page is protected.');
          window.location.href = '/';
        }
      } else {
        devtools.open = false;
      }
    };

    // Check every 500ms
    const interval = setInterval(detectDevTools, 500);

    return () => clearInterval(interval);
  }, []);

  // Screenshot Detection (Experimental)
  useEffect(() => {
    const detectScreenshot = () => {
      // Check for common screenshot tools
      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        // Modern browsers with screen capture API
        console.warn('Screen capture capability detected');
      }

      // Detect print screen key
      const handleKeyUp = (e: KeyboardEvent) => {
        if (e.key === 'PrintScreen') {
          alert('Screenshots are not allowed on this page!');
          // Optionally blur the content temporarily
          if (containerRef.current) {
            containerRef.current.style.filter = 'blur(10px)';
            setTimeout(() => {
              if (containerRef.current) {
                containerRef.current.style.filter = 'none';
              }
            }, 2000);
          }
        }
      };

      document.addEventListener('keyup', handleKeyUp);
      return () => document.removeEventListener('keyup', handleKeyUp);
    };

    return detectScreenshot();
  }, []);

  // Add watermark overlay
  useEffect(() => {
    const createWatermark = () => {
      const watermark = document.createElement('div');
      watermark.innerHTML = domain;
      watermark.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(-45deg);
        font-size: 120px;
        color: rgba(0, 0, 0, 0.03);
        font-weight: bold;
        pointer-events: none;
        z-index: 9999;
        user-select: none;
        font-family: Arial, sans-serif;
        white-space: nowrap;
      `;
      
      watermark.id = 'protection-watermark';
      document.body.appendChild(watermark);

      // Add multiple smaller watermarks
      for (let i = 0; i < 9; i++) {
        const smallWatermark = document.createElement('div');
        smallWatermark.innerHTML = domain;
        smallWatermark.style.cssText = `
          position: fixed;
          top: ${20 + (i % 3) * 30}%;
          left: ${10 + Math.floor(i / 3) * 30}%;
          transform: rotate(-25deg);
          font-size: 24px;
          color: rgba(0, 0, 0, 0.02);
          font-weight: bold;
          pointer-events: none;
          z-index: 9998;
          user-select: none;
          font-family: Arial, sans-serif;
        `;
        smallWatermark.className = 'protection-watermark-small';
        document.body.appendChild(smallWatermark);
      }
    };

    createWatermark();

    return () => {
      const watermark = document.getElementById('protection-watermark');
      if (watermark) watermark.remove();
      
      const smallWatermarksNodeList = document.querySelectorAll('.protection-watermark-small');
      smallWatermarksNodeList.forEach(wm => wm.remove());
    };
  }, [domain]);

  return (
    <div 
      ref={containerRef}
      className="select-none"
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        WebkitTouchCallout: 'none',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {children}
    </div>
  );
}
