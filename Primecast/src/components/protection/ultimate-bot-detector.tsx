"use client";

import { useEffect, useState } from 'react';

// Network-based bot detection
export function NetworkBotDetector({ onBotDetected }: { onBotDetected: (score: number) => void }) {
  useEffect(() => {
    const detectNetworkBot = async () => {
      let suspicionScore = 0;
      
      try {
        // Check for WebRTC leaks (VPN/Proxy detection)
        const rtcConfig = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
        const pc = new RTCPeerConnection(rtcConfig);
        
        pc.createDataChannel('');
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        
        const localIPs: string[] = [];
        pc.onicecandidate = (ice) => {
          if (ice.candidate) {
            const candidate = ice.candidate.candidate;
            const ip = candidate.split(' ')[4];
            if (ip && !localIPs.includes(ip)) {
              localIPs.push(ip);
            }
          }
        };
        
        // Wait for ICE gathering
        setTimeout(() => {
          pc.close();
          
          // Check for suspicious IP patterns
          const hasLocalIP = localIPs.some(ip => 
            ip.startsWith('192.168.') || 
            ip.startsWith('10.') || 
            ip.startsWith('172.')
          );
          
          const hasPublicIP = localIPs.some(ip => 
            !ip.startsWith('192.168.') && 
            !ip.startsWith('10.') && 
            !ip.startsWith('172.') &&
            !ip.startsWith('127.')
          );
          
          // Suspicious if only local IPs (common in headless browsers)
          if (hasLocalIP && !hasPublicIP) {
            suspicionScore += 25;
          }
          
          // Check for too many IPs (proxy chains)
          if (localIPs.length > 5) {
            suspicionScore += 20;
          }
          
          if (suspicionScore > 0) {
            onBotDetected(suspicionScore);
          }
        }, 3000);
        
      } catch (error) {
        // WebRTC not available or blocked
        suspicionScore += 15;
      }
      
      // DNS timing analysis
      try {
        const start = performance.now();
        await fetch('/favicon.ico', { method: 'HEAD', cache: 'no-cache' });
        const dnsTime = performance.now() - start;
        
        // Suspiciously fast DNS resolution (cached/local)
        if (dnsTime < 1) {
          suspicionScore += 10;
        }
      } catch (error) {
        // Network error
        suspicionScore += 5;
      }
      
      // Connection speed analysis
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        if (connection) {
          // Unlimited bandwidth often indicates headless browsers
          if (connection.downlink > 1000 || connection.rtt === 0) {
            suspicionScore += 15;
          }
          
          // Check for inconsistent connection types
          if (connection.effectiveType === '4g' && connection.downlink < 1) {
            suspicionScore += 10;
          }
        }
      }
      
      if (suspicionScore > 0) {
        onBotDetected(suspicionScore);
      }
    };
    
    detectNetworkBot();
  }, [onBotDetected]);
  
  return null;
}

// Performance-based bot detection
export function PerformanceBotDetector({ onBotDetected }: { onBotDetected: (score: number) => void }) {
  useEffect(() => {
    const detectPerformanceBot = () => {
      let suspicionScore = 0;
      
      // Check JavaScript execution speed
      const start = performance.now();
      let iterations = 0;
      const maxTime = 10; // 10ms limit
      
      while (performance.now() - start < maxTime) {
        iterations++;
        Math.random(); // Simple operation
      }
      
      // Too fast execution might indicate optimized bot environment
      if (iterations > 100000) {
        suspicionScore += 20;
      }
      
      // Check for performance timing anomalies
      if (performance.timing) {
        const timing = performance.timing;
        const navigationStart = timing.navigationStart;
        const loadEventEnd = timing.loadEventEnd;
        
        if (navigationStart && loadEventEnd) {
          const totalLoadTime = loadEventEnd - navigationStart;
          
          // Suspiciously fast page load
          if (totalLoadTime < 100) {
            suspicionScore += 15;
          }
          
          // Zero load time (cached/preloaded)
          if (totalLoadTime === 0) {
            suspicionScore += 25;
          }
        }
      }
      
      // Check for memory usage patterns
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        if (memory) {
          // Unrealistic memory values
          if (memory.totalJSHeapSize === 0 || memory.usedJSHeapSize === 0) {
            suspicionScore += 20;
          }
          
          // Too much available memory (server environment)
          if (memory.totalJSHeapSize > 1000000000) { // 1GB
            suspicionScore += 15;
          }
        }
      }
      
      // Check for hardware concurrency anomalies
      if (navigator.hardwareConcurrency) {
        const cores = navigator.hardwareConcurrency;
        
        // Unusual core counts
        if (cores === 1 || cores > 32) {
          suspicionScore += 10;
        }
        
        // Perfect power of 2 (common in VMs)
        if (cores > 4 && (cores & (cores - 1)) === 0) {
          suspicionScore += 5;
        }
      }
      
      if (suspicionScore > 0) {
        onBotDetected(suspicionScore);
      }
    };
    
    // Run after page is fully loaded
    if (document.readyState === 'complete') {
      detectPerformanceBot();
    } else {
      window.addEventListener('load', detectPerformanceBot);
    }
    
    return () => {
      window.removeEventListener('load', detectPerformanceBot);
    };
  }, [onBotDetected]);
  
  return null;
}

// Audio context based detection
export function AudioBotDetector({ onBotDetected }: { onBotDetected: (score: number) => void }) {
  useEffect(() => {
    const detectAudioBot = async () => {
      let suspicionScore = 0;
      
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Check for audio fingerprinting
        const oscillator = audioContext.createOscillator();
        const analyser = audioContext.createAnalyser();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(analyser);
        analyser.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 440; // A4 note
        gainNode.gain.value = 0; // Silent
        
        oscillator.start();
        
        // Wait a bit for audio processing
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);
        
        oscillator.stop();
        audioContext.close();
        
        // Check for suspicious audio processing
        const sum = dataArray.reduce((a, b) => a + b, 0);
        const average = sum / bufferLength;
        
        // No audio processing (headless browser)
        if (average === 0) {
          suspicionScore += 25;
        }
        
        // Perfect audio processing (unlikely in real browsers)
        if (average === 128) {
          suspicionScore += 20;
        }
        
      } catch (error) {
        // Audio context not available or blocked
        suspicionScore += 15;
      }
      
      if (suspicionScore > 0) {
        onBotDetected(suspicionScore);
      }
    };
    
    detectAudioBot();
  }, [onBotDetected]);
  
  return null;
}

// Combined advanced detection system
export function UltimateBotDetector({ onBotDetected }: { onBotDetected: (totalScore: number, details: any) => void }) {
  const [networkScore, setNetworkScore] = useState(0);
  const [performanceScore, setPerformanceScore] = useState(0);
  const [audioScore, setAudioScore] = useState(0);
  
  useEffect(() => {
    const totalScore = networkScore + performanceScore + audioScore;
    
    if (totalScore > 0) {
      onBotDetected(totalScore, {
        network: networkScore,
        performance: performanceScore,
        audio: audioScore
      });
    }
  }, [networkScore, performanceScore, audioScore, onBotDetected]);
  
  return (
    <>
      <NetworkBotDetector onBotDetected={setNetworkScore} />
      <PerformanceBotDetector onBotDetected={setPerformanceScore} />
      <AudioBotDetector onBotDetected={setAudioScore} />
    </>
  );
}
