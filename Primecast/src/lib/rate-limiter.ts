// Global Rate Limiting System for Bot Protection
// This provides client-side and server-side rate limiting capabilities

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  blockDuration: number;
  strictMode?: boolean;
}

interface RateLimitEntry {
  count: number;
  windowStart: number;
  blocked: boolean;
  blockedUntil?: number;
  violations: number;
  lastViolation?: number;
}

class GlobalRateLimiter {
  private limits = new Map<string, RateLimitEntry>();
  private config: RateLimitConfig;
  
  constructor(config: RateLimitConfig) {
    this.config = config;
    
    // Cleanup old entries every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }
  
  // Check if request should be allowed
  checkLimit(identifier: string, endpoint?: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const entry = this.limits.get(identifier) || {
      count: 0,
      windowStart: now,
      blocked: false,
      violations: 0
    };
    
    // Check if currently blocked
    if (entry.blocked && entry.blockedUntil && now < entry.blockedUntil) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.blockedUntil
      };
    }
    
    // Remove block if expired
    if (entry.blocked && entry.blockedUntil && now >= entry.blockedUntil) {
      entry.blocked = false;
      entry.blockedUntil = undefined;
      entry.count = 0;
      entry.windowStart = now;
    }
    
    // Reset window if expired
    if (now - entry.windowStart >= this.config.windowMs) {
      entry.count = 0;
      entry.windowStart = now;
    }
    
    // Increment counter
    entry.count++;
    
    // Check if limit exceeded
    if (entry.count > this.config.maxRequests) {
      entry.violations++;
      entry.lastViolation = now;
      
      // Progressive blocking based on violations
      let blockDuration = this.config.blockDuration;
      if (entry.violations >= 5) {
        blockDuration = 24 * 60 * 60 * 1000; // 24 hours for repeat offenders
      } else if (entry.violations >= 3) {
        blockDuration = 4 * 60 * 60 * 1000; // 4 hours
      } else if (entry.violations >= 2) {
        blockDuration = 60 * 60 * 1000; // 1 hour
      }
      
      entry.blocked = true;
      entry.blockedUntil = now + blockDuration;
      
      this.limits.set(identifier, entry);
      
      console.log(`🚫 Rate limit exceeded for ${identifier}: ${entry.count} requests in window, blocked for ${blockDuration/1000/60} minutes`);
      
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.blockedUntil
      };
    }
    
    this.limits.set(identifier, entry);
    
    return {
      allowed: true,
      remaining: Math.max(0, this.config.maxRequests - entry.count),
      resetTime: entry.windowStart + this.config.windowMs
    };
  }
  
  // Get current status for an identifier
  getStatus(identifier: string) {
    const entry = this.limits.get(identifier);
    if (!entry) return null;
    
    return {
      count: entry.count,
      blocked: entry.blocked,
      blockedUntil: entry.blockedUntil,
      violations: entry.violations,
      windowStart: entry.windowStart
    };
  }
  
  // Manually block an identifier
  block(identifier: string, duration?: number) {
    const blockDuration = duration || this.config.blockDuration;
    const now = Date.now();
    
    const entry = this.limits.get(identifier) || {
      count: 0,
      windowStart: now,
      blocked: false,
      violations: 0
    };
    
    entry.blocked = true;
    entry.blockedUntil = now + blockDuration;
    entry.violations++;
    
    this.limits.set(identifier, entry);
    
    console.log(`🔒 Manually blocked ${identifier} for ${blockDuration/1000/60} minutes`);
  }
  
  // Remove block for an identifier
  unblock(identifier: string) {
    const entry = this.limits.get(identifier);
    if (entry) {
      entry.blocked = false;
      entry.blockedUntil = undefined;
      this.limits.set(identifier, entry);
      console.log(`🔓 Unblocked ${identifier}`);
    }
  }
  
  // Clean up old entries
  private cleanup() {
    const now = Date.now();
    const oldEntries: string[] = [];
    
    for (const [identifier, entry] of this.limits.entries()) {
      // Remove entries older than 1 hour that aren't blocked
      if (!entry.blocked && (now - entry.windowStart) > 60 * 60 * 1000) {
        oldEntries.push(identifier);
      }
      // Remove expired blocks
      else if (entry.blocked && entry.blockedUntil && now >= entry.blockedUntil) {
        entry.blocked = false;
        entry.blockedUntil = undefined;
        entry.count = 0;
        entry.windowStart = now;
      }
    }
    
    oldEntries.forEach(id => this.limits.delete(id));
    
    if (oldEntries.length > 0) {
      console.log(`🧹 Cleaned up ${oldEntries.length} old rate limit entries`);
    }
  }
  
  // Get statistics
  getStats() {
    const blocked = Array.from(this.limits.values()).filter(entry => entry.blocked).length;
    const active = this.limits.size;
    const violations = Array.from(this.limits.values()).reduce((sum, entry) => sum + entry.violations, 0);
    
    return {
      activeEntries: active,
      blockedEntries: blocked,
      totalViolations: violations
    };
  }
}

// Pre-configured rate limiters for different use cases
export const globalRateLimiters = {
  // General site access
  general: new GlobalRateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30, // 30 requests per minute for normal users
    blockDuration: 5 * 60 * 1000, // 5 minute block
    strictMode: false
  }),
  
  // API endpoints
  api: new GlobalRateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10, // 10 API calls per minute
    blockDuration: 15 * 60 * 1000, // 15 minute block
    strictMode: true
  }),
  
  // Critical pages (subscribe, admin, etc.)
  critical: new GlobalRateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 5, // Only 5 requests per minute to critical pages
    blockDuration: 30 * 60 * 1000, // 30 minute block
    strictMode: true
  }),
  
  // Form submissions
  forms: new GlobalRateLimiter({
    windowMs: 5 * 60 * 1000, // 5 minutes
    maxRequests: 3, // Only 3 form submissions per 5 minutes
    blockDuration: 60 * 60 * 1000, // 1 hour block
    strictMode: true
  }),
  
  // Facebook Conversions API
  conversions: new GlobalRateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 20, // 20 conversion events per minute
    blockDuration: 10 * 60 * 1000, // 10 minute block
    strictMode: false
  })
};

// Client-side rate limiting for browser environments
export class ClientRateLimiter {
  private static instance: ClientRateLimiter;
  private limits = new Map<string, { count: number; windowStart: number; blocked: boolean; blockedUntil?: number }>();
  
  static getInstance(): ClientRateLimiter {
    if (!ClientRateLimiter.instance) {
      ClientRateLimiter.instance = new ClientRateLimiter();
    }
    return ClientRateLimiter.instance;
  }
  
  // Check client-side rate limit
  checkClientLimit(action: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
    if (typeof window === 'undefined') return true; // Server-side always allows
    
    const now = Date.now();
    const entry = this.limits.get(action) || { count: 0, windowStart: now, blocked: false };
    
    // Check if currently blocked
    if (entry.blocked && entry.blockedUntil && now < entry.blockedUntil) {
      console.warn(`🚫 Client-side rate limit: ${action} is blocked until ${new Date(entry.blockedUntil).toLocaleTimeString()}`);
      return false;
    }
    
    // Reset window if expired
    if (now - entry.windowStart >= windowMs) {
      entry.count = 0;
      entry.windowStart = now;
      entry.blocked = false;
      entry.blockedUntil = undefined;
    }
    
    // Increment counter
    entry.count++;
    
    // Check limit
    if (entry.count > maxRequests) {
      entry.blocked = true;
      entry.blockedUntil = now + (windowMs * 2); // Block for twice the window duration
      this.limits.set(action, entry);
      
      console.warn(`🚫 Client-side rate limit exceeded for ${action}: ${entry.count}/${maxRequests} in ${windowMs/1000}s`);
      return false;
    }
    
    this.limits.set(action, entry);
    return true;
  }
  
  // Get remaining requests for an action
  getRemaining(action: string, maxRequests: number = 10): number {
    const entry = this.limits.get(action);
    if (!entry) return maxRequests;
    return Math.max(0, maxRequests - entry.count);
  }
}

// Utility functions for common rate limiting scenarios
export function createRateLimitHeaders(remaining: number, resetTime: number, limit: number) {
  return {
    'X-RateLimit-Limit': limit.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(resetTime / 1000).toString(),
    'Retry-After': Math.ceil((resetTime - Date.now()) / 1000).toString()
  };
}

// Bot detection rate limiting - much stricter
export function getBotRateLimit(suspiciousScore: number): { maxRequests: number; blockDuration: number } {
  if (suspiciousScore >= 80) {
    return { maxRequests: 1, blockDuration: 24 * 60 * 60 * 1000 }; // 1 request, 24h block
  } else if (suspiciousScore >= 60) {
    return { maxRequests: 2, blockDuration: 4 * 60 * 60 * 1000 }; // 2 requests, 4h block
  } else if (suspiciousScore >= 40) {
    return { maxRequests: 3, blockDuration: 60 * 60 * 1000 }; // 3 requests, 1h block
  } else if (suspiciousScore >= 20) {
    return { maxRequests: 5, blockDuration: 30 * 60 * 1000 }; // 5 requests, 30min block
  } else {
    return { maxRequests: 10, blockDuration: 5 * 60 * 1000 }; // 10 requests, 5min block
  }
}

export default GlobalRateLimiter;
