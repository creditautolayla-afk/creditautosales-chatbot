# Deployment Guide - Credit Auto Sales Chatbot

## Step 1: Get Your Claude API Key

1. Go to **https://console.anthropic.com/**
2. Sign up or log in with your email
3. Click **"API Keys"** in the left sidebar
4. Click **"Create Key"**
5. Give it a name like "Credit Auto Sales Chatbot"
6. **Copy the entire key** (starts with `sk-`)
   - ⚠️ **IMPORTANT**: Save this in a secure place - you won't be able to see it again!
7. Paste it into `config.json`:

```json
{
  "claude": {
    "apiKey": "sk-ant-v4-YOUR_KEY_HERE"
  }
}
```

## Step 2: Test Locally

Before deploying, test everything works:

```bash
# Install dependencies
npm install

# Start the server
npm start
```

You should see:
```
✅ Loaded XX vehicles from HillzDealer
🚀 Credit Auto Sales Chatbot running on port 3000
```

Visit **http://localhost:3000** in your browser. The chatbot should respond to your messages.

## Step 3: Deploy to Vercel (Free)

### Option A: Deploy via Vercel CLI (Easiest)

```bash
# 1. Install Vercel CLI globally
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy
vercel

# 4. When prompted:
# - "Set up and deploy...?" → YES
# - "Which scope?" → Your personal account
# - "Link to existing project?" → NO (unless you already have one)
# - "Project name?" → creditautosales-chatbot
# - "Directory?" → ./
```

Vercel will give you a deployment URL like: `https://creditautosales-chatbot.vercel.app`

### Option B: Deploy via GitHub

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/creditautosales-chatbot.git
   git push -u origin main
   ```

2. **Connect to Vercel:**
   - Go to https://vercel.com/import
   - Select your GitHub repository
   - Click "Import"

## Step 4: Add Environment Variables to Vercel

After deployment, you need to set your environment variables:

1. Go to your **Vercel project dashboard**
2. Click **"Settings"** → **"Environment Variables"**
3. Add these variables:
   ```
   HILLZDEALER_USERNAME = Laylah
   HILLZDEALER_PASSWORD = Motors100!
   ZOHO_API_TOKEN = 1000.3cdf2408f0f56ae7e121794aaff0f60f.268e06747838be6ff8155f016238df6b
   CLAUDE_API_KEY = sk-ant-v4-YOUR_KEY_HERE
   ```
4. Click **"Save"**
5. Click **"Deployments"** → **"Redeploy"** to apply changes

## Step 5: Embed on Your Website

### Add to Google Site:

1. Go to your **creditautosales.ca** website in Google Sites
2. Click **"Insert"** → **"Embed code"**
3. Paste this code:

```html
<script>
  (function() {
    const iframe = document.createElement('iframe');
    iframe.src = 'YOUR_VERCEL_URL/chat';
    iframe.style.cssText = 'position: fixed; bottom: 20px; right: 20px; width: 400px; height: 600px; border: none; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 9999; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;';
    document.body.appendChild(iframe);
  })();
</script>
```

Replace `YOUR_VERCEL_URL` with your actual Vercel deployment URL (e.g., `https://creditautosales-chatbot.vercel.app`)

4. Click **"Insert"**

## Step 6: Test the Live Chatbot

1. Visit **https://YOUR_VERCEL_URL/** in your browser
2. Type a message like: "Hi, I'm looking for a Toyota"
3. The chatbot should respond with vehicle recommendations
4. Try booking a test drive to test the Zoho integration

## Troubleshooting

### Chatbot doesn't respond
- **Check Vercel logs:**
  1. Go to Vercel dashboard → Your project
  2. Click "Deployments"
  3. Click "Logs"
  4. Look for errors

- **Check environment variables:**
  1. Verify all 4 variables are set in Vercel Settings
  2. Redeploy after making changes

- **Check Claude API key:**
  1. Verify you pasted the full key (starts with `sk-ant-v4-`)
  2. Check your Anthropic account has credits/a payment method

### HillzDealer inventory doesn't load
- Verify username and password are correct
- Check HillzDealer account is active
- Check if HillzDealer website is down

### Zoho leads aren't being created
- Verify API token is correct
- Check Zoho account access
- Verify token has required scopes (Leads, Tasks)

### Widget doesn't appear on website
- Verify embed code is in correct place
- Check browser console for JavaScript errors (F12)
- Verify iframe URL is accessible
- Check z-index isn't being overridden by other elements

## Monitoring

### Check Logs
```bash
# View live logs from Vercel
vercel logs
```

### Monitor Usage
1. **Claude API:** https://console.anthropic.com/account/usage
2. **Vercel:** Vercel dashboard → Usage
3. **Zoho:** https://www.zoho.com/crm/ → Leads section

## Updates & Maintenance

### Update Chatbot Prompt
Edit `src/chatbot.js` → `SYSTEM_PROMPT` and redeploy:
```bash
vercel deploy --prod
```

### Update Configuration
Update `config.json` and redeploy, or use Vercel Environment Variables for sensitive data.

### Add New Features
1. Make changes locally
2. Test with `npm start`
3. Commit to Git
4. Push to GitHub (or use `vercel deploy` again)
5. Vercel auto-deploys on push

## Support

For issues:
- Check Vercel logs
- Check Anthropic API status: https://console.anthropic.com/
- Check HillzDealer website
- Contact Zoho support for CRM issues

---

**Monthly Cost Estimate:**
- Vercel: $0 (free tier)
- Claude API: ~$1-3 (with prompt caching)
- HillzDealer: Your existing account
- Zoho CRM: Your existing account
- **Total: ~$1-3/month**
