"use client";

import { useState, useEffect } from 'react';
import { FingerprintProtection } from './fingerprint-protection';
import { BotDProtection } from './botd-protection';
import { HCaptcha } from './hcaptcha';
import { ReCaptchaV3 } from './recaptcha-v3';

interface ProtectionConfig {
  // Fingerprint protection
  enableFingerprint?: boolean;
  
  // BotD protection
  enableBotD?: boolean;
  blockBots?: boolean;
  
  // CAPTCHA options
  captchaProvider?: 'recaptcha' | 'hcaptcha' | 'both' | 'none';
  recaptchaSiteKey?: string;
  hcaptchaSiteKey?: string;
  
  // Challenge settings
  challengeThreshold?: number; // 0-100, lower = more aggressive
  requireCaptchaForSuspicious?: boolean;
  
  // Callbacks
  onBotDetected?: (source: string, details: any) => void;
  onHumanVerified?: (source: string, details: any) => void;
  onCaptchaRequired?: () => void;
  onCaptchaCompleted?: (token: string) => void;
}

interface UltimateProtectionProps {
  config: ProtectionConfig;
  children: React.ReactNode;
}

export function UltimateProtection({ config, children }: UltimateProtectionProps) {
  const [protectionState, setProtectionState] = useState<{
    fingerprintCheck: 'pending' | 'passed' | 'failed';
    botdCheck: 'pending' | 'passed' | 'failed';
    captchaRequired: boolean;
    captchaCompleted: boolean;
    overallStatus: 'checking' | 'passed' | 'blocked' | 'challenge';
    suspiciousScore: number;
  }>({
    fingerprintCheck: 'pending',
    botdCheck: 'pending',
    captchaRequired: false,
    captchaCompleted: false,
    overallStatus: 'checking',
    suspiciousScore: 0
  });

  const updateProtectionState = (updates: Partial<typeof protectionState>) => {
    setProtectionState(prev => ({ ...prev, ...updates }));
  };

  // Calculate overall protection status
  useEffect(() => {
    const { fingerprintCheck, botdCheck, captchaRequired, captchaCompleted, suspiciousScore } = protectionState;
    
    // Still checking
    if (fingerprintCheck === 'pending' || botdCheck === 'pending') {
      if (protectionState.overallStatus !== 'checking') {
        updateProtectionState({ overallStatus: 'checking' });
      }
      return;
    }
    
    // Bot detected
    if (fingerprintCheck === 'failed' || botdCheck === 'failed') {
      if (protectionState.overallStatus !== 'blocked') {
        updateProtectionState({ overallStatus: 'blocked' });
        config.onBotDetected?.('combined', { fingerprintCheck, botdCheck, suspiciousScore });
      }
      return;
    }
    
    // Suspicious behavior - require CAPTCHA
    if (suspiciousScore > (config.challengeThreshold || 30) && config.requireCaptchaForSuspicious) {
      if (!captchaCompleted) {
        if (protectionState.overallStatus !== 'challenge' || !protectionState.captchaRequired) {
          updateProtectionState({ 
            overallStatus: 'challenge',
            captchaRequired: true 
          });
          config.onCaptchaRequired?.();
        }
        return;
      }
    }
    
    // All checks passed
    if ((!captchaRequired || captchaCompleted)) {
      if (protectionState.overallStatus !== 'passed') {
        updateProtectionState({ overallStatus: 'passed' });
        config.onHumanVerified?.('combined', { fingerprintCheck, botdCheck, captchaCompleted });
      }
    }
  }, [protectionState.fingerprintCheck, protectionState.botdCheck, protectionState.captchaRequired, protectionState.captchaCompleted, protectionState.suspiciousScore, protectionState.overallStatus, config]); // More specific dependencies

  const handleFingerprintResult = (fingerprint: any) => {
    if (fingerprint.isBot) {
      updateProtectionState({ 
        fingerprintCheck: 'failed'
      });
      // Update suspicious score separately to avoid issues
      setProtectionState(prev => ({
        ...prev,
        suspiciousScore: prev.suspiciousScore + fingerprint.confidence
      }));
    } else {
      updateProtectionState({ 
        fingerprintCheck: 'passed'
      });
      // Reduce suspicion for passing
      setProtectionState(prev => ({
        ...prev,
        suspiciousScore: Math.max(0, prev.suspiciousScore - 10)
      }));
    }
  };

  const handleBotDResult = (result: any) => {
    if (result.bot) {
      updateProtectionState({ 
        botdCheck: 'failed'
      });
      setProtectionState(prev => ({
        ...prev,
        suspiciousScore: prev.suspiciousScore + result.confidence
      }));
    } else {
      updateProtectionState({ 
        botdCheck: 'passed'
      });
      setProtectionState(prev => ({
        ...prev,
        suspiciousScore: Math.max(0, prev.suspiciousScore - 10)
      }));
    }
  };

  const handleCaptchaVerification = (token: string) => {
    updateProtectionState({ captchaCompleted: true });
    config.onCaptchaCompleted?.(token);
  };

  // Show protection status during checks
  if (protectionState.overallStatus === 'checking') {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center max-w-sm mx-auto p-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <h3 className="mt-6 text-lg font-semibold text-gray-900">Security Check</h3>
          <p className="mt-2 text-gray-600">Verifying your connection...</p>
          
          <div className="mt-4 space-y-2 text-sm text-gray-500">
            <div className="flex items-center justify-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                protectionState.fingerprintCheck === 'passed' ? 'bg-green-500' :
                protectionState.fingerprintCheck === 'failed' ? 'bg-red-500' : 'bg-yellow-500 animate-pulse'
              }`}></div>
              <span>Device analysis</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                protectionState.botdCheck === 'passed' ? 'bg-green-500' :
                protectionState.botdCheck === 'failed' ? 'bg-red-500' : 'bg-yellow-500 animate-pulse'
              }`}></div>
              <span>Behavior verification</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show challenge screen
  if (protectionState.overallStatus === 'challenge') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <div className="text-yellow-600 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Security Verification</h2>
            <p className="text-gray-600 mb-6">
              Please complete the verification below to continue
            </p>
            
            {/* Show appropriate CAPTCHA */}
            {config.captchaProvider === 'recaptcha' && config.recaptchaSiteKey && (
              <ReCaptchaV3
                siteKey={config.recaptchaSiteKey}
                onVerify={handleCaptchaVerification}
                action="security_challenge"
              />
            )}
            
            {config.captchaProvider === 'hcaptcha' && config.hcaptchaSiteKey && (
              <HCaptcha
                siteKey={config.hcaptchaSiteKey}
                onVerify={handleCaptchaVerification}
                theme="light"
              />
            )}
            
            {config.captchaProvider === 'both' && (
              <div className="space-y-4">
                {config.recaptchaSiteKey && (
                  <ReCaptchaV3
                    siteKey={config.recaptchaSiteKey}
                    onVerify={handleCaptchaVerification}
                    action="security_challenge"
                  />
                )}
                {config.hcaptchaSiteKey && (
                  <HCaptcha
                    siteKey={config.hcaptchaSiteKey}
                    onVerify={handleCaptchaVerification}
                    theme="light"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show blocked screen
  if (protectionState.overallStatus === 'blocked') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="max-w-md mx-auto text-center p-8 bg-white rounded-lg shadow-lg">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            Automated access detected. This site is protected against bots and crawlers.
          </p>
          <div className="text-sm text-gray-500">
            Suspicion Score: {protectionState.suspiciousScore}%
          </div>
        </div>
      </div>
    );
  }

  // Protection passed - render with protection wrappers
  const content = (
    <>
      {children}
    </>
  );

  let wrappedContent = content;

  // Wrap with BotD protection if enabled
  if (config.enableBotD !== false) {
    wrappedContent = (
      <BotDProtection
        onBotDetected={handleBotDResult}
        onHumanVerified={handleBotDResult}
        blockBots={false} // We handle blocking at the top level
      >
        {wrappedContent}
      </BotDProtection>
    );
  }

  // Wrap with fingerprint protection if enabled
  if (config.enableFingerprint !== false) {
    wrappedContent = (
      <FingerprintProtection
        onBotDetected={handleFingerprintResult}
        onLegitimateUser={handleFingerprintResult}
      >
        {wrappedContent}
      </FingerprintProtection>
    );
  }

  return wrappedContent;
}

// Easy-to-use presets
export const ProtectionPresets = {
  // Maximum protection - all features enabled
  MAXIMUM: {
    enableFingerprint: true,
    enableBotD: true,
    blockBots: true,
    captchaProvider: 'both' as const,
    challengeThreshold: 20,
    requireCaptchaForSuspicious: true
  },
  
  // Balanced protection - good security without being too aggressive
  BALANCED: {
    enableFingerprint: true,
    enableBotD: true,
    blockBots: true,
    captchaProvider: 'recaptcha' as const,
    challengeThreshold: 40,
    requireCaptchaForSuspicious: true
  },
  
  // Minimal protection - basic bot detection only
  MINIMAL: {
    enableFingerprint: false,
    enableBotD: true,
    blockBots: true,
    captchaProvider: 'none' as const,
    challengeThreshold: 60,
    requireCaptchaForSuspicious: false
  }
};
