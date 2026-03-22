"use client";

import { useEffect, useState } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

interface DeviceFingerprint {
  visitorId: string;
  confidence: number;
  isBot: boolean;
  suspiciousFactors: string[];
}

interface FingerprintProtectionProps {
  onBotDetected?: (fingerprint: DeviceFingerprint) => void;
  onLegitimateUser?: (fingerprint: DeviceFingerprint) => void;
  children: React.ReactNode;
}

export function FingerprintProtection({ 
  onBotDetected, 
  onLegitimateUser, 
  children 
}: FingerprintProtectionProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [isBlocked, setIsBlocked] = useState(false);
  const [fingerprint, setFingerprint] = useState<DeviceFingerprint | null>(null);

  useEffect(() => {
    const analyzeFingerprint = async () => {
      try {
        // Initialize FingerprintJS
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        
        // Analyze the fingerprint for bot indicators
        const analysis = analyzeFingerprintForBots(result);
        
        setFingerprint(analysis);
        
        if (analysis.isBot) {
          setIsBlocked(true);
          onBotDetected?.(analysis);
          
          // Log bot attempt
          console.warn('Bot detected:', {
            visitorId: analysis.visitorId,
            factors: analysis.suspiciousFactors,
            confidence: analysis.confidence
          });
          
          // Optional: Send to analytics
          if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'bot_detected', {
              visitor_id: analysis.visitorId,
              confidence: analysis.confidence,
              factors: analysis.suspiciousFactors.join(',')
            });
          }
        } else {
          onLegitimateUser?.(analysis);
        }
      } catch (error) {
        console.error('Fingerprint analysis failed:', error);
        // Allow access if fingerprinting fails to avoid blocking legitimate users
      }
      
      setIsAnalyzing(false);
    };

    analyzeFingerprint();
  }, [onBotDetected, onLegitimateUser]);

  const analyzeFingerprintForBots = (result: any): DeviceFingerprint => {
    const components = result.components;
    const suspiciousFactors: string[] = [];
    let suspiciousScore = 0;

    // Check for headless browser indicators
    if (components.canvas?.value === 'winding:yes~canvas:yes' ||
        components.canvas?.value?.includes('headless')) {
      suspiciousFactors.push('headless_canvas');
      suspiciousScore += 30;
    }

    // Check for automation tools
    if (components.plugins?.value?.length === 0) {
      suspiciousFactors.push('no_plugins');
      suspiciousScore += 20;
    }

    // Check WebGL renderer
    const webgl = components.webgl?.value;
    if (webgl?.includes('SwiftShader') || 
        webgl?.includes('Mesa') || 
        webgl?.includes('VMware')) {
      suspiciousFactors.push('vm_webgl');
      suspiciousScore += 25;
    }

    // Check for missing features that real browsers have
    if (!components.touchSupport?.value?.maxTouchPoints) {
      suspiciousFactors.push('no_touch_support');
      suspiciousScore += 10;
    }

    // Check timezone consistency
    const timezone = components.timezone?.value;
    if (!timezone || timezone === 'UTC') {
      suspiciousFactors.push('suspicious_timezone');
      suspiciousScore += 15;
    }

    // Check for automated user agent
    const platform = components.platform?.value;
    const userAgent = navigator.userAgent;
    if (platform && userAgent && !userAgent.includes(platform)) {
      suspiciousFactors.push('ua_platform_mismatch');
      suspiciousScore += 20;
    }

    // Check for perfect screen dimensions (common in headless)
    const screen = components.screenResolution?.value;
    if (screen?.includes('1920x1080') || screen?.includes('1366x768')) {
      // These are common bot resolutions
      suspiciousScore += 5;
    }

    // Check audio context
    if (!components.audio?.value) {
      suspiciousFactors.push('no_audio_context');
      suspiciousScore += 15;
    }

    // Check for webdriver property
    if ((window as any).webdriver === true) {
      suspiciousFactors.push('webdriver_detected');
      suspiciousScore += 50;
    }

    // Check for automation globals
    const automationGlobals = ['__selenium_unwrapped', '__webdriver_evaluate', '__webdriver_script_function'];
    const foundGlobals = automationGlobals.filter(global => (window as any)[global]);
    if (foundGlobals.length > 0) {
      suspiciousFactors.push('automation_globals');
      suspiciousScore += 40;
    }

    const confidence = Math.min(suspiciousScore, 100);
    const isBot = confidence > 50; // Threshold for bot detection

    return {
      visitorId: result.visitorId,
      confidence,
      isBot,
      suspiciousFactors
    };
  };

  if (isAnalyzing) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying security...</p>
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
              <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            Automated access detected. This site is protected against bots and crawlers.
          </p>
          <div className="text-sm text-gray-500 mt-4">
            Visitor ID: {fingerprint?.visitorId.slice(0, 8)}...
            <br />
            Confidence: {fingerprint?.confidence}%
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Export hook for manual fingerprint analysis
export function useFingerprint() {
  const [fingerprint, setFingerprint] = useState<DeviceFingerprint | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getFingerprint = async () => {
      try {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        
        // Basic analysis - you can customize this
        const analysis: DeviceFingerprint = {
          visitorId: result.visitorId,
          confidence: 0,
          isBot: false,
          suspiciousFactors: []
        };
        
        setFingerprint(analysis);
      } catch (error) {
        console.error('Fingerprint error:', error);
      }
      setIsLoading(false);
    };

    getFingerprint();
  }, []);

  return { fingerprint, isLoading };
}
