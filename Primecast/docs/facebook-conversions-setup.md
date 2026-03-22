# Facebook Conversions API Setup Guide

## Environment Variables Setup

### 1. In your Netlify Dashboard:
1. Go to your site settings
2. Navigate to **Environment variables**
3. Add these variables:

```
FACEBOOK_ACCESS_TOKEN=EAAeVAh6ncjcBPK8k0BZCFIiTL2zxQtWhU4XQrpNNTvpwyqzNgWWowrQawdYcMLWPFQ6FBDTFZBvFH1rokYCZAFVGHu7DncEiZBy9cbdCZBwcYJJmt8rhpZBmxtfN2uA2X4OZBA4tZCPMKPPcLM1qAlwZCdgHq0THtIpTCDPlZAwSXQv6WvqfTFVZBZBZBIh3vf7JlKQZDZD
FACEBOOK_PIXEL_ID=4203576886543737
FACEBOOK_TEST_EVENT_CODE=optional_test_event_code_for_development
```

### 2. Getting Your Facebook Access Token:
1. Go to: https://developers.facebook.com/docs/marketing-api/conversions-api
2. Navigate to your app: 412658096777182
3. Click "Generate an access token"
4. Copy the token and add it to your Netlify environment variables

### 3. Testing:
- In development: Set `FACEBOOK_TEST_EVENT_CODE` to test events
- In production: Remove the test event code

## What This Setup Provides:

### ✅ Dual Tracking:
- **Facebook Pixel** (client-side) - tracks users with JavaScript
- **Conversions API** (server-side) - tracks conversions from your server

### ✅ Event Deduplication:
- Uses same `event_id` for both pixel and API calls
- Prevents double-counting of conversions
- Facebook automatically handles deduplication

### ✅ Better Attribution:
- More reliable conversion data
- Works even with ad blockers
- Improved iOS 14.5+ tracking
- Better data quality for Facebook's algorithm

### ✅ Free Tier Compatible:
- Uses Netlify Functions (125K calls/month free)
- No additional server costs
- Efficient and lightweight

## Events Being Tracked:

1. **PageView** - When users visit your pages
2. **Lead** - When users submit the subscription form

## Data Sent to Facebook:

### User Data (Hashed):
- Email address
- Phone number  
- First name
- Last name

### Event Data:
- Currency (USD)
- Value (subscription price)
- Content name (subscription type)
- Content category (Digital Services)

## Privacy & Compliance:
- All personal data is hashed before sending
- Only non-PII data is sent unhashed (user agent, IP)
- Compliant with data protection regulations

## Monitoring:
Check Facebook Events Manager to see:
- Event Match Quality
- Deduplication Rate  
- Data Freshness

This setup will significantly improve your Facebook Ads performance!
