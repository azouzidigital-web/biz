"use client";

import { useState, useEffect } from 'react';

interface ProtectionStatus {
  isActive: boolean;
  threatsBlocked: number;
  suspicionLevel: number;
  lastThreatTime: number | null;
}

export function ProtectionMonitor({ suspicionLevel }: { suspicionLevel: number }) {
  const [status, setStatus] = useState<ProtectionStatus>({
    isActive: true,
    threatsBlocked: 0,
    suspicionLevel: 0,
    lastThreatTime: null
  });

  useEffect(() => {
    setStatus(prev => ({
      ...prev,
      suspicionLevel,
      lastThreatTime: suspicionLevel > prev.suspicionLevel ? Date.now() : prev.lastThreatTime,
      threatsBlocked: suspicionLevel > 50 && suspicionLevel > prev.suspicionLevel ? 
        prev.threatsBlocked + 1 : prev.threatsBlocked
    }));
  }, [suspicionLevel]);

  // Only show for debugging in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-3 rounded-lg text-xs font-mono max-w-xs z-50">
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-2 h-2 rounded-full ${status.isActive ? 'bg-green-400' : 'bg-red-400'}`}></div>
        <span>Bot Protection {status.isActive ? 'Active' : 'Inactive'}</span>
      </div>
      
      <div className="space-y-1">
        <div>Suspicion Level: {status.suspicionLevel}%</div>
        <div>Threats Blocked: {status.threatsBlocked}</div>
        {status.lastThreatTime && (
          <div>Last Threat: {new Date(status.lastThreatTime).toLocaleTimeString()}</div>
        )}
      </div>
      
      {status.suspicionLevel > 30 && (
        <div className="mt-2 text-yellow-400">
          ⚠️ Elevated Security Mode
        </div>
      )}
      
      {status.suspicionLevel > 70 && (
        <div className="mt-1 text-red-400">
          🚨 High Risk Detected
        </div>
      )}
    </div>
  );
}

// Real-time threat feed (for development monitoring)
export function ThreatFeed() {
  const [threats, setThreats] = useState<Array<{
    id: string;
    type: string;
    severity: 'low' | 'medium' | 'high';
    timestamp: number;
    details: string;
  }>>([]);

  const addThreat = (type: string, severity: 'low' | 'medium' | 'high', details: string) => {
    const threat = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      severity,
      timestamp: Date.now(),
      details
    };
    
    setThreats(prev => [threat, ...prev.slice(0, 9)]); // Keep last 10
  };

  // Listen for protection events
  useEffect(() => {
    const handleBotDetection = (event: CustomEvent) => {
      addThreat('Bot Detection', 'high', `Confidence: ${event.detail.confidence}%`);
    };

    const handleHoneypotTrigger = (event: CustomEvent) => {
      addThreat('Honeypot', 'high', `Fields: ${event.detail.fields.join(', ')}`);
    };

    const handleSuspiciousActivity = (event: CustomEvent) => {
      addThreat('Suspicious Activity', 'medium', event.detail.reason);
    };

    document.addEventListener('bot-detected', handleBotDetection as EventListener);
    document.addEventListener('honeypot-triggered', handleHoneypotTrigger as EventListener);
    document.addEventListener('suspicious-activity', handleSuspiciousActivity as EventListener);

    return () => {
      document.removeEventListener('bot-detected', handleBotDetection as EventListener);
      document.removeEventListener('honeypot-triggered', handleHoneypotTrigger as EventListener);
      document.removeEventListener('suspicious-activity', handleSuspiciousActivity as EventListener);
    };
  }, []);

  // Only show in development
  if (process.env.NODE_ENV !== 'development' || threats.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 bg-gray-900 text-white p-3 rounded-lg text-xs font-mono max-w-sm z-50 max-h-96 overflow-y-auto">
      <h3 className="font-bold mb-2">Security Threats</h3>
      <div className="space-y-2">
        {threats.map(threat => (
          <div key={threat.id} className="border-l-2 border-gray-600 pl-2">
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${
                threat.severity === 'high' ? 'bg-red-400' :
                threat.severity === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
              }`}></span>
              <span className="font-semibold">{threat.type}</span>
              <span className="text-gray-400 text-xs">
                {new Date(threat.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <div className="text-gray-300 text-xs mt-1">{threat.details}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
