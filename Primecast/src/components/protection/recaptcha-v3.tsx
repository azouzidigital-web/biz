"use client";

import { useEffect, useState } from 'react';

interface ReCaptchaV3Props {
  onVerify: (token: string, score?: number) => void;
  action?: string;
  siteKey: string;
}

export function ReCaptchaV3({ onVerify, action = 'submit', siteKey }: ReCaptchaV3Props) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load reCAPTCHA v3 script
    const loadRecaptcha = () => {
      if (window.grecaptcha) {
        setIsLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        window.grecaptcha.ready(() => {
          setIsLoaded(true);
        });
      };
      
      script.onerror = () => {
        setError('Failed to load reCAPTCHA');
      };

      document.head.appendChild(script);
    };

    loadRecaptcha();

    return () => {
      // Cleanup script if component unmounts
      const script = document.querySelector(`script[src*="recaptcha"]`);
      if (script) {
        script.remove();
      }
    };
  }, [siteKey]);

  const executeRecaptcha = async () => {
    if (!isLoaded || !window.grecaptcha) {
      setError('reCAPTCHA not loaded');
      return;
    }

    try {
      const token = await window.grecaptcha.execute(siteKey, { action });
      
      // Optionally verify the token server-side and get score
      // For now, we'll just pass the token
      onVerify(token);
    } catch (err) {
      setError('reCAPTCHA execution failed');
      console.error('reCAPTCHA error:', err);
    }
  };

  // Auto-execute on load
  useEffect(() => {
    if (isLoaded) {
      executeRecaptcha();
    }
  }, [isLoaded]);

  if (error) {
    return (
      <div className="text-red-600 text-sm">
        Security verification unavailable. Please try again.
      </div>
    );
  }

  return (
    <div className="recaptcha-v3">
      {/* reCAPTCHA v3 is invisible, but we can show a badge */}
      <div className="text-xs text-gray-500 mt-2">
        Protected by reCAPTCHA
      </div>
    </div>
  );
}

// Hook for easy reCAPTCHA v3 integration
export function useReCaptchaV3(siteKey: string) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    
    script.onload = () => {
      window.grecaptcha.ready(() => {
        setIsReady(true);
      });
    };

    document.head.appendChild(script);

    return () => {
      const script = document.querySelector(`script[src*="recaptcha"]`);
      if (script) script.remove();
    };
  }, [siteKey]);

  const executeRecaptcha = async (action: string = 'submit') => {
    if (!isReady || !window.grecaptcha) {
      throw new Error('reCAPTCHA not ready');
    }

    return await window.grecaptcha.execute(siteKey, { action });
  };

  return { isReady, executeRecaptcha };
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    grecaptcha: any;
  }
}
