// Facebook Conversions API utility functions with rate limiting

import { ClientRateLimiter, globalRateLimiters } from './rate-limiter';

interface UserData {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  clientIp?: string;
  userAgent?: string;
}

interface EventData {
  source_url?: string;
  event_id?: string;
  custom_data?: {
    currency?: string;
    value?: string;
    content_name?: string;
    content_category?: string;
  };
}

// Helper function to generate UUID (since crypto.randomUUID might not be available in all browsers)
export function generateEventId(): string {
  return 'xxxx-xxxx-4xxx-yxxx-xxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export async function sendConversionEvent(
  eventName: string,
  userData: UserData,
  eventData: EventData = {}
): Promise<{ success: boolean; error?: any; result?: any; eventId?: string }> {
  try {
    // Client-side rate limiting to prevent abuse
    const clientLimiter = ClientRateLimiter.getInstance();
    if (!clientLimiter.checkClientLimit('facebook-conversion', 20, 60000)) {
      console.warn('Facebook conversion rate limited on client side');
      return { 
        success: false, 
        error: 'Rate limited - too many conversion events',
        eventId: eventData.event_id || generateEventId()
      };
    }

    // Skip conversion API in localhost/development
    if (typeof window !== 'undefined' && 
        (window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1' ||
         window.location.hostname.includes('localhost'))) {
      console.log('Skipping conversion event in localhost:', { eventName, userData, eventData });
      return { success: true, result: { message: 'Skipped in localhost' }, eventId: eventData.event_id || generateEventId() };
    }

    // Bot detection for conversion events
    const userAgent = userData.userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : '');
    const suspiciousBotPatterns = [
      'bot', 'crawler', 'spider', 'scraper', 'curl', 'wget', 'python',
      'selenium', 'puppeteer', 'headless', 'phantom', 'automation'
    ];
    
    const isSuspiciousBot = suspiciousBotPatterns.some(pattern => 
      userAgent.toLowerCase().includes(pattern.toLowerCase())
    );
    
    if (isSuspiciousBot) {
      console.warn('Blocking conversion event from suspicious bot:', userAgent);
      return { 
        success: false, 
        error: 'Bot traffic detected',
        eventId: eventData.event_id || generateEventId()
      };
    }

    // Get client info if not provided
    if (!eventData.source_url && typeof window !== 'undefined') {
      eventData.source_url = window.location.href;
    }

    if (!userData.userAgent && typeof navigator !== 'undefined') {
      userData.userAgent = navigator.userAgent;
    }

    // Generate event ID if not provided
    if (!eventData.event_id) {
      eventData.event_id = generateEventId();
    }

    console.log('Sending conversion event:', { eventName, userData, eventData });

    // Use Netlify Function endpoint
    const response = await fetch('/.netlify/functions/facebook-conversions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventName,
        userData,
        eventData,
      }),
    });

    if (!response.ok) {
      // Check if response is HTML (404 page) instead of JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        const htmlText = await response.text();
        console.error('Received HTML instead of JSON (likely 404):', htmlText.substring(0, 200));
        return { success: false, error: 'Netlify function not found or not deployed' };
      }
      
      try {
        const error = await response.json();
        console.error('Failed to send conversion event:', error);
        return { success: false, error };
      } catch (jsonError) {
        console.error('Failed to parse error response as JSON:', jsonError);
        return { success: false, error: 'Invalid response format' };
      }
    }

    const result = await response.json();
    console.log('Conversion event sent successfully:', result);
    return { success: true, result, eventId: result.eventId };
  } catch (error) {
    console.error('Error sending conversion event:', error);
    return { success: false, error };
  }
}

// Send PageView event for better attribution
export async function sendPageViewEvent(): Promise<void> {
  if (typeof window === 'undefined') return;
  
  try {
    // Get client IP address for better matching - try multiple services
    let clientIp = '';
    try {
      // Try ipify first
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      if (ipResponse.ok) {
        const ipData = await ipResponse.json();
        clientIp = ipData.ip;
      }
    } catch (error) {
      // Try backup IP service
      try {
        const ipResponse2 = await fetch('https://httpbin.org/ip');
        if (ipResponse2.ok) {
          const ipData2 = await ipResponse2.json();
          clientIp = ipData2.origin;
        }
      } catch (error2) {
        console.warn('Could not fetch IP address for PageView:', error2);
      }
    }
    
    // Only send PageView if we have IP address
    if (clientIp) {
      await sendConversionEvent('PageView', {
        userAgent: navigator.userAgent,
        clientIp: clientIp,
      }, {
        source_url: window.location.href,
        event_id: generateEventId(),
      });
    } else {
      console.warn('Skipping PageView event - no IP address available');
    }
  } catch (error) {
    console.warn('Failed to send PageView event:', error);
  }
}
