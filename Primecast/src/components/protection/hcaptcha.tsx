"use client";

import { useEffect, useState, useRef } from 'react';

interface HCaptchaProps {
  siteKey: string;
  onVerify: (token: string) => void;
  onError?: (error: string) => void;
  onExpire?: () => void;
  theme?: 'light' | 'dark';
  size?: 'normal' | 'compact' | 'invisible';
  invisible?: boolean;
}

export function HCaptcha({
  siteKey,
  onVerify,
  onError,
  onExpire,
  theme = 'light',
  size = 'normal',
  invisible = false
}: HCaptchaProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const captchaRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Load hCaptcha script
    const loadHCaptcha = () => {
      if ((window as any).hcaptcha) {
        setIsLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://js.hcaptcha.com/1/api.js';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        setIsLoaded(true);
      };
      
      script.onerror = () => {
        setError('Failed to load hCaptcha');
        onError?.('Failed to load hCaptcha');
      };

      document.head.appendChild(script);
    };

    loadHCaptcha();

    return () => {
      // Cleanup
      const script = document.querySelector('script[src*="hcaptcha"]');
      if (script) {
        script.remove();
      }
    };
  }, [onError]);

  useEffect(() => {
    if (isLoaded && captchaRef.current && (window as any).hcaptcha) {
      try {
        const widgetId = (window as any).hcaptcha.render(captchaRef.current, {
          sitekey: siteKey,
          theme,
          size: invisible ? 'invisible' : size,
          callback: (token: string) => {
            onVerify(token);
          },
          'error-callback': (error: string) => {
            setError(`hCaptcha error: ${error}`);
            onError?.(error);
          },
          'expired-callback': () => {
            onExpire?.();
          }
        });
        
        widgetIdRef.current = widgetId;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(`Failed to render hCaptcha: ${errorMessage}`);
        onError?.(errorMessage);
      }
    }

    return () => {
      if (widgetIdRef.current && (window as any).hcaptcha) {
        try {
          (window as any).hcaptcha.remove(widgetIdRef.current);
        } catch (err) {
          // Ignore cleanup errors
        }
      }
    };
  }, [isLoaded, siteKey, theme, size, invisible, onVerify, onError, onExpire]);

  // Method to execute invisible captcha
  const execute = () => {
    if (widgetIdRef.current && (window as any).hcaptcha) {
      (window as any).hcaptcha.execute(widgetIdRef.current);
    }
  };

  // Method to reset captcha
  const reset = () => {
    if (widgetIdRef.current && (window as any).hcaptcha) {
      (window as any).hcaptcha.reset(widgetIdRef.current);
    }
  };

  if (error) {
    return (
      <div className="text-red-600 text-sm p-4 border border-red-300 rounded">
        Security verification unavailable: {error}
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-sm text-gray-600">Loading security check...</span>
      </div>
    );
  }

  return (
    <div className="hcaptcha-container">
      <div ref={captchaRef}></div>
      {invisible && (
        <button
          type="button"
          onClick={execute}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Verify I'm Human
        </button>
      )}
    </div>
  );
}

// Hook for easier hCaptcha integration
export function useHCaptcha(siteKey: string) {
  const [isReady, setIsReady] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.hcaptcha.com/1/api.js';
    script.async = true;
    
    script.onload = () => {
      setIsReady(true);
    };

    document.head.appendChild(script);

    return () => {
      const script = document.querySelector('script[src*="hcaptcha"]');
      if (script) script.remove();
    };
  }, []);

  const execute = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!isReady || !(window as any).hcaptcha) {
        reject(new Error('hCaptcha not ready'));
        return;
      }

      const container = document.createElement('div');
      document.body.appendChild(container);

      const widgetId = (window as any).hcaptcha.render(container, {
        sitekey: siteKey,
        size: 'invisible',
        callback: (token: string) => {
          setToken(token);
          resolve(token);
          document.body.removeChild(container);
        },
        'error-callback': (error: string) => {
          reject(new Error(error));
          document.body.removeChild(container);
        }
      });

      (window as any).hcaptcha.execute(widgetId);
    });
  };

  return { isReady, token, execute };
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    hcaptcha: any;
  }
}
