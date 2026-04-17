"use client";

import { useState, useEffect, ReactNode } from "react";
import { Turnstile } from "@marsidev/react-turnstile";

interface TurnstileProtectionProps {
  children: ReactNode;
}

export function TurnstileProtection({ children }: TurnstileProtectionProps) {
  const [isVerified, setIsVerified] = useState(false);

  const isValidTurnstileSiteKey = (value?: string) => {
    if (!value) return false;

    const normalized = value.trim().toLowerCase();
    if (!normalized) return false;

    // Common placeholder values that trigger Turnstile runtime errors.
    const looksLikePlaceholder =
      normalized.includes('your') ||
      normalized.includes('site key') ||
      normalized.includes('sitekey') ||
      normalized.includes('placeholder') ||
      normalized.includes('example');

    return !looksLikePlaceholder;
  };

  // Temporary: Check if we should bypass Turnstile for testing
  const shouldBypass = typeof window !== 'undefined' && window.location.search.includes('bypass=true');
  
  if (shouldBypass) {
    console.log('🚫 Turnstile bypassed for testing');
    return <>{children}</>;
  }

  useEffect(() => {
    // Debug environment variables
    console.log('🔍 Environment Debug:');
    console.log('🔑 NEXT_PUBLIC_TURNSTILE_SITE_KEY:', process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ? 'Present' : 'Missing');
    console.log('🌐 Current hostname:', typeof window !== 'undefined' ? window.location.hostname : 'SSR');
    console.log('📍 Current URL:', typeof window !== 'undefined' ? window.location.href : 'SSR');
    
    // Check if user was previously verified (session storage)
    const wasVerified = sessionStorage.getItem('turnstile-verified');
    if (wasVerified === 'true') {
      console.log('✅ User already verified in this session');
      setIsVerified(true);
    } else {
      // Start invisible verification immediately
      console.log('🧠 Starting invisible Cloudflare verification...');
    }
  }, []);

  const handleSuccess = (token: string) => {
    console.log('✅ Turnstile verification successful');
    setIsVerified(true);
    // Store verification in session (expires when browser closes)
    sessionStorage.setItem('turnstile-verified', 'true');
  };

  const handleError = (error?: string) => {
    console.log('❌ Turnstile verification failed:', error);
    console.log('🔑 Site key:', process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ? 'Present' : 'Missing');
    console.log('🌐 Current domain:', typeof window !== 'undefined' ? window.location.hostname : 'Unknown');
    // On error, keep showing content but retry verification
  };

  const handleExpire = () => {
    console.log('⏰ Turnstile verification expired');
    setIsVerified(false);
    sessionStorage.removeItem('turnstile-verified');
  };

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const shouldEnableTurnstile = isValidTurnstileSiteKey(siteKey);

  if (!shouldEnableTurnstile) {
    console.warn('⚠️ Turnstile disabled: NEXT_PUBLIC_TURNSTILE_SITE_KEY is missing or invalid.');
    return <>{children}</>;
  }

  // Always render content with invisible Turnstile
  return (
    <>
      {children}
      {/* Invisible Turnstile verification */}
      {!isVerified && (
        <div style={{ position: 'fixed', top: '-9999px', left: '-9999px' }}>
          <Turnstile
            siteKey={siteKey}
            onSuccess={handleSuccess}
            onError={handleError}
            onExpire={handleExpire}
            options={{
              theme: 'auto',
              size: 'invisible',
              execution: 'execute',
              retry: 'auto',
              appearance: 'execute',
            }}
          />
        </div>
      )}
    </>
  );
}
