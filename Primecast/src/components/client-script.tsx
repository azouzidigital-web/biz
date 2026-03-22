"use client";

import { useEffect } from 'react';

/**
 * ClientScript component for safely handling client-side script injection
 * This avoids hydration mismatches by only injecting scripts on the client
 * 
 * @param {object} props
 * @param {string} props.content - Script content to be injected
 * @param {boolean} props.inline - Whether the script should be injected inline
 * @param {string} props.src - External script source URL
 * @param {Record<string, string>} props.attributes - Additional script attributes
 */
export function ClientScript({
  content,
  inline = true,
  src,
  attributes = {}
}: {
  content?: string;
  inline?: boolean;
  src?: string;
  attributes?: Record<string, string>;
}) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const script = document.createElement('script');
    
    // Set attributes
    if (src) script.src = src;
    script.async = true;
    
    // Add all custom attributes
    Object.entries(attributes).forEach(([key, value]) => {
      script.setAttribute(key, value);
    });
    
    // Add content if inline
    if (inline && content) {
      script.innerHTML = content;
    }
    
    // Append to document
    document.body.appendChild(script);
    
    // Cleanup function
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [content, inline, src, attributes]);
  
  return null;
}
