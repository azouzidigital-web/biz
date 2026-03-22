"use client";

import { useEffect, useState } from 'react';

interface DataDomeConfig {
  clientSideKey: string;
  endpoint?: string;
  ajaxListenerPath?: string;
  withCredentials?: boolean;
  exposeCaptchaFunction?: boolean;
  disableAutoRefreshOnCaptchaPassed?: boolean;
}

interface DataDomeProtectionProps {
  config: DataDomeConfig;
  onBlocked?: () => void;
  onPassed?: () => void;
  children: React.ReactNode;
}

export function DataDomeProtection({ 
  config, 
  onBlocked, 
  onPassed, 
  children 
}: DataDomeProtectionProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    const loadDataDome = () => {
      // Create DataDome script
      const script = document.createElement('script');
      script.src = 'https://js.datadome.co/tags.js';
      script.async = true;
      
      // Configure DataDome
      (window as any).ddjskey = config.clientSideKey;
      
      if (config.endpoint) {
        (window as any).ddoptions = {
          endpoint: config.endpoint,
          ajaxListenerPath: config.ajaxListenerPath,
          withCredentials: config.withCredentials,
          exposeCaptchaFunction: config.exposeCaptchaFunction,
          disableAutoRefreshOnCaptchaPassed: config.disableAutoRefreshOnCaptchaPassed
        };
      }

      script.onload = () => {
        setIsLoading(false);
        
        // Check if DataDome detected us as a bot
        const checkDataDomeStatus = () => {
          const dataDomeStatus = (window as any).DD_RUM?.getInternalContext?.()?.application_id;
          
          // Listen for DataDome events
          if ((window as any).DD_RUM) {
            (window as any).DD_RUM.onReady(() => {
              console.log('DataDome protection active');
              onPassed?.();
            });
          }
        };

        // Check status after a short delay
        setTimeout(checkDataDomeStatus, 1000);
      };

      script.onerror = () => {
        console.error('Failed to load DataDome');
        setIsLoading(false);
        // Allow access if DataDome fails to load
      };

      document.head.appendChild(script);
    };

    loadDataDome();

    // Listen for DataDome captcha events
    const handleDataDomeEvents = (event: any) => {
      if (event.detail?.type === 'captcha_displayed') {
        console.log('DataDome CAPTCHA displayed');
      } else if (event.detail?.type === 'captcha_passed') {
        console.log('DataDome CAPTCHA passed');
        onPassed?.();
      } else if (event.detail?.type === 'blocked') {
        console.log('DataDome blocked request');
        setIsBlocked(true);
        onBlocked?.();
      }
    };

    document.addEventListener('datadome', handleDataDomeEvents);

    return () => {
      document.removeEventListener('datadome', handleDataDomeEvents);
      const script = document.querySelector('script[src*="datadome"]');
      if (script) script.remove();
    };
  }, [config, onBlocked, onPassed]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Initializing protection...</p>
        </div>
      </div>
    );
  }

  if (isBlocked) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="max-w-md mx-auto text-center p-8 bg-white rounded-lg shadow-lg">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Restricted</h2>
          <p className="text-gray-600 mb-4">
            Your request has been blocked by our security system.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Hook for DataDome integration
export function useDataDome(clientSideKey: string) {
  const [isReady, setIsReady] = useState(false);
  const [status, setStatus] = useState<'loading' | 'active' | 'blocked'>('loading');

  useEffect(() => {
    (window as any).ddjskey = clientSideKey;
    
    const script = document.createElement('script');
    script.src = 'https://js.datadome.co/tags.js';
    script.async = true;
    
    script.onload = () => {
      setIsReady(true);
      setStatus('active');
    };

    document.head.appendChild(script);

    return () => {
      const script = document.querySelector('script[src*="datadome"]');
      if (script) script.remove();
    };
  }, [clientSideKey]);

  return { isReady, status };
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ddjskey: string;
    ddoptions: any;
    DD_RUM: any;
  }
}
