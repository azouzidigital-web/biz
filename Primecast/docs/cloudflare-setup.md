# Cloudflare Bot Protection Setup

Cloudflare's free tier provides excellent bot protection for your IPTV site.

## Step 1: Setup Cloudflare
1. Create account at https://cloudflare.com
2. Add your domain (iptv-pro.ca)
3. Update your domain's nameservers to Cloudflare's

## Step 2: Enable Bot Fight Mode (FREE)
1. Go to Security → Bots
2. Enable "Bot Fight Mode" (FREE)
3. Configure settings:
   - Block known bot attacks
   - Challenge suspicious requests
   - Allow search engines

## Step 3: Additional Free Features
- **Rate Limiting**: Limit requests per IP
- **Security Level**: Set to "High" for stricter protection
- **Challenge Passage**: Force CAPTCHA for suspicious users
- **Browser Integrity Check**: Verify legitimate browsers

## Step 4: Firewall Rules (5 FREE rules)
Create custom rules to block:
- Requests without proper headers
- Non-browser user agents
- Suspicious countries/IPs
- High frequency requests

## Benefits
✅ DDoS protection
✅ Bot detection & blocking
✅ Analytics dashboard
✅ CDN performance boost
✅ SSL certificate
✅ DNS management
