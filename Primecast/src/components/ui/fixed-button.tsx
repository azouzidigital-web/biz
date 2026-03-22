"use client";

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from "@/lib/utils";

interface FixedButtonProps extends ButtonProps {
  bottom?: number; // in pixels
  right?: number; // in pixels
  left?: number; // in pixels
  top?: number; // in pixels
}

/**
 * A button component that renders in a portal at the body level
 * to ensure it's not affected by any transform properties in ancestor elements
 */
export function FixedButton({ 
  children, 
  className, 
  bottom = 20, 
  right = 20,
  left,
  top,
  ...props 
}: FixedButtonProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  // Style for positioning
  const positionStyle: React.CSSProperties = {
    position: 'fixed',
    zIndex: 100,
  };
  
  // Add position values if provided
  if (bottom !== undefined) positionStyle.bottom = `${bottom}px`;
  if (right !== undefined) positionStyle.right = `${right}px`;
  if (left !== undefined) positionStyle.left = `${left}px`;
  if (top !== undefined) positionStyle.top = `${top}px`;
  
  if (!mounted) return null;
  
  // Use createPortal to ensure the button is rendered directly in the body
  // This bypasses any potential transform issues from parent elements
  return createPortal(
    <Button 
      className={cn("shadow-lg", className)}
      style={positionStyle}
      {...props}
    >
      {children}
    </Button>,
    document.body
  );
}
