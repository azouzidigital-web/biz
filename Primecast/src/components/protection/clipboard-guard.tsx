"use client";

import { useEffect } from 'react';

export const ClipboardGuard = () => {
  useEffect(() => {
    // Monitor clipboard access attempts
    const originalWriteText = navigator.clipboard?.writeText;
    const originalWrite = navigator.clipboard?.write;
    const originalReadText = navigator.clipboard?.readText;
    const originalRead = navigator.clipboard?.read;

    if (navigator.clipboard) {
      // Override clipboard write methods
      navigator.clipboard.writeText = async (text: string) => {
        // Check if text contains channel names or sensitive data
        const sensitivePatterns = ['TSN', 'CBC', 'CTV', 'Sportsnet', 'HBO', 'Netflix'];
        const containsSensitive = sensitivePatterns.some(pattern => 
          text.includes(pattern)
        );

        if (containsSensitive) {
          console.warn('Attempt to copy protected content blocked');
          throw new Error('Content is protected and cannot be copied');
        }

        return originalWriteText?.call(navigator.clipboard, text);
      };

      navigator.clipboard.write = async (data: ClipboardItems) => {
        console.warn('Clipboard write attempt detected');
        return originalWrite?.call(navigator.clipboard, data);
      };

      // Monitor clipboard read attempts
      navigator.clipboard.readText = async () => {
        console.warn('Clipboard read attempt detected');
        return originalReadText?.call(navigator.clipboard);
      };

      navigator.clipboard.read = async () => {
        console.warn('Clipboard read attempt detected');
        return originalRead?.call(navigator.clipboard);
      };
    }

    // Legacy clipboard monitoring
    const handleCopy = (e: ClipboardEvent) => {
      const selection = window.getSelection()?.toString();
      if (selection && selection.length > 10) {
        e.preventDefault();
        console.warn('Copy attempt blocked');
        
        // Show temporary message
        const message = document.createElement('div');
        message.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(239, 68, 68, 0.9);
          color: white;
          padding: 1rem 2rem;
          border-radius: 0.5rem;
          z-index: 10000;
          font-weight: bold;
        `;
        message.textContent = '🚫 Content is protected and cannot be copied';
        document.body.appendChild(message);

        setTimeout(() => {
          message.remove();
        }, 2000);
      }
    };

    const handleCut = (e: ClipboardEvent) => {
      e.preventDefault();
      console.warn('Cut attempt blocked');
    };

    const handlePaste = (e: ClipboardEvent) => {
      // Allow paste but log it
      console.log('Paste detected');
    };

    // Add event listeners
    document.addEventListener('copy', handleCopy);
    document.addEventListener('cut', handleCut);
    document.addEventListener('paste', handlePaste);

    // Cleanup
    return () => {
      // Restore original clipboard methods
      if (navigator.clipboard) {
        if (originalWriteText) navigator.clipboard.writeText = originalWriteText;
        if (originalWrite) navigator.clipboard.write = originalWrite;
        if (originalReadText) navigator.clipboard.readText = originalReadText;
        if (originalRead) navigator.clipboard.read = originalRead;
      }

      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('cut', handleCut);
      document.removeEventListener('paste', handlePaste);
    };
  }, []);

  return null;
};

export default ClipboardGuard;
