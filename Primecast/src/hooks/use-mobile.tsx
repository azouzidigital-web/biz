"use client";

import * as React from "react"

const BREAKPOINTS = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280
}

export type ScreenSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export function useScreenSize() {
  const [screenSize, setScreenSize] = React.useState<ScreenSize>('sm'); // Default to 'sm' to prevent hydration issues

  React.useEffect(() => {
    let timeoutId: number;
    
    const updateScreenSize = () => {
      if (timeoutId) {
        window.cancelAnimationFrame(timeoutId);
      }
      
      timeoutId = window.requestAnimationFrame(() => {
        const width = window.innerWidth;
        if (width < BREAKPOINTS.xs) {
          setScreenSize('xs');
        } else if (width < BREAKPOINTS.sm) {
          setScreenSize('sm');
        } else if (width < BREAKPOINTS.md) {
          setScreenSize('md');
        } else if (width < BREAKPOINTS.lg) {
          setScreenSize('lg');
        } else {
          setScreenSize('xl');
        }
      });
    };

    // Use passive event listener for better performance
    window.addEventListener('resize', updateScreenSize, { passive: true });
    updateScreenSize();

    return () => {
      if (timeoutId) {
        window.cancelAnimationFrame(timeoutId);
      }
      window.removeEventListener('resize', updateScreenSize);
    };
  }, []);

  return {
    screenSize,
    isMobile: screenSize === 'xs' || screenSize === 'sm',
    isTablet: screenSize === 'md',
    isDesktop: screenSize === 'lg' || screenSize === 'xl',
    isSmallScreen: screenSize === 'xs' || screenSize === 'sm' || screenSize === 'md',
  };
}

// Keep backward compatibility
export function useIsMobile() {
  const { isMobile } = useScreenSize();
  return isMobile;
}
