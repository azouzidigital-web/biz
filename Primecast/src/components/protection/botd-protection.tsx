"use client";

import { useEffect, useState } from 'react';
import { load } from '@fingerprintjs/botd';

interface BotDetectionResult {
  bot: boolean;
  reason?: string;
  confidence: number;
}

interface BotDProtectionProps {
  onBotDetected?: (result: BotDetectionResult) => void;
  onHumanVerified?: (result: BotDetectionResult) => void;
  blockBots?: boolean;
  children: React.ReactNode;
}

export function BotDProtection({ 
  onBotDetected, 
  onHumanVerified, 
  blockBots = true,
  children 
}: BotDProtectionProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [isBot, setIsBot] = useState(false);
  const [result, setResult] = useState<BotDetectionResult | null>(null);

  useEffect(() => {
    const detectBot = async () => {
      try {
        // Load BotD
        const botd = await load();
        
        // Get bot detection result
        const detection = await botd.detect();
        
        const detectionResult: BotDetectionResult = {
          bot: detection.bot,
          reason: getBotReason(detection),
          confidence: calculateConfidence(detection)
        };
        
        setResult(detectionResult);
        setIsBot(detection.bot);
        
        if (detection.bot) {
          console.warn('Bot detected by BotD:', detectionResult);
          onBotDetected?.(detectionResult);
          
          // Log to analytics if available
          if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'bot_detected_botd', {
              bot_reason: detectionResult.reason,
              confidence: detectionResult.confidence
            });
          }
        } else {
          console.log('Human verified by BotD:', detectionResult);
          onHumanVerified?.(detectionResult);
        }
      } catch (error) {
        console.error('BotD detection failed:', error);
        // Allow access if detection fails
      }
      
      setIsAnalyzing(false);
    };

    detectBot();
  }, [onBotDetected, onHumanVerified]);

  const getBotReason = (detection: any): string => {
    // BotD provides different signals, extract the reason
    if (detection.bot) {
      // Check detection sources for more specific reasons
      if (detection.automationTool) return 'Automation tool detected';
      if (detection.headlessBrowser) return 'Headless browser detected';
      if (detection.searchBot) return 'Search bot detected';
      return 'Bot behavior detected';
    }
    return 'Human behavior confirmed';
  };

  const calculateConfidence = (detection: any): number => {
    // BotD doesn't provide confidence directly, so we estimate based on signals
    let confidence = 50;
    
    if (detection.bot) {
      confidence = 85; // High confidence for bot detection
      
      // Increase confidence based on detection signals
      if (detection.automationTool) confidence += 10;
      if (detection.headlessBrowser) confidence += 10;
      if (detection.searchBot) confidence += 5;
    } else {
      confidence = 90; // High confidence for human detection
    }
    
    return Math.min(confidence, 99);
  };

  if (isAnalyzing) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="w-8 h-8 bg-blue-600 rounded-full mx-auto"></div>
          </div>
          <p className="mt-4 text-gray-600">Analyzing visitor...</p>
        </div>
      </div>
    );
  }

  if (isBot && blockBots) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="max-w-md mx-auto text-center p-8 bg-white rounded-lg shadow-lg">
          <div className="text-orange-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Automated Access Detected</h2>
          <p className="text-gray-600 mb-4">
            {result?.reason || 'Automated behavior detected'}
          </p>
          <div className="text-sm text-gray-500">
            Confidence: {result?.confidence}%
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Hook for manual bot detection
export function useBotD() {
  const [result, setResult] = useState<BotDetectionResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const detect = async () => {
      try {
        const botd = await load();
        const detection = await botd.detect();
        
        setResult({
          bot: detection.bot,
          reason: detection.bot ? 'Bot detected' : 'Human verified',
          confidence: detection.bot ? 85 : 90
        });
      } catch (error) {
        console.error('BotD detection error:', error);
        setResult({
          bot: false,
          reason: 'Detection failed - assuming human',
          confidence: 50
        });
      }
      setIsLoading(false);
    };

    detect();
  }, []);

  return { result, isLoading };
}

// Simple component for showing bot detection status
export function BotDetectionStatus() {
  const { result, isLoading } = useBotD();

  if (isLoading) {
    return <div className="text-sm text-gray-500">Checking...</div>;
  }

  return (
    <div className={`text-sm ${result?.bot ? 'text-red-600' : 'text-green-600'}`}>
      {result?.bot ? '🤖 Bot' : '👤 Human'} ({result?.confidence}%)
    </div>
  );
}
