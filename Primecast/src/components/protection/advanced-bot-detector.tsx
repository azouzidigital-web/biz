"use client";

import { useEffect, useState, useCallback } from 'react';

interface BotDetectionResult {
  isBot: boolean;
  confidence: number;
  reasons: string[];
}

export function useAdvancedBotDetection(): BotDetectionResult {
  const [result, setResult] = useState<BotDetectionResult>({
    isBot: false,
    confidence: 0,
    reasons: []
  });

  useEffect(() => {
    const detectBot = async (): Promise<BotDetectionResult> => {
      const reasons: string[] = [];
      let suspicionScore = 0;

      // 1. User Agent Analysis - Enhanced
      const userAgent = navigator.userAgent.toLowerCase();
      const botPatterns = [
        'headless', 'phantom', 'selenium', 'puppeteer', 'playwright',
        'nightmare', 'zombie', 'jsdom', 'bot', 'crawler', 'spider',
        'scraper', 'curl', 'wget', 'python', 'java', 'node', 'go-http',
        'okhttp', 'apache-httpclient', 'libcurl', 'mechanize'
      ];
      
      if (botPatterns.some(pattern => userAgent.includes(pattern))) {
        suspicionScore += 40;
        reasons.push('Suspicious user agent detected');
      }

      // 2. Check for missing browser features
      if (!window.navigator.languages || window.navigator.languages.length === 0) {
        suspicionScore += 20;
        reasons.push('Missing language preferences');
      }

      if (!window.navigator.plugins || window.navigator.plugins.length === 0) {
        suspicionScore += 15;
        reasons.push('No browser plugins detected');
      }

      // 3. Webdriver detection - Enhanced
      if ((navigator as any).webdriver) {
        suspicionScore += 50;
        reasons.push('Webdriver property detected');
      }

      // Check for webdriver in multiple locations
      if (window.document.documentElement.getAttribute('webdriver')) {
        suspicionScore += 50;
        reasons.push('Webdriver attribute detected');
      }

      // 4. Check for automation frameworks
      const automationChecks = [
        ['callPhantom', '_phantom'],
        ['Buffer'],
        ['__webdriver_script_fn', '__selenium_unwrapped', '__fxdriver_unwrapped'],
        ['_Selenium_IDE_Recorder', 'callSelenium', '_selenium', 'calledSelenium'],
        ['__playwright', '__puppeteer_evaluation_script__'],
        ['nightmare'],
        ['spawn', 'emit'] // Node.js indicators
      ];

      automationChecks.forEach(([...indicators]) => {
        indicators.forEach(indicator => {
          if ((window as any)[indicator]) {
            suspicionScore += 30;
            reasons.push(`Automation framework detected: ${indicator}`);
          }
        });
      });

      // 5. Canvas fingerprinting - Enhanced
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.textBaseline = 'top';
          ctx.font = '14px Arial';
          ctx.fillText('Bot detection test 🤖 🔒', 2, 2);
          ctx.fillStyle = '#ff0000';
          ctx.fillRect(100, 5, 50, 20);
          const fingerprint = canvas.toDataURL();
          
          // Check for common bot canvas signatures
          const suspiciousPatterns = [
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAAUCAYAAAA'
          ];
          
          if (suspiciousPatterns.some(pattern => fingerprint.includes(pattern))) {
            suspicionScore += 25;
            reasons.push('Suspicious canvas fingerprint');
          }

          // Check canvas dimensions (bots often use default)
          if (canvas.width === 300 && canvas.height === 150) {
            suspicionScore += 10;
            reasons.push('Default canvas dimensions');
          }
        }
      } catch (e) {
        suspicionScore += 15;
        reasons.push('Canvas access blocked or failed');
      }

      // 6. WebGL fingerprinting - Enhanced
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext;
        if (gl) {
          const renderer = gl.getParameter(gl.RENDERER);
          const vendor = gl.getParameter(gl.VENDOR);
          
          if (renderer && vendor) {
            const combined = (renderer + vendor).toLowerCase();
            const vmPatterns = [
              'virtualbox', 'vmware', 'parallels', 'xen', 'qemu',
              'mesa', 'llvmpipe', 'swiftshader', 'angle'
            ];
            
            if (vmPatterns.some(pattern => combined.includes(pattern))) {
              suspicionScore += 30;
              reasons.push('Virtual machine or headless environment detected');
            }
          }

          // Check for WebGL extensions (bots often have limited extensions)
          const extensions = gl.getSupportedExtensions();
          if (!extensions || extensions.length < 10) {
            suspicionScore += 15;
            reasons.push('Limited WebGL extensions');
          }
        }
      } catch (e) {
        suspicionScore += 10;
        reasons.push('WebGL unavailable or blocked');
      }

      // 7. Screen and viewport analysis
      const screenAnalysis = () => {
        // Check for common bot screen sizes
        const commonBotSizes = [
          [1024, 768], [1280, 1024], [1366, 768], [800, 600]
        ];
        
        const currentSize = [screen.width, screen.height];
        if (commonBotSizes.some(([w, h]) => w === currentSize[0] && h === currentSize[1])) {
          suspicionScore += 10;
          reasons.push('Common bot screen resolution');
        }

        // Check color depth (bots often report 24)
        if (screen.colorDepth === 24 && screen.pixelDepth === 24) {
          suspicionScore += 5;
          reasons.push('Suspicious color depth');
        }

        // Check for inconsistent viewport
        if (window.innerWidth > screen.width || window.innerHeight > screen.height) {
          suspicionScore += 20;
          reasons.push('Viewport larger than screen');
        }
      };
      screenAnalysis();

      // 8. Mouse movement analysis - Enhanced
      let mouseEvents = 0;
      let naturalMovement = false;
      let mousePositions: Array<{x: number, y: number, time: number}> = [];
      
      const trackMouse = (e: MouseEvent) => {
        mouseEvents++;
        mousePositions.push({x: e.clientX, y: e.clientY, time: Date.now()});
        
        // Check for natural movement patterns
        if (mousePositions.length > 3) {
          const recent = mousePositions.slice(-3);
          const distances = recent.map((pos, i) => {
            if (i === 0) return 0;
            const prev = recent[i-1];
            return Math.sqrt(Math.pow(pos.x - prev.x, 2) + Math.pow(pos.y - prev.y, 2));
          });
          
          // Natural movement has variation in speed and direction
          const avgDistance = distances.reduce((a, b) => a + b, 0) / distances.length;
          if (avgDistance > 5 && avgDistance < 200 && e.isTrusted) {
            naturalMovement = true;
          }
        }
      };
      
      document.addEventListener('mousemove', trackMouse);
      
      // Wait for mouse activity
      await new Promise(resolve => setTimeout(resolve, 3000));
      document.removeEventListener('mousemove', trackMouse);
      
      if (!naturalMovement && mouseEvents < 5) {
        suspicionScore += 25;
        reasons.push('No natural mouse movement detected');
      }

      // 9. Timing analysis - Enhanced
      const performanceTests = async () => {
        // Test setTimeout precision
        const start = performance.now();
        await new Promise(resolve => setTimeout(resolve, 100));
        const end = performance.now();
        const timingAccuracy = end - start;
        
        // Bots often have perfect timing
        if (Math.abs(timingAccuracy - 100) < 2) {
          suspicionScore += 20;
          reasons.push('Perfect timing indicates automation');
        }

        // Test requestAnimationFrame
        let frameCount = 0;
        const countFrames = () => {
          frameCount++;
          if (frameCount < 10) {
            requestAnimationFrame(countFrames);
          }
        };
        requestAnimationFrame(countFrames);
        
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Real browsers should have some frames
        if (frameCount < 3) {
          suspicionScore += 15;
          reasons.push('No animation frames detected');
        }
      };
      
      await performanceTests();

      // 10. Advanced feature detection
      const advancedFeatureTests = () => {
        // Check for touch support inconsistencies
        const hasTouch = 'ontouchstart' in window;
        const maxTouchPoints = navigator.maxTouchPoints || 0;
        
        if (hasTouch && maxTouchPoints === 0) {
          suspicionScore += 10;
          reasons.push('Touch support inconsistency');
        }

        // Check for battery API (often missing in headless)
        if (!('getBattery' in navigator)) {
          suspicionScore += 5;
          reasons.push('Battery API missing');
        }

        // Check for device memory
        if (!('deviceMemory' in navigator)) {
          suspicionScore += 5;
          reasons.push('Device memory API missing');
        }

        // Check for connection API
        if (!('connection' in navigator)) {
          suspicionScore += 5;
          reasons.push('Network information API missing');
        }

        // Check for permissions API
        if (!('permissions' in navigator)) {
          suspicionScore += 5;
          reasons.push('Permissions API missing');
        }
      };
      advancedFeatureTests();

      // 11. Check for common bot properties
      const botPropertyChecks = () => {
        // Check window properties that bots often modify
        const suspiciousProps = [
          '_phantom', '__nightmare', 'callPhantom', '_selenium',
          'cdc_adoQpoasnfa76pfcZLmcfl_Array', 'cdc_adoQpoasnfa76pfcZLmcfl_Promise',
          'webdriver', '__webdriver_script_fn', '__driver_evaluate'
        ];

        suspiciousProps.forEach(prop => {
          if ((window as any)[prop]) {
            suspicionScore += 35;
            reasons.push(`Bot property detected: ${prop}`);
          }
        });

        // Check for Chrome headless specific properties
        if (userAgent.includes('headlesschrome') || (userAgent.includes('chrome') && !(window as any).chrome)) {
          suspicionScore += 30;
          reasons.push('Headless Chrome detected');
        }
      };
      botPropertyChecks();

      // 12. Hardware concurrency check
      if (navigator.hardwareConcurrency) {
        // Most real devices have 2-16 cores, VMs often have 1 or odd numbers
        const cores = navigator.hardwareConcurrency;
        if (cores === 1 || cores > 32) {
          suspicionScore += 10;
          reasons.push('Suspicious hardware concurrency');
        }
      }

      return {
        isBot: suspicionScore > 50,
        confidence: Math.min(suspicionScore, 100),
        reasons
      };
    };

    detectBot().then(setResult);
  }, []);

  return result;
}

export function AdvancedBotDetector({ onBotDetected }: { onBotDetected: (result: BotDetectionResult) => void }) {
  const detection = useAdvancedBotDetection();

  useEffect(() => {
    if (detection.isBot && detection.confidence > 50) {
      onBotDetected(detection);
    }
  }, [detection, onBotDetected]);

  return null;
}

// Behavioral tracking hook - optimized to prevent infinite re-renders
export function useBehavioralTracking() {
  const [behaviorData, setBehaviorData] = useState({
    mouseMovements: 0,
    keystrokes: 0,
    focusEvents: 0,
    scrollEvents: 0,
    clickEvents: 0,
    interactionScore: 0,
    suspiciousPatterns: [] as string[]
  });

  useEffect(() => {
    let startTime = Date.now();
    let lastMouseTime = 0;
    let mousePositions: Array<{x: number, y: number, time: number}> = [];
    let keystrokePattern: number[] = [];
    
    // Use refs to avoid frequent state updates
    let currentData = {
      mouseMovements: 0,
      keystrokes: 0,
      focusEvents: 0,
      scrollEvents: 0,
      clickEvents: 0,
      suspiciousPatterns: [] as string[]
    };
    
    const trackMouse = (e: MouseEvent) => {
      if (!e.isTrusted) return;
      
      const now = Date.now();
      mousePositions.push({x: e.clientX, y: e.clientY, time: now});
      
      // Keep only recent positions
      if (mousePositions.length > 50) {
        mousePositions = mousePositions.slice(-50);
      }
      
      currentData.mouseMovements++;
      
      // Check for suspicious mouse patterns (less frequently)
      if (mousePositions.length > 10 && mousePositions.length % 10 === 0) {
        const recent = mousePositions.slice(-10);
        const speeds = recent.map((pos, i) => {
          if (i === 0) return 0;
          const prev = recent[i-1];
          const distance = Math.sqrt(Math.pow(pos.x - prev.x, 2) + Math.pow(pos.y - prev.y, 2));
          const time = pos.time - prev.time;
          return time > 0 ? distance / time : 0;
        });
        
        // Check for perfectly consistent speeds (bot-like)
        const avgSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length;
        const speedVariation = speeds.reduce((acc, speed) => acc + Math.abs(speed - avgSpeed), 0) / speeds.length;
        
        if (speedVariation < 0.1 && speeds.length > 5) {
          if (!currentData.suspiciousPatterns.includes('consistent_mouse_speed')) {
            currentData.suspiciousPatterns = [...currentData.suspiciousPatterns, 'consistent_mouse_speed'];
          }
        }
        
        // Check for linear movements (bot-like)
        if (recent.length > 5) {
          const isLinear = recent.every((pos, i) => {
            if (i < 2) return true;
            const prev = recent[i-1];
            const prevPrev = recent[i-2];
            const angle1 = Math.atan2(pos.y - prev.y, pos.x - prev.x);
            const angle2 = Math.atan2(prev.y - prevPrev.y, prev.x - prevPrev.x);
            return Math.abs(angle1 - angle2) < 0.1;
          });
          
          if (isLinear && !currentData.suspiciousPatterns.includes('linear_mouse_movement')) {
            currentData.suspiciousPatterns = [...currentData.suspiciousPatterns, 'linear_mouse_movement'];
          }
        }
      }
      
      lastMouseTime = now;
    };

    const trackKeyboard = (e: KeyboardEvent) => {
      if (!e.isTrusted) return;
      
      const now = Date.now();
      keystrokePattern.push(now);
      
      // Keep only recent keystrokes
      if (keystrokePattern.length > 20) {
        keystrokePattern = keystrokePattern.slice(-20);
      }
      
      currentData.keystrokes++;
      
      // Check for suspicious keystroke patterns (less frequently)
      if (keystrokePattern.length > 5 && keystrokePattern.length % 5 === 0) {
        const intervals = keystrokePattern.map((time, i) => {
          if (i === 0) return 0;
          return time - keystrokePattern[i-1];
        }).slice(1);
        
        // Check for perfectly consistent timing (bot-like)
        const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const intervalVariation = intervals.reduce((acc, interval) => acc + Math.abs(interval - avgInterval), 0) / intervals.length;
        
        if (intervalVariation < 10 && intervals.length > 3) {
          if (!currentData.suspiciousPatterns.includes('consistent_keystroke_timing')) {
            currentData.suspiciousPatterns = [...currentData.suspiciousPatterns, 'consistent_keystroke_timing'];
          }
        }
        
        // Check for too fast typing (bot-like)
        if (avgInterval < 50 && intervals.length > 5) {
          if (!currentData.suspiciousPatterns.includes('inhuman_typing_speed')) {
            currentData.suspiciousPatterns = [...currentData.suspiciousPatterns, 'inhuman_typing_speed'];
          }
        }
      }
    };

    const trackFocus = () => {
      currentData.focusEvents++;
    };

    const trackScroll = (e: Event) => {
      if (!e.isTrusted) return;
      currentData.scrollEvents++;
    };

    const trackClick = (e: MouseEvent) => {
      if (!e.isTrusted) return;
      currentData.clickEvents++;
    };

    // Add event listeners
    document.addEventListener('mousemove', trackMouse, { passive: true });
    document.addEventListener('keydown', trackKeyboard, { passive: true });
    window.addEventListener('focus', trackFocus, { passive: true });
    window.addEventListener('scroll', trackScroll, { passive: true });
    document.addEventListener('click', trackClick, { passive: true });

    // Update state less frequently to prevent re-renders
    const scoreInterval = setInterval(() => {
      const timeOnPage = (Date.now() - startTime) / 1000;
      const score = (currentData.mouseMovements * 2 + currentData.keystrokes * 3 + currentData.focusEvents + currentData.scrollEvents + currentData.clickEvents * 2) / Math.max(timeOnPage, 1);
      
      setBehaviorData(prev => {
        // Only update if there are significant changes
        const hasChanged = 
          prev.mouseMovements !== currentData.mouseMovements ||
          prev.keystrokes !== currentData.keystrokes ||
          prev.focusEvents !== currentData.focusEvents ||
          prev.scrollEvents !== currentData.scrollEvents ||
          prev.clickEvents !== currentData.clickEvents ||
          prev.suspiciousPatterns.length !== currentData.suspiciousPatterns.length;
          
        if (hasChanged) {
          return {
            ...currentData,
            interactionScore: score
          };
        }
        return prev;
      });
    }, 5000); // Reduced frequency to 5 seconds

    return () => {
      document.removeEventListener('mousemove', trackMouse);
      document.removeEventListener('keydown', trackKeyboard);
      window.removeEventListener('focus', trackFocus);
      window.removeEventListener('scroll', trackScroll);
      document.removeEventListener('click', trackClick);
      clearInterval(scoreInterval);
    };
  }, []); // Empty dependency array to prevent re-runs

  return behaviorData;
}
