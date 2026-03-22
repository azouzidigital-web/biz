"use client";

import * as React from "react";
import { useScreenSize } from "./use-mobile";

export function useScrollToPlan() {
  const { isSmallScreen } = useScreenSize();

  const scrollToElement = React.useCallback((elementId: string) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    element.scrollIntoView({
      behavior: 'smooth',
      block: isSmallScreen ? 'start' : 'center',
    });

    // Focus on the button for accessibility if one exists
    const button = element.querySelector('button');
    if (button && button instanceof HTMLElement) {
      button.focus();
    }
  }, [isSmallScreen]);

  return scrollToElement;
}
