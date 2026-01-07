# M-Pesa Verification Proxy - Setup Guide

Guide for setting up the proxy endpoint on your server to provide payment verification to other developers.

## Overview

The proxy endpoint allows you to:
- ✅ Keep your M-Pesa credentials secure
- ✅ Provide payment verification to multiple projects
- ✅ Monitor all payment verifications
- ✅ Control access with optional API keys
- ✅ Maintain a single source of truth for M-Pesa integration

## Prerequisites

- Node.js project with Express or similar framework
- M-Pesa credentials from Safaricom Daraja portal
- Deployed server (Vercel, Render, AWS, etc.)

## Setup Steps

### Step 1: Copy Files

```bash
# Copy the proxy endpoint
cp api/mpesa-verification-proxy.js your-project/api/

# Copy the utility module (if not already present)
cp lib/mpesa-verification.js your-project/lib/

# Copy documentation
cp docs/MPESA_PROXY_CLIENT_GUIDE.md your-project/docs/
```

### Step 2: Configure Environment Variables

Add to your `.env` file:

```bash
# M-Pesa Credentials (from Safaricom Daraja)
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_BUSINESS_SHORT_CODE=your_shortcode
MPESA_PASSKEY=your_passkey

# Optional: API Key for proxy authentication
MPESA_PROXY_API_KEY=your_secret_api_key_here

# Node environment
NODE_ENV=production
```

### Step 3: Deploy

**For Vercel:**
```bash
# Add environment variables in Vercel dashboard
# Settings → Environment Variables

# Then deploy
vercel deploy
```

**For Render:**
```bash
# Add environment variables in Render dashboard
# Environment → Environment Variables

# Then deploy
git push
```

**For other platforms:**
Follow your platform's documentation for adding environment variables.

### Step 4: Test the Endpoint

```bash
curl -X POST https://your-server.com/api/mpesa-verification-proxy \
  -H "Content-Type: application/json" \
  -d '{
    "checkoutId": "ws_CO_14122025231025749795704273",
    "apiKey": "your_secret_api_key_here"
  }'
```

Expected response:
```json
{
  "success": true,
  "payment": {
    "status": "success|processing|failed",
    "resultCode": "0",
    "resultDesc": "...",
    "receipt": "...",
    "checkoutId": "..."
  }
}
```

## Configuration Options

### Option 1: Public Endpoint (No Authentication)

Remove API key requirement:

```javascript
// In mpesa-verification-proxy.js
// Comment out or remove this check:
// if (process.env.MPESA_PROXY_API_KEY && apiKey !== process.env.MPESA_PROXY_API_KEY) {
//   return res.status(401).json({ success: false, message: 'Invalid API key' });
// }
```

**Pros:** Easy for clients to use
**Cons:** Anyone can call your endpoint

### Option 2: API Key Authentication (Recommended)

Keep the API key check enabled:

```bash
# Set in .env
MPESA_PROXY_API_KEY=super_secret_key_12345
```

Clients must provide the API key:

```javascript
const response = await fetch('https://your-server.com/api/mpesa-verification-proxy', {
  method: 'POST',
  body: JSON.stringify({
    checkoutId: 'ws_CO_...',
    apiKey: 'super_secret_key_12345'
  })
});
```

**Pros:** Secure, you control access
**Cons:** Clients need to manage the API key

### Option 3: Multiple API Keys (Advanced)

```javascript
// In mpesa-verification-proxy.js
const validApiKeys = [
  'key_for_project_1',
  'key_for_project_2',
  'key_for_project_3'
];

if (apiKey && !validApiKeys.includes(apiKey)) {
  return res.status(401).json({ success: false, message: 'Invalid API key' });
}
```

## Monitoring & Logging

### Add Request Logging

```javascript
// In mpesa-verification-proxy.js
console.log({
  timestamp: new Date().toISOString(),
  checkoutId,
  status: result.status,
  resultCode: result.resultCode,
  clientIp: req.headers['x-forwarded-for'] || req.connection.remoteAddress
});
```

### Add Database Logging (Optional)

```javascript
// Log all verification requests to database
await db.mpesaVerifications.create({
  checkoutId,
  status: result.status,
  resultCode: result.resultCode,
  timestamp: new Date(),
  clientIp: req.headers['x-forwarded-for']
});
```

### Add Metrics/Analytics

```javascript
// Track verification success rate
const totalRequests = await db.mpesaVerifications.count();
const successfulRequests = await db.mpesaVerifications.count({ 
  where: { status: 'success' } 
});
const successRate = (successfulRequests / totalRequests) * 100;

console.log(`Success rate: ${successRate.toFixed(2)}%`);
```

## Rate Limiting (Optional)

Prevent abuse by limiting requests:

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.post('/api/mpesa-verification-proxy', limiter, handler);
```

## Error Handling

### Handle Missing Credentials

```javascript
if (!process.env.MPESA_CONSUMER_KEY) {
  console.error('MPESA_CONSUMER_KEY not configured');
  return res.status(500).json({
    success: false,
    message: 'Server not properly configured'
  });
}
```

### Handle Safaricom API Errors

```javascript
if (!result) {
  console.error('Safaricom API error for checkout:', checkoutId);
  return res.status(503).json({
    success: false,
    message: 'Payment verification service temporarily unavailable'
  });
}
```

### Handle Network Timeouts

```javascript
try {
  const result = await verifyMpesaPayment(checkoutId, credentials);
  // ...
} catch (error) {
  if (error.message.includes('timeout')) {
    return res.status(504).json({
      success: false,
      message: 'Verification timeout, please retry'
    });
  }
  // ...
}
```

## Security Best Practices

### 1. Use HTTPS Only

```javascript
// Redirect HTTP to HTTPS
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https') {
    res.redirect(`https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
});
```

### 2. Validate Input

```javascript
// Validate CheckoutID format
if (!checkoutId || typeof checkoutId !== 'string' || checkoutId.length < 10) {
  return res.status(400).json({
    success: false,
    message: 'Invalid checkoutId format'
  });
}
```

### 3. Don't Expose Sensitive Data

```javascript
// ❌ Don't do this
return res.json({
  ...result,
  consumerKey: process.env.MPESA_CONSUMER_KEY // EXPOSED!
});

// ✅ Do this
return res.json({
  success: true,
  payment: {
    status: result.status,
    receipt: result.mpesaReceiptNumber
    // Only return what clients need
  }
});
```

### 4. Implement CORS Carefully

```javascript
// Allow specific origins
const allowedOrigins = [
  'https://project1.com',
  'https://project2.com'
];

app.use((req, res, next) => {
  if (allowedOrigins.includes(req.headers.origin)) {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  }
  next();
});
```

## Distributing to Clients

### 1. Create Client Documentation

Send clients:
- `docs/MPESA_PROXY_CLIENT_GUIDE.md` - How to use the proxy
- `docs/MPESA_QUICK_REFERENCE.md` - Quick lookup
- Your proxy endpoint URL
- API key (if required)

### 2. Provide Example Code

```javascript
// Example for their project
const MPESA_PROXY_URL = 'https://your-server.com/api/mpesa-verification-proxy';
const MPESA_API_KEY = 'their-api-key-here';

async function checkPaymentStatus(checkoutId) {
  const response = await fetch(MPESA_PROXY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ checkoutId, apiKey: MPESA_API_KEY })
  });
  return await response.json();
}
```

### 3. Provide Support Channel

- Email: support@your-domain.com
- Slack: #mpesa-integration
- Discord: M-Pesa Integration channel

## Monitoring & Maintenance

### Weekly Checks

```bash
# Check endpoint is responding
curl -X POST https://your-server.com/api/mpesa-verification-proxy \
  -H "Content-Type: application/json" \
  -d '{"checkoutId": "test", "apiKey": "test"}'

# Check logs for errors
tail -f logs/mpesa-proxy.log
```

### Monthly Review

- Review verification success rate
- Check for failed requests
- Monitor API key usage
- Update documentation if needed

### Quarterly Updates

- Update M-Pesa credentials if needed
- Review security measures
- Update client documentation
- Collect feedback from clients

## Troubleshooting

### Endpoint Returns 500 Error

**Check:**
1. Environment variables are set correctly
2. M-Pesa credentials are valid
3. Server has internet connection
4. Safaricom API is accessible

### Clients Getting "Invalid API Key"

**Solution:**
1. Verify API key is correct
2. Check API key is being sent in request
3. Regenerate API key if needed

### Slow Response Times

**Causes:**
1. Safaricom API is slow
2. Network latency
3. Server is overloaded

**Solutions:**
1. Implement caching
2. Add timeout handling
3. Scale server resources

### High Error Rate

**Check:**
1. M-Pesa credentials still valid
2. Safaricom API status
3. Client is sending correct CheckoutID format
4. Network connectivity

## Pricing Model (Optional)

You can charge clients for using your proxy:

```javascript
// Track usage
await db.usage.create({
  clientId,
  checkoutId,
  timestamp: new Date(),
  status: result.status
});

// Calculate monthly bill
const monthlyRequests = await db.usage.count({
  where: {
    clientId,
    timestamp: { $gte: startOfMonth }
  }
});

const monthlyBill = monthlyRequests * 0.50; // $0.50 per request
```

## Example Pricing

- **Starter:** 100 requests/month - Free
- **Professional:** 1,000 requests/month - $10/month
- **Enterprise:** Unlimited - $50/month

## Next Steps

1. ✅ Deploy the proxy endpoint
2. ✅ Test with a real payment
3. ✅ Set up monitoring/logging
4. ✅ Create API keys for clients
5. ✅ Send documentation to clients
6. ✅ Monitor usage and success rate

## Support

For questions or issues:
1. Check this guide
2. Review `MPESA_PROXY_CLIENT_GUIDE.md`
3. Check server logs
4. Test endpoint manually with curl
