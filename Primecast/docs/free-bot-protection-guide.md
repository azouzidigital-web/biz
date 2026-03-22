# Free Bot Protection Services Integration Guide

This guide shows you how to integrate the best free bot protection services with your IPTV site.

## 🚀 Quick Start

### 1. Cloudflare (RECOMMENDED - FREE)
**Benefits:** DDoS protection, bot blocking, CDN, SSL, analytics
**Setup Time:** 15 minutes
**Cost:** FREE

1. Sign up at https://cloudflare.com
2. Add your domain
3. Update nameservers
4. Enable "Bot Fight Mode" (Security → Bots)
5. Configure firewall rules

### 2. Google reCAPTCHA v3 (FREE)
**Benefits:** Invisible CAPTCHA, risk scoring
**Setup Time:** 10 minutes
**Cost:** FREE (1M requests/month)

1. Visit https://www.google.com/recaptcha/admin
2. Create new site (v3)
3. Add domains
4. Get site key and secret key
5. Add to environment variables:

```bash
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key
RECAPTCHA_SECRET_KEY=your_secret_key
```

### 3. hCaptcha (FREE Alternative)
**Benefits:** Privacy-focused, GDPR compliant
**Setup Time:** 10 minutes
**Cost:** FREE (unlimited requests)

1. Sign up at https://www.hcaptcha.com/
2. Create new site
3. Get site key and secret key
4. Add to environment variables:

```bash
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=your_site_key
HCAPTCHA_SECRET_KEY=your_secret_key
```

## 🛡️ Implementation Examples

### Basic Protection (Recommended)
```tsx
import { UltimateProtection, ProtectionPresets } from '@/components/protection/ultimate-protection';

export default function MyPage() {
  return (
    <UltimateProtection 
      config={ProtectionPresets.BALANCED}
    >
      {/* Your page content */}
    </UltimateProtection>
  );
}
```

### Custom Configuration
```tsx
import { UltimateProtection } from '@/components/protection/ultimate-protection';

export default function MyPage() {
  return (
    <UltimateProtection 
      config={{
        enableFingerprint: true,
        enableBotD: true,
        captchaProvider: 'recaptcha',
        recaptchaSiteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
        challengeThreshold: 30,
        onBotDetected: (source, details) => {
          console.log('Bot blocked:', source, details);
          // Send to analytics
        }
      }}
    >
      {/* Your page content */}
    </UltimateProtection>
  );
}
```

### Individual Component Usage
```tsx
// Just reCAPTCHA v3
import { ReCaptchaV3 } from '@/components/protection/recaptcha-v3';

<ReCaptchaV3 
  siteKey="your_site_key"
  onVerify={(token) => console.log('Verified:', token)}
/>

// Just hCaptcha
import { HCaptcha } from '@/components/protection/hcaptcha';

<HCaptcha 
  siteKey="your_site_key"
  onVerify={(token) => console.log('Verified:', token)}
/>

// Just FingerprintJS
import { FingerprintProtection } from '@/components/protection/fingerprint-protection';

<FingerprintProtection 
  onBotDetected={(fp) => console.log('Bot:', fp)}
>
  {/* Content */}
</FingerprintProtection>

// Just BotD
import { BotDProtection } from '@/components/protection/botd-protection';

<BotDProtection>
  {/* Content */}
</BotDProtection>
```

## 📊 Analytics Integration

### Google Analytics 4
```tsx
// In your protection config
onBotDetected: (source, details) => {
  if (window.gtag) {
    window.gtag('event', 'bot_blocked', {
      source: source,
      confidence: details.confidence,
      user_agent: navigator.userAgent
    });
  }
}
```

### Facebook Pixel
```tsx
onBotDetected: (source, details) => {
  if (window.fbq) {
    window.fbq('trackCustom', 'BotBlocked', {
      source: source,
      confidence: details.confidence
    });
  }
}
```

## 🔧 Environment Variables

Create `.env.local` file:
```bash
# reCAPTCHA v3
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
RECAPTCHA_SECRET_KEY=6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe

# hCaptcha
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=10000000-ffff-ffff-ffff-000000000001
HCAPTCHA_SECRET_KEY=0x0000000000000000000000000000000000000000

# DataDome (if using)
NEXT_PUBLIC_DATADOME_CLIENT_KEY=your_client_key
```

## 🚦 Server-Side Verification

### reCAPTCHA v3 Verification (API Route)
```typescript
// pages/api/verify-recaptcha.ts
export default async function handler(req, res) {
  const { token } = req.body;
  
  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`
  });
  
  const data = await response.json();
  
  if (data.success && data.score > 0.5) {
    res.json({ success: true, score: data.score });
  } else {
    res.json({ success: false, score: data.score });
  }
}
```

### hCaptcha Verification
```typescript
// pages/api/verify-hcaptcha.ts
export default async function handler(req, res) {
  const { token } = req.body;
  
  const response = await fetch('https://hcaptcha.com/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${process.env.HCAPTCHA_SECRET_KEY}&response=${token}`
  });
  
  const data = await response.json();
  res.json(data);
}
```

## 🔍 Testing Your Protection

### Test with Our Bot Scripts
```bash
# Basic bot test
node test-bot-simple.js

# Advanced bot test
node test-bot-advanced.js

# Check if middleware blocks
curl -H "User-Agent: bot/1.0" http://localhost:3000/subscribe
```

### Manual Testing Checklist
- [ ] Normal browser access works
- [ ] Bot user agents are blocked
- [ ] Rapid requests trigger rate limiting
- [ ] CAPTCHA appears for suspicious behavior
- [ ] Analytics events are fired

## 🚨 Production Checklist

1. **Enable Cloudflare**
   - [ ] Domain added to Cloudflare
   - [ ] Bot Fight Mode enabled
   - [ ] Security level set to "High"
   - [ ] Rate limiting rules configured

2. **Configure CAPTCHA**
   - [ ] reCAPTCHA/hCaptcha keys added
   - [ ] Server-side verification implemented
   - [ ] Test keys replaced with production keys

3. **Server-Side Protection**
   - [ ] Middleware deployed
   - [ ] Rate limiting active
   - [ ] User agent filtering enabled

4. **Monitoring**
   - [ ] Analytics tracking bot attempts
   - [ ] Alerts set up for high bot traffic
   - [ ] Regular review of protection logs

## 💡 Pro Tips

1. **Start with Cloudflare** - It's the easiest and most effective
2. **Use Balanced preset** - Good protection without blocking legitimate users
3. **Monitor analytics** - Track bot attempts to adjust thresholds
4. **Test regularly** - Run bot tests after any changes
5. **Layer protections** - Multiple layers are more effective than one
6. **Update regularly** - Keep libraries updated for latest protection

## 🆘 Troubleshooting

### Common Issues

**CAPTCHA not loading**
- Check site keys in environment variables
- Verify domain is registered with service
- Check network connectivity

**False positives**
- Lower challenge threshold
- Adjust bot detection sensitivity
- Whitelist legitimate user agents

**Performance issues**
- Use invisible CAPTCHA
- Implement lazy loading
- Optimize fingerprinting frequency

### Debug Mode
Enable debug logging in development:
```tsx
{process.env.NODE_ENV === 'development' && (
  <div className="fixed bottom-4 right-4">
    <BotDetectionStatus />
    <ProtectionMonitor />
  </div>
)}
```

## 📈 Expected Results

With proper configuration, you should see:
- **90%+ bot blocking** with minimal false positives
- **Reduced server load** from automated requests
- **Better analytics data** with less bot contamination
- **Improved SEO** by blocking malicious crawlers
- **Enhanced security** against scraping and fraud

## 🔗 Resources

- [Cloudflare Bot Management](https://developers.cloudflare.com/bots/)
- [reCAPTCHA v3 Documentation](https://developers.google.com/recaptcha/docs/v3)
- [hCaptcha Documentation](https://docs.hcaptcha.com/)
- [FingerprintJS Documentation](https://dev.fingerprintjs.com/)
- [BotD Documentation](https://github.com/fingerprintjs/BotD)
