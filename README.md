# Credit Auto Sales AI Chatbot

An interactive AI-powered chatbot for Credit Auto Sales that helps customers find vehicles, discuss financing options, and book test drives.

## Features

✨ **Chatbot Capabilities:**
- Real-time inventory integration with HillzDealer
- Interactive vehicle search and recommendations
- Financing discussion for customers with bad credit
- Test drive booking (Mon-Fri 11am-6pm, Sat 11am-4pm)
- Automatic test drive task creation in Zoho CRM
- Lead capture and management
- 24/7 availability

📱 **Multi-Platform:**
- Embedded widget on your website
- Standalone web app
- Mobile-responsive design

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Credentials

Copy `config.example.json` to `config.json` and add your credentials:

```json
{
  "hillzdealer": {
    "username": "YOUR_HILLZDEALER_USERNAME",
    "password": "YOUR_HILLZDEALER_PASSWORD"
  },
  "zoho": {
    "apiToken": "YOUR_ZOHO_CRM_API_TOKEN"
  },
  "claude": {
    "apiKey": "YOUR_CLAUDE_API_KEY"
  }
}
```

**Getting your Claude API Key:**
1. Go to https://console.anthropic.com/
2. Create an account or log in
3. Generate an API key
4. Add it to `config.json`

### 3. Start the Server

```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Chat Endpoint
```
POST /api/chat
Body: { message: string, sessionId?: string }
Response: { response: string, customerData: object, usage: object }
```

### Submit Lead
```
POST /api/submit-lead
Body: {
  firstName: string,
  lastName: string,
  phone?: string,
  email?: string,
  budget?: string,
  tradeInVehicle?: string,
  creditSituation?: string,
  desiredVehicleType?: string
}
```

### Book Test Drive
```
POST /api/book-test-drive
Body: {
  leadId: string,
  vehicleInterest: string,
  dateTime: string,
  dueDate?: string
}
```

### Get Inventory
```
GET /api/inventory
Response: { total: number, vehicles: array }
```

### Get Dealership Info
```
GET /api/dealership
Response: dealership information object
```

## Embedding on Your Website

Add this script to your website to embed the chatbot:

```html
<script>
  (function() {
    const iframe = document.createElement('iframe');
    iframe.src = 'https://your-chatbot-url.com/chat';
    iframe.style.cssText = 'position: fixed; bottom: 20px; right: 20px; width: 400px; height: 600px; border: none; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 9999;';
    document.body.appendChild(iframe);
  })();
</script>
```

## Deployment

### Deploy to Vercel (Free Tier)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Add environment variables in Vercel dashboard

## Architecture

```
Frontend (HTML/CSS/JS Widget)
        ↓
Express Backend (Node.js)
        ↓
Claude API (AI/Chatbot)
        ↓
┌────────────────────────┐
│ HillzDealer (Inventory)│
│ Zoho CRM (Leads/Tasks) │
└────────────────────────┘
```

## Pricing

- **Claude API:** ~$1-2/month (with prompt caching)
- **Hosting (Vercel):** Free tier
- **HillzDealer:** Your existing account
- **Zoho CRM:** Your existing account
- **Total:** ~$1-2/month

## Troubleshooting

### HillzDealer Login Fails
- Verify username and password in config.json
- Check if account is active in HillzDealer

### Zoho Integration Not Working
- Verify API token is correct
- Check that token has required scopes (Leads, Tasks)
- Ensure Zoho CRM is accessible from your network

### Chatbot Doesn't Respond
- Check Claude API key in config.json
- Verify API key has sufficient credits
- Check server logs for errors

## Support

For questions or issues:
- Email: creditautonow@gmail.com
- Phone: (437) 757-6977
- Website: https://creditautosales.ca/

## License

Private - Credit Auto Sales
