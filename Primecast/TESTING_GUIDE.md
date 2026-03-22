# 🧪 Testing Cloudflare Turnstile with Your Domain

## 🌟 **Using Real Domain: `primecastiptv.site`**

### **Step 1: Update Cloudflare Turnstile**
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → **Turnstile**
2. Edit your existing site or create new one
3. **Domain:** `primecastiptv.site` 
4. **Optional:** Also add `localhost` for local testing
5. Copy your new **Site Key** and **Secret Key**

### **Step 2: Update Environment Variables**
Replace your current keys in `.env.local`:
```bash
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_new_site_key_for_primecastiptv.site
TURNSTILE_SECRET_KEY=your_new_secret_key_for_primecastiptv.site
```

### **Step 3: Test Your Domain**
- **Production:** `https://primecastiptv.site` (if live)
- **Local:** `http://localhost:9003` (with updated keys)

---

## Option 1: Use Test Keys (For Quick Testing)

Your component has fallback test keys that work immediately:

```tsx
siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"}
```

**Test Key:** `1x00000000000000000000AA` - Always passes verification

### Test Now:
1. Open your browser to `http://localhost:9003`
2. You should see the Turnstile verification screen
3. The test widget will appear and auto-verify
4. Check browser console for verification logs

## Option 2: Get Real Turnstile Keys (For Production-like Testing)

### Step 1: Set up ngrok (Optional)
If you want to test with real keys, you need a public URL:

1. **Sign up for ngrok:** https://dashboard.ngrok.com/signup
2. **Get your authtoken:** https://dashboard.ngrok.com/get-started/your-authtoken
3. **Set authtoken:** `ngrok config add-authtoken 2QK8wfT56Hdudp1SMsan0Cx7Sj1_66BvEaeoQZGqEmKLT5KjU`
4. **Run ngrok:** `ngrok http 9003`

**✅ Your ngrok URL:** `https://1ef0-105-74-66-37.ngrok-free.app`

### Step 2: Get Cloudflare Turnstile Keys
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Turnstile** (not the main domain setup)
3. Click **Add Site**
4. For testing with ngrok, use: `1ef0-105-74-66-37.ngrok-free.app` (without https://)
5. Or use `localhost` for local testing
6. Copy your **Site Key** and **Secret Key**

**Note:** For ngrok URLs, Turnstile should accept the subdomain directly.

### Step 3: Add to Environment
Update your `.env.local` with keys for `primecastiptv.site`:
```bash
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_real_site_key_for_primecastiptv.site
TURNSTILE_SECRET_KEY=your_real_secret_key_for_primecastiptv.site
```

**Current keys are for ngrok domain. Update them for your real domain!**

## 🧪 What to Test:

### Browser Testing:
- **First visit:** Should show verification screen
- **After verification:** Should remember for session
- **New tab:** Should stay verified in same session
- **Incognito/New session:** Should require verification again

### Bot Testing:
```bash
# Should trigger verification
curl http://localhost:9003

# Should show verification screen (or be blocked)
wget http://localhost:9003
```

### Console Logs to Look For:
- `🔍 Regular browser detected, showing verification challenge`
- `✅ Cloudflare Turnstile verified successfully`
- `✅ User already verified in this session`

## 🚀 Your Current Setup:

✅ **Turnstile installed** - `@marsidev/react-turnstile`  
✅ **Global protection active** - Wraps entire site  
✅ **Test keys configured** - Works immediately  
✅ **Session persistence** - Remembers verification  
✅ **Clean UI** - Professional verification screen  

**Ready to test now at:** `http://localhost:9003`
