import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// IMMEDIATE BLOCKING: Reject Netlify subdomain requests before any processing
export function middleware(request: NextRequest) {
  const hostname = request.nextUrl.hostname;
  
  // Block Netlify subdomain immediately - no content processing at all
  if (hostname === 'primecast.netlify.app' || hostname.includes('netlify.app')) {
    console.log(`🚫 BLOCKED: Netlify subdomain access attempt from ${hostname}`);
    
    // Return empty response immediately
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
      <head>
        <title>Not Found</title>
        <meta name="robots" content="noindex, nofollow">
      </head>
      <body style="margin:0;padding:0;background:#fff;">
        <script>window.location.replace('https://primecastt.site');</script>
      </body>
      </html>`,
      {
        status: 404,
        headers: {
          'Content-Type': 'text/html',
          'X-Robots-Tag': 'noindex, nofollow',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      }
    );
  }

// Enhanced bot detection patterns
const BOT_USER_AGENTS = [
  'bot', 'crawler', 'spider', 'scraper', 'curl', 'wget', 'python', 'java',
  'semrushbot', 'ahrefsbot', 'mj12bot', 'dotbot', 'bingbot', 'googlebot',
  'facebookexternalhit', 'twitterbot', 'headless', 'phantom', 'selenium',
  'puppeteer', 'playwright', 'nightmare', 'zombie', 'jsdom', 'node',
  'go-http', 'okhttp', 'apache-httpclient', 'libcurl', 'mechanize',
  'postman', 'insomnia', 'httpie', 'requests', 'urllib', 'aiohttp',
  'httpx', 'axios', 'fetch', 'node-fetch', 'superagent', 'got',
  'request', 'restsharp', 'httpclient', 'okio', 'retrofit'
];

// Vulnerability scanning tools and security scanners
const VULNERABILITY_SCANNERS = [
  'nmap', 'nikto', 'sqlmap', 'burp', 'owasp', 'zap', 'nuclei',
  'masscan', 'nessus', 'openvas', 'acunetix', 'qualys', 'rapid7',
  'metasploit', 'dirbuster', 'gobuster', 'dirb', 'wfuzz', 'ffuf',
  'hydra', 'john', 'hashcat', 'aircrack', 'wireshark', 'tcpdump',
  'shodan', 'censys', 'maltego', 'recon-ng', 'amass', 'subfinder',
  'waybackurls', 'gau', 'hakrawler', 'paramspider', 'arjun',
  'commix', 'xsstrike', 'dalfox', 'gxss', 'kxss', 'reflected',
  'blind', 'stored', 'dom', 'payloadbox', 'seclist', 'fuzzdb'
];

// Penetration testing and reconnaissance tools
const PENTEST_TOOLS = [
  'kali', 'parrot', 'blackarch', 'pentoo', 'backtrack',
  'beef', 'maltego', 'sparta', 'armitage', 'cobalt',
  'empire', 'powersploit', 'mimikatz', 'bloodhound',
  'responder', 'impacket', 'crackmapexec', 'evil-winrm'
];

// Suspicious paths that indicate vulnerability scanning
const SUSPICIOUS_PATHS = [
  '/.env', '/.git', '/admin', '/wp-admin', '/phpmyadmin', '/administrator',
  '/login', '/signin', '/auth', '/api', '/graphql', '/swagger',
  '/robots.txt', '/sitemap.xml', '/.well-known', '/config',
  '/backup', '/db', '/database', '/sql', '/mysql', '/postgres',
  '/ftp', '/ssh', '/telnet', '/rdp', '/vnc', '/shell',
  '/cmd', '/console', '/terminal', '/exec', '/upload',
  '/test', '/debug', '/dev', '/staging', '/beta',
  '/xmlrpc.php', '/wp-config.php', '/web.config', '/.htaccess',
  '/crossdomain.xml', '/clientaccesspolicy.xml'
];

// Known malicious IP ranges and cloud providers often used for attacks
const SUSPICIOUS_IP_RANGES = [
  // Private networks
  '10.', '172.', '192.168.',
  // Common VPN/Cloud providers used for attacks
  '185.220.', '199.87.', '198.251.', '192.42.', '176.10.',
  '5.188.', '45.227.', '178.128.', '159.89.', '68.183.',
  // Tor exit nodes (common patterns)
  '199.87.', '192.42.', '176.10.', '185.220.'
];

// Country codes that often host malicious traffic
const HIGH_RISK_COUNTRIES = new Set([
  'CN', 'RU', 'KP', 'IR', 'PK', 'BD', 'VN', 'ID', 'IN', 'UA'
]);

// Enhanced tracking and blocking
const RATE_LIMIT = new Map<string, { count: number; timestamp: number; violations: number; blocked_until?: number }>();
const IP_TRACKING = new Map<string, { 
  requests: number; 
  pages: Set<string>; 
  timestamp: number;
  suspicious_score: number;
  user_agents: Set<string>;
  countries: Set<string>;
  suspicious_paths: Set<string>;
  scan_attempts: number;
  first_seen: number;
  last_activity: number;
  violation_history: string[];
}>();

// Permanent and temporary blocks
const BLOCKED_IPS = new Set<string>();
const BLOCKED_PATTERNS = new Set<string>();
const TEMP_BLOCKED = new Map<string, number>(); // IP -> unblock timestamp

// Security event logging
interface SecurityEvent {
  timestamp: number;
  ip: string;
  event_type: 'bot_detected' | 'scan_attempt' | 'rate_limit' | 'suspicious_path' | 'vulnerability_scan';
  details: string;
  user_agent: string;
  path: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

const SECURITY_LOG: SecurityEvent[] = [];

// Enhanced security event logging
function logSecurityEvent(event: SecurityEvent) {
  SECURITY_LOG.push(event);
  
  // Keep only last 1000 events to prevent memory bloat
  if (SECURITY_LOG.length > 1000) {
    SECURITY_LOG.splice(0, SECURITY_LOG.length - 1000);
  }
  
  // Log critical events to console for monitoring
  if (event.severity === 'critical' || event.severity === 'high') {
    console.warn(`🚨 SECURITY ALERT [${event.severity.toUpperCase()}]: ${event.event_type} from ${event.ip} - ${event.details}`);
  }
}

// Enhanced suspicious score calculation with vulnerability detection
function calculateSuspiciousScore(ip: string, userAgent: string, request: NextRequest): number {
  let score = 0;
  const path = request.nextUrl.pathname.toLowerCase();
  const query = request.nextUrl.search.toLowerCase();
  const fullUrl = path + query;
  
  // Check for vulnerability scanning tools in User-Agent
  const isVulnScanner = VULNERABILITY_SCANNERS.some(scanner => userAgent.includes(scanner));
  const isPentestTool = PENTEST_TOOLS.some(tool => userAgent.includes(tool));
  
  if (isVulnScanner || isPentestTool) {
    score += 95; // Almost certain block
    logSecurityEvent({
      timestamp: Date.now(),
      ip,
      event_type: 'vulnerability_scan',
      details: `Vulnerability scanner detected: ${userAgent}`,
      user_agent: userAgent,
      path,
      severity: 'critical'
    });
  }
  
  // Check for suspicious paths (vulnerability probing)
  const isSuspiciousPath = SUSPICIOUS_PATHS.some(suspPath => path.includes(suspPath));
  if (isSuspiciousPath) {
    score += 60;
    logSecurityEvent({
      timestamp: Date.now(),
      ip,
      event_type: 'scan_attempt',
      details: `Suspicious path accessed: ${path}`,
      user_agent: userAgent,
      path,
      severity: 'high'
    });
  }
  
  // Check for SQL injection patterns in URL
  const sqlPatterns = ['union', 'select', 'insert', 'update', 'delete', 'drop', 'create', 'alter', 'exec', 'script', 'javascript:', 'vbscript:', '<script', 'onload=', 'onerror='];
  if (sqlPatterns.some(pattern => fullUrl.includes(pattern))) {
    score += 80;
    logSecurityEvent({
      timestamp: Date.now(),
      ip,
      event_type: 'scan_attempt',
      details: `SQL injection pattern detected in URL: ${fullUrl}`,
      user_agent: userAgent,
      path,
      severity: 'critical'
    });
  }
  
  // Check for XSS patterns
  const xssPatterns = ['<script', 'javascript:', 'onload=', 'onerror=', 'alert(', 'prompt(', 'confirm('];
  if (xssPatterns.some(pattern => fullUrl.includes(pattern))) {
    score += 75;
    logSecurityEvent({
      timestamp: Date.now(),
      ip,
      event_type: 'scan_attempt',
      details: `XSS pattern detected: ${fullUrl}`,
      user_agent: userAgent,
      path,
      severity: 'high'
    });
  }
  
  // Check for directory traversal attempts
  if (fullUrl.includes('../') || fullUrl.includes('..\\') || fullUrl.includes('%2e%2e') || fullUrl.includes('....')) {
    score += 70;
    logSecurityEvent({
      timestamp: Date.now(),
      ip,
      event_type: 'scan_attempt',
      details: `Directory traversal attempt: ${fullUrl}`,
      user_agent: userAgent,
      path,
      severity: 'high'
    });
  }
  
  // Check user agent patterns - Block most bots but allow legitimate search engines
  const legitimateSearchEngines = ['googlebot', 'bingbot', 'slurp', 'duckduckbot', 'facebookexternalhit', 'twitterbot', 'linkedinbot'];
  const isLegitimateSearchEngine = legitimateSearchEngines.some(bot => userAgent.includes(bot));
  
  // Block all other bot patterns
  if (!isLegitimateSearchEngine && BOT_USER_AGENTS.some(bot => userAgent.includes(bot))) {
    score += 85; // High score to ensure blocking
    logSecurityEvent({
      timestamp: Date.now(),
      ip,
      event_type: 'bot_detected',
      details: `Bot user agent detected: ${userAgent}`,
      user_agent: userAgent,
      path,
      severity: 'medium'
    });
  }
  
  // Additional bot detection patterns
  const additionalBotPatterns = [
    'requests', 'urllib', 'httpx', 'aiohttp', 'fetch', 'axios',
    'test', 'automation', 'headless', 'phantom', 'selenium', 'webdriver'
  ];
  
  if (!isLegitimateSearchEngine && additionalBotPatterns.some(pattern => userAgent.includes(pattern))) {
    score += 80; // High score for obvious automation tools
  }
  
  // Check for missing common headers (bots often omit these)
  if (!request.headers.get('accept-language')) score += 25;
  if (!request.headers.get('accept-encoding')) score += 25;
  if (!request.headers.get('accept')) score += 30;
  if (!request.headers.get('referer') && request.nextUrl.pathname !== '/') score += 30;
  
  // Check for suspicious IP patterns
  if (SUSPICIOUS_IP_RANGES.some(pattern => ip.startsWith(pattern))) {
    score += 40;
  }
  
  // Check country risk
  const country = request.headers.get('cf-ipcountry');
  if (country && HIGH_RISK_COUNTRIES.has(country)) {
    score += 20;
  }
  
  // Check request frequency and patterns
  const tracking = IP_TRACKING.get(ip);
  if (tracking) {
    // Too many requests
    if (tracking.requests > 100) score += 40;
    else if (tracking.requests > 50) score += 25;
    
    // Multiple user agents (bot behavior)
    if (tracking.user_agents.size > 5) score += 30;
    else if (tracking.user_agents.size > 3) score += 20;
    
    // Rapid page access
    const timeSpan = Date.now() - tracking.timestamp;
    if (tracking.pages.size > 15 && timeSpan < 60000) score += 45; // 15+ pages in 1 minute
    else if (tracking.pages.size > 10 && timeSpan < 60000) score += 30; // 10+ pages in 1 minute
    
    // Multiple suspicious paths
    if (tracking.suspicious_paths.size > 3) score += 35;
    else if (tracking.suspicious_paths.size > 1) score += 20;
    
    // Scan attempts
    if (tracking.scan_attempts > 5) score += 50;
    else if (tracking.scan_attempts > 2) score += 30;
  }
  
  // Check for automation indicators in headers
  const automationHeaders = [
    'selenium', 'puppeteer', 'playwright', 'headless',
    'webdriver', 'automation', 'phantom', 'chrome-lighthouse'
  ];
  
  const allHeaders = Array.from(request.headers.entries()).join(' ').toLowerCase();
  if (automationHeaders.some(header => allHeaders.includes(header))) {
    score += 50;
  }
  
  // Check for suspicious header combinations
  const hasUserAgent = request.headers.get('user-agent');
  const hasAccept = request.headers.get('accept');
  
  if (!hasUserAgent || !hasAccept) score += 35;
  
  // Check for too generic or suspicious user agent
  if (hasUserAgent) {
    const ua = hasUserAgent.toLowerCase();
    if (ua.length < 15 || ua === 'mozilla/5.0') score += 25;
    
    // Check for version inconsistencies
    if (ua.includes('chrome') && !ua.includes('safari')) score += 20;
    if (ua.includes('firefox') && ua.includes('chrome')) score += 25;
    
    // Check for old/fake versions
    if (ua.includes('chrome/90') || ua.includes('chrome/80') || ua.includes('chrome/70')) score += 15;
  }
  
  // Check for unusual request methods
  if (!['GET', 'POST', 'HEAD', 'OPTIONS'].includes(request.method)) {
    score += 30;
  }
  
  // Check for suspicious query parameters
  const suspiciousParams = ['cmd=', 'exec=', 'shell=', 'system=', 'passthru=', 'eval=', 'base64_decode='];
  if (suspiciousParams.some(param => query.includes(param))) {
    score += 60;
  }
  
  return Math.min(score, 100); // Cap at 100
}

// Enhanced IP blocking with temporary and permanent blocks
function isIPBlocked(ip: string): boolean {
  // Check permanent blocks
  if (BLOCKED_IPS.has(ip)) return true;
  
  // Check temporary blocks
  const tempBlockUntil = TEMP_BLOCKED.get(ip);
  if (tempBlockUntil && Date.now() < tempBlockUntil) {
    return true;
  } else if (tempBlockUntil) {
    // Remove expired temporary block
    TEMP_BLOCKED.delete(ip);
  }
  
  // Check patterns
  for (const pattern of BLOCKED_PATTERNS) {
    if (ip.startsWith(pattern)) return true;
  }
  
  return false;
}

// Add IP to temporary block list
function addTempBlock(ip: string, minutes: number = 60) {
  const unblockTime = Date.now() + (minutes * 60 * 1000);
  TEMP_BLOCKED.set(ip, unblockTime);
  
  logSecurityEvent({
    timestamp: Date.now(),
    ip,
    event_type: 'rate_limit',
    details: `IP temporarily blocked for ${minutes} minutes`,
    user_agent: '',
    path: '',
    severity: 'medium'
  });
}

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
           request.headers.get('x-real-ip') || 
           request.headers.get('cf-connecting-ip') || 
           request.headers.get('x-client-ip') ||
           'unknown';
  const pathname = request.nextUrl.pathname;
  const now = Date.now();
  
  // Enhanced logging for monitoring
  console.log(`🔍 MIDDLEWARE: ${pathname} - IP: ${ip} - UA: ${userAgent.substring(0, 50)}...`);
  
  // Immediate block for known bad IPs
  if (isIPBlocked(ip)) {
    console.log(`🚫 BLOCKED IP: ${ip}`);
    return new NextResponse('Access Denied - IP Blocked', { status: 403 });
  }
  
  // Quick check for obvious vulnerability scanners before expensive scoring
  const quickBotCheck = VULNERABILITY_SCANNERS.some(scanner => userAgent.includes(scanner)) ||
                       PENTEST_TOOLS.some(tool => userAgent.includes(tool));
  
  if (quickBotCheck) {
    console.log(`🚨 VULNERABILITY SCANNER DETECTED: ${ip} - ${userAgent}`);
    BLOCKED_IPS.add(ip); // Permanent block for scanners
    return new NextResponse('Access Denied - Security Scanner Detected', { status: 403 });
  }
  
  // Calculate comprehensive suspicious score
  const suspiciousScore = calculateSuspiciousScore(ip, userAgent, request);
  console.log(`🎯 SUSPICION SCORE: ${suspiciousScore} for ${ip}`);
  
  // Progressive blocking based on suspicion level
  if (suspiciousScore >= 90) {
    console.log(`🚫 CRITICAL THREAT BLOCKED: ${ip} (score: ${suspiciousScore})`);
    BLOCKED_IPS.add(ip); // Permanent block for critical threats
    return new NextResponse('Access Denied - Critical Security Threat', { status: 403 });
  }
  
  if (suspiciousScore >= 70) {
    console.log(`🚫 HIGH THREAT BLOCKED: ${ip} (score: ${suspiciousScore})`);
    addTempBlock(ip, 120); // 2 hour temporary block
    return new NextResponse('Access Denied - High Security Risk', { status: 403 });
  }
  
  if (suspiciousScore >= 50) {
    console.log(`⚠️ MEDIUM THREAT BLOCKED: ${ip} (score: ${suspiciousScore})`);
    addTempBlock(ip, 30); // 30 minute temporary block
    return new NextResponse('Access Denied - Security Risk Detected', { status: 429 });
  }
  
  // ULTRA-AGGRESSIVE rate limiting specifically targeting bots across ALL pages
  const windowMs = 60 * 1000; // 1 minute window
  let maxRequests = 12; // Even stricter base limit
  
  // Check if this is definitely a bot based on user agent patterns
  const isDefiniteBot = BOT_USER_AGENTS.some(bot => userAgent.includes(bot)) && 
                       !['googlebot', 'bingbot', 'slurp', 'duckduckbot', 'facebookexternalhit', 'twitterbot', 'linkedinbot'].some(legitimate => userAgent.includes(legitimate));
  
  // ZERO tolerance for confirmed bots - immediate blocking
  if (isDefiniteBot) {
    console.log(`🚫 CONFIRMED BOT BLOCKED IMMEDIATELY: ${ip} - ${userAgent}`);
    BLOCKED_IPS.add(ip); // Permanent block for confirmed bots
    return new NextResponse('Access Denied - Bot Traffic Not Allowed', { status: 403 });
  }
  
  // Extremely aggressive limits based on suspicion level FOR ALL PAGES
  if (suspiciousScore >= 40) maxRequests = 1; // Almost complete lockdown
  else if (suspiciousScore >= 30) maxRequests = 2; // Extreme restriction
  else if (suspiciousScore >= 20) maxRequests = 3; // Very strict
  else if (suspiciousScore >= 15) maxRequests = 5; // Strict
  else if (suspiciousScore >= 10) maxRequests = 8; // Moderate restriction
  
  // Apply even stricter limits across ALL page types based on bot indicators
  const existingTracking = IP_TRACKING.get(ip);
  if (existingTracking) {
    // If multiple user agents detected (bot behavior) - ultra strict on ALL pages
    if (existingTracking.user_agents.size > 3) maxRequests = Math.min(maxRequests, 2);
    
    // If rapid page access detected - strict on ALL pages
    const timeSpan = Date.now() - existingTracking.timestamp;
    if (existingTracking.pages.size > 8 && timeSpan < 60000) maxRequests = Math.min(maxRequests, 1);
    
    // If any scan attempts - zero tolerance on ALL pages
    if (existingTracking.scan_attempts > 0) maxRequests = 1;
  }
  
  // Special handling for different page types with bot-focused restrictions
  if (pathname === '/subscribe' || pathname === '/admin' || pathname.startsWith('/api/')) {
    // Critical pages: Even stricter for any suspicion
    if (suspiciousScore >= 20) maxRequests = 1; // Zero tolerance
    else if (suspiciousScore >= 10) maxRequests = 2;
    else maxRequests = Math.min(maxRequests, 5);
  } else if (pathname.startsWith('/blog/') || pathname === '/' || pathname === '/channels') {
    // Content pages: Moderate restrictions but still strict for bots
    if (suspiciousScore >= 30) maxRequests = 2;
    else if (suspiciousScore >= 20) maxRequests = 3;
    else if (suspiciousScore >= 10) maxRequests = 6;
  } else {
    // All other pages: Apply bot-focused restrictions
    if (suspiciousScore >= 25) maxRequests = Math.min(maxRequests, 2);
    else if (suspiciousScore >= 15) maxRequests = Math.min(maxRequests, 4);
  }
  
  // Additional aggressive bot detection for ALL pages
  const additionalBotIndicators = [
    // Automation tools
    'automated', 'script', 'robot', 'crawl', 'scan', 'test',
    // Programming languages/libraries commonly used by bots
    'python-requests', 'go-http-client', 'java/', 'node.js', 'ruby',
    // Headless browsers and automation
    'headlesschrome', 'phantomjs', 'slimerjs', 'htmlunit',
    // Security/scraping tools
    'wget', 'curl', 'httpclient', 'scrapy', 'beautifulsoup',
    // Monitoring/uptime tools
    'pingdom', 'uptime', 'monitor', 'check', 'status',
    // SEO/analysis tools that aren't legitimate search engines
    'screaming frog', 'deepcrawl', 'sitebulb', 'xenu'
  ];
  
  const hasAdditionalBotIndicators = additionalBotIndicators.some(indicator => 
    userAgent.toLowerCase().includes(indicator.toLowerCase())
  );
  
  if (hasAdditionalBotIndicators) {
    console.log(`🚫 ADDITIONAL BOT PATTERN DETECTED: ${ip} - ${userAgent}`);
    // Apply extremely strict rate limiting (almost blocking)
    maxRequests = Math.min(maxRequests, 1);
    
    // If already suspicious, block immediately
    if (suspiciousScore >= 20) {
      BLOCKED_IPS.add(ip);
      return new NextResponse('Access Denied - Automated Tool Detected', { status: 403 });
    }
  }

  const current = RATE_LIMIT.get(ip) || { count: 0, timestamp: now, violations: 0 };
  
  // Reset count if window expired
  if (now - current.timestamp > windowMs) {
    current.count = 1;
    current.timestamp = now;
  } else {
    current.count++;
  }
  
  // Check rate limit violation with enhanced bot-specific penalties
  if (current.count > maxRequests) {
    current.violations++;
    RATE_LIMIT.set(ip, current);
    
    // Log bot rate limiting across ALL pages
    logSecurityEvent({
      timestamp: Date.now(),
      ip,
      event_type: 'rate_limit',
      details: `Rate limited on ${pathname}: ${current.count}/${maxRequests} requests, suspicion: ${suspiciousScore}, violations: ${current.violations}`,
      user_agent: userAgent,
      path: pathname,
      severity: suspiciousScore >= 50 ? 'high' : 'medium'
    });
    
    // Much more aggressive penalties for bots across ALL pages
    if (current.violations >= 5 || suspiciousScore >= 60) {
      console.log(`IP ${ip} permanently banned for bot behavior on ${pathname}`);
      BLOCKED_IPS.add(ip);
      return new NextResponse('Permanently Banned - Bot Traffic', { status: 403 });
    }
    
    if (current.violations >= 3 || suspiciousScore >= 40) {
      console.log(`IP ${ip} temp banned for bot violations on ${pathname}`);
      addTempBlock(ip, 120); // 2 hours for bot behavior
      return new NextResponse('Temporarily Banned - Automated Traffic Detected', { status: 429 });
    }
    
    if (current.violations >= 2 || suspiciousScore >= 30) {
      addTempBlock(ip, 30); // 30 minutes
      return new NextResponse('Rate Limited - Suspicious Activity', { 
        status: 429,
        headers: { 'Retry-After': '1800' }
      });
    }
    
    // Standard rate limit response with shorter retry time for suspected bots
    const retryAfter = suspiciousScore >= 20 ? '600' : '300'; // 10 min vs 5 min
    return new NextResponse(`Rate Limited on ${pathname}`, { 
      status: 429,
      headers: { 'Retry-After': retryAfter }
    });
  }
  
  RATE_LIMIT.set(ip, current);
  
  // Enhanced IP behavior tracking
  const tracking = IP_TRACKING.get(ip) || { 
    requests: 0, 
    pages: new Set(), 
    timestamp: now,
    suspicious_score: suspiciousScore,
    user_agents: new Set(),
    countries: new Set(),
    suspicious_paths: new Set(),
    scan_attempts: 0,
    first_seen: now,
    last_activity: now,
    violation_history: []
  };
  
  tracking.requests++;
  tracking.pages.add(pathname);
  tracking.user_agents.add(userAgent);
  tracking.suspicious_score = Math.max(tracking.suspicious_score, suspiciousScore);
  tracking.last_activity = now;
  
  // Track suspicious paths
  if (SUSPICIOUS_PATHS.some(suspPath => pathname.toLowerCase().includes(suspPath))) {
    tracking.suspicious_paths.add(pathname);
    tracking.scan_attempts++;
  }
  
  // Get country from Cloudflare headers if available
  const country = request.headers.get('cf-ipcountry');
  if (country) tracking.countries.add(country);
  
  // Track violations
  if (suspiciousScore > 30) {
    tracking.violation_history.push(`Score:${suspiciousScore} at ${new Date(now).toISOString()}`);
    // Keep only last 10 violations
    if (tracking.violation_history.length > 10) {
      tracking.violation_history = tracking.violation_history.slice(-10);
    }
  }
  
  IP_TRACKING.set(ip, tracking);
  
  // Enhanced bot behavior detection across ALL pages
  const isRapidNavigation = tracking.pages.size > 10 && (now - tracking.timestamp) < 60000; // 10+ pages in 1 min
  const isMultipleUserAgents = tracking.user_agents.size > 2; // Multiple UAs = bot behavior
  const isSuspiciousPattern = tracking.requests > 30 && (now - tracking.timestamp) < 180000; // 30+ requests in 3 min
  const hasRecentViolations = tracking.violation_history.length > 2;
  
  // Block bot patterns across ALL pages
  if (isRapidNavigation || (isMultipleUserAgents && isSuspiciousPattern)) {
    console.log(`🚫 BOT BEHAVIOR DETECTED on ${pathname}: ${ip} - Rapid: ${isRapidNavigation}, Multi-UA: ${isMultipleUserAgents}, Pattern: ${isSuspiciousPattern}`);
    BLOCKED_IPS.add(ip);
    
    logSecurityEvent({
      timestamp: Date.now(),
      ip,
      event_type: 'bot_detected',
      details: `Bot behavior on ${pathname}: ${tracking.pages.size} pages, ${tracking.user_agents.size} UAs, ${tracking.requests} requests`,
      user_agent: userAgent,
      path: pathname,
      severity: 'high'
    });
    
    return new NextResponse('Access Denied - Automated Behavior Detected', { status: 403 });
  }
  
  // Temporary restrictions for suspicious patterns on any page
  if ((isMultipleUserAgents || hasRecentViolations) && suspiciousScore >= 25) {
    console.log(`⚠️ SUSPICIOUS BEHAVIOR on ${pathname}: ${ip} - Score: ${suspiciousScore}`);
    addTempBlock(ip, 60);
    return new NextResponse('Temporarily Restricted - Suspicious Activity', { status: 429 });
  }
  
  // Special enhanced protection for critical pages
  if (pathname === '/subscribe' || pathname === '/admin' || pathname === '/api') {
    const referer = request.headers.get('referer');
    const hasValidReferer = referer && referer.includes(request.nextUrl.origin);
    
    // Block direct access for suspicious IPs
    if (!hasValidReferer && suspiciousScore > 20) {
      console.log(`🚫 Blocked direct access to ${pathname}: ${ip} (score: ${suspiciousScore})`);
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    // Check for rapid page progression (bot behavior)
    if (tracking.pages.size > 12 && (now - tracking.timestamp) < 45000) {
      console.log(`🚫 Blocked rapid navigation to ${pathname}: ${ip}`);
      BLOCKED_IPS.add(ip);
      return new NextResponse('Suspicious Activity Detected', { status: 403 });
    }
    
    // Additional checks for sensitive pages
    if (tracking.requests > 50 && (now - tracking.timestamp) < 300000) {
      console.log(`🚫 Blocked excessive requests to ${pathname}: ${ip}`);
      addTempBlock(ip, 60);
      return new NextResponse('Too Many Requests to Sensitive Page', { status: 429 });
    }
    
    // Check for scan attempts on sensitive pages
    if (tracking.scan_attempts > 3) {
      console.log(`🚫 Blocked scanning attempts on ${pathname}: ${ip}`);
      BLOCKED_IPS.add(ip);
      return new NextResponse('Scanning Activity Detected', { status: 403 });
    }
  }
  
  // Periodic cleanup of old data
  if (Math.random() < 0.001) { // 0.1% chance
    cleanupOldData();
  }
  
  // Enhanced security headers with bot detection info
  const response = NextResponse.next();
  
  // Standard security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-Robots-Tag', 'noindex, nofollow, nosnippet, noarchive');
  
  // Anti-bot headers
  response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  
  // Bot detection and rate limiting headers
  if (suspiciousScore > 0) {
    response.headers.set('X-Suspicion-Level', suspiciousScore.toString());
  }
  response.headers.set('X-Request-ID', `${ip}-${now}`);
  response.headers.set('X-Security-Check', 'passed');
  response.headers.set('X-Rate-Limit', maxRequests.toString());
  response.headers.set('X-Rate-Limit-Remaining', Math.max(0, maxRequests - current.count).toString());
  response.headers.set('X-Page-Protection', pathname.startsWith('/api') || pathname === '/subscribe' || pathname === '/admin' ? 'critical' : 'standard');
  
  return response;
}

// Enhanced cleanup with better memory management
function cleanupOldData() {
  const oneHourAgo = Date.now() - (60 * 60 * 1000);
  const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
  
  let cleanedRateLimit = 0;
  let cleanedTracking = 0;
  let cleanedTempBlocks = 0;
  
  // Clean rate limit data
  for (const [ip, data] of RATE_LIMIT.entries()) {
    if (data.timestamp < oneHourAgo) {
      RATE_LIMIT.delete(ip);
      cleanedRateLimit++;
    }
  }
  
  // Clean tracking data (keep longer for analysis)
  for (const [ip, data] of IP_TRACKING.entries()) {
    if (data.last_activity < oneDayAgo) {
      IP_TRACKING.delete(ip);
      cleanedTracking++;
    }
  }
  
  // Clean expired temporary blocks
  for (const [ip, unblockTime] of TEMP_BLOCKED.entries()) {
    if (Date.now() >= unblockTime) {
      TEMP_BLOCKED.delete(ip);
      cleanedTempBlocks++;
    }
  }
  
  // Clean old security logs
  const oldLogCount = SECURITY_LOG.length;
  const tenMinutesAgo = Date.now() - (10 * 60 * 1000);
  const recentLogs = SECURITY_LOG.filter(log => log.timestamp > tenMinutesAgo);
  SECURITY_LOG.length = 0;
  SECURITY_LOG.push(...recentLogs.slice(-500)); // Keep last 500 recent logs
  
  console.log(`🧹 Cleanup completed: ${cleanedRateLimit} rate limits, ${cleanedTracking} tracking records, ${cleanedTempBlocks} temp blocks, ${oldLogCount - SECURITY_LOG.length} old logs`);
}

// API endpoint for security monitoring (for admins)
export async function getSecurityStats() {
  return {
    blockedIPs: BLOCKED_IPS.size,
    tempBlockedIPs: TEMP_BLOCKED.size,
    activeTracking: IP_TRACKING.size,
    recentEvents: SECURITY_LOG.slice(-20),
    topThreats: Array.from(IP_TRACKING.entries())
      .filter(([_, data]) => data.suspicious_score > 30)
      .sort(([_, a], [__, b]) => b.suspicious_score - a.suspicious_score)
      .slice(0, 10)
      .map(([ip, data]) => ({
        ip,
        score: data.suspicious_score,
        requests: data.requests,
        scanAttempts: data.scan_attempts,
        lastSeen: new Date(data.last_activity).toISOString()
      }))
  };
}

export const config = {
  matcher: [
    // Match all routes except static assets and API routes
    '/((?!api|_next/static|_next/image|favicon.ico|sw.js|robots.txt|sitemap|.*\\.(?:jpg|jpeg|png|gif|svg|ico|css|js|woff|woff2|ttf|eot)$).*)',
  ],
};
