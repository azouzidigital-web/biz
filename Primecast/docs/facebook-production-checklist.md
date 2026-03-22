# Facebook Conversions API - Production Readiness Checklist

## ✅ Current Status: READY FOR PRODUCTION

### **Environment Configuration**
- ✅ **Domain**: `primmecast.site` (corrected)
- ✅ **Pixel ID**: `4203576886543737` 
- ✅ **Access Token**: Configured in environment variables
- ✅ **API Version**: `v21.0` (latest)

### 2. **Facebook App Setup**
- [ ] Facebook App ID: `412658096777182` is configured
- [ ] Facebook Pixel ID: `4203576886543737` is verified in Facebook Business Manager
- [ ] Conversions API access token has proper permissions:
  - [ ] ads_management
  - [ ] business_management
  - [ ] pages_read_engagement

### 3. **Domain Verification**
- [ ] Domain `primecastt.site` is verified in Facebook Business Manager
- [ ] SSL certificate is active and valid
- [ ] Website is accessible via HTTPS

### 4. **Event Tracking Verification**
- [ ] Facebook Pixel is firing on page load
- [ ] Conversions API is sending events successfully
- [ ] Event deduplication is working (same event_id for pixel and API)

## 🔍 **How to Check if It's Working**

### 1. **Facebook Events Manager**
1. Go to https://business.facebook.com/events_manager
2. Select your pixel: `4203576886543737`
3. Check "Test Events" tab for real-time events
4. Check "Events" tab for historical data (20-minute delay)

### 2. **Event Match Quality**
- Should be **Good** or **Excellent** (not Poor)
- Look for warnings about missing user data
- Check deduplication rate (should be high)

### 3. **Netlify Function Logs**
- Check for successful responses: `events_received: 1`
- No error messages in logs
- IP addresses are being captured

## 🚨 **Common Issues & Solutions**

### Issue 1: Events Not Appearing
**Possible Causes:**
- Test event code is active (remove for production)
- Wrong pixel ID
- Future timestamps
- Access token expired

**Solution:**
```bash
# Check environment variables
echo $FACEBOOK_PIXEL_ID
echo $NODE_ENV
# Should NOT have FACEBOOK_TEST_EVENT_CODE in production
```

### Issue 2: Poor Match Quality
**Possible Causes:**
- Missing IP address
- Missing user data (email, phone)
- Incorrect data format

**Solution:**
- Ensure IP detection is working
- Hash user data properly
- Include more user information

### Issue 3: Access Token Issues
**Possible Causes:**
- Token expired
- Insufficient permissions
- Wrong app association

**Solution:**
- Regenerate access token
- Check app permissions
- Verify app is connected to correct pixel

## 📊 **Production Monitoring**

### Daily Checks
- [ ] Check Facebook Events Manager for event volume
- [ ] Review Netlify function logs for errors
- [ ] Monitor conversion rates

### Weekly Checks
- [ ] Review Event Match Quality scores
- [ ] Check for Facebook API warnings
- [ ] Verify deduplication rates

### Monthly Checks
- [ ] Regenerate access tokens (recommended)
- [ ] Review Facebook Pixel Helper for errors
- [ ] Audit event tracking completeness

## 🔧 **Troubleshooting Commands**

### Test Event Sending
```bash
# Send test event via API
curl -X POST "https://graph.facebook.com/v19.0/4203576886543737/events" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "data": [{
      "event_name": "PageView",
      "event_time": '$(date +%s)',
      "action_source": "website",
      "event_source_url": "https://primecastt.site",
      "user_data": {
        "client_ip_address": "192.168.1.1",
        "client_user_agent": "Mozilla/5.0 (compatible; Test/1.0)"
      }
    }]
  }'
```

### Check Pixel Status
```javascript
// Run in browser console
console.log('Facebook Pixel Status:', window.fbq ? 'Loaded' : 'Not loaded');
console.log('Pixel ID:', '4203576886543737');
```

## ✅ **Ready for Production When:**
1. All environment variables are set correctly
2. Events appear in Facebook Events Manager
3. Match quality is Good or Excellent
4. No errors in Netlify function logs
5. Test event code is removed
6. Domain is verified in Facebook Business Manager

## 🔄 **Deployment Process**
1. Update environment variables in Netlify
2. Remove test event code
3. Deploy to production
4. Monitor for 24 hours
5. Check Facebook Events Manager for data
6. Verify conversion tracking is working
