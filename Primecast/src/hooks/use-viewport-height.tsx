"use client";

import { useEffect } from "react";

/**
 * A hook that adjusts the viewport height CSS variable to account for mobile browser
 * address bars that can expand and collapse, affecting the available vertical space.
 * This ensures consistent viewport units (vh) across all devices.
 */
export function useViewportHeight() {
  useEffect(() => {
    let timeoutId: number;
    
    // Debounced function to update the --vh custom property
    const setVh = () => {
      if (timeoutId) {
        window.cancelAnimationFrame(timeoutId);
      }
      
      timeoutId = window.requestAnimationFrame(() => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty("--vh", `${vh}px`);
      });
    };

    // Initial setting
    setVh();

    // Use passive listeners for better scroll performance
    window.addEventListener("resize", setVh, { passive: true });
    window.addEventListener("orientationchange", setVh, { passive: true });

    return () => {
      if (timeoutId) {
        window.cancelAnimationFrame(timeoutId);
      }
      window.removeEventListener("resize", setVh);
      window.removeEventListener("orientationchange", setVh);
    };
  }, []);
}

export function ViewportHeightAdjuster() {
  useViewportHeight();
  return null;
}
