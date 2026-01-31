# M-Pesa Verification Proxy - Client Integration Guide

Guide for developers integrating with the M-Pesa verification proxy endpoint.

## Overview

Instead of managing M-Pesa credentials yourself, you can use a shared proxy endpoint that handles payment verification securely.

**Proxy Endpoint:** `https://your-server.com/api/mpesa-verification-proxy`

## Quick Start

### 1. Call the Proxy Endpoint

```javascript
async function checkPaymentStatus(checkoutId) {
  const response = await fetch('https://your-server.com/api/mpesa-verification-proxy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      checkoutId: checkoutId,
      apiKey: 'your-api-key' // Optional, if required
    })
  });

  const data = await response.json();
  return data;
}
```

### 2. Handle the Response

```javascript
const result = await checkPaymentStatus('ws_CO_14122025231025749795704273');

if (result.success) {
  const payment = result.payment;
  
  if (payment.status === 'success') {
    console.log('Payment confirmed!');
    console.log('Receipt:', payment.receipt);
  } else if (payment.status === 'processing') {
    console.log('Payment still processing, will check again...');
  } else if (payment.status === 'failed') {
    console.log('Payment failed:', payment.resultDesc);
  }
} else {
  console.error('Verification failed:', result.message);
}
```

## API Reference

### Endpoint

```
POST /api/mpesa-verification-proxy
```

### Request

```json
{
  "checkoutId": "ws_CO_14122025231025749795704273",
  "apiKey": "your-api-key"
}
```

**Parameters:**
- `checkoutId` (required) - CheckoutRequestID from SwiftPay STK push response
- `apiKey` (optional) - API key if the proxy requires authentication

### Response (Success)

```json
{
  "success": true,
  "payment": {
    "status": "success",
    "resultCode": "0",
    "resultDesc": "The service request is processed successfully.",
    "receipt": "MPF123456789",
    "checkoutId": "ws_CO_14122025231025749795704273"
  }
}
```

### Response (Processing)

```json
{
  "success": true,
  "payment": {
    "status": "processing",
    "resultCode": "4999",
    "resultDesc": "The transaction is still under processing",
    "receipt": null,
    "checkoutId": "ws_CO_14122025231025749795704273"
  }
}
```

### Response (Failed)

```json
{
  "success": true,
  "payment": {
    "status": "failed",
    "resultCode": "1",
    "resultDesc": "Insufficient funds",
    "receipt": null,
    "checkoutId": "ws_CO_14122025231025749795704273"
  }
}
```

### Response (Error)

```json
{
  "success": false,
  "message": "Invalid API key"
}
```

## Status Codes

| Status | Meaning | Action |
|--------|---------|--------|
| `success` | Payment confirmed | Update database, show success screen |
| `processing` | Still processing | Retry in 5 seconds |
| `failed` | Payment failed | Show error message |
| `error` | Verification error | Retry or contact support |

## Implementation Examples

### Example 1: React Component with Polling

```javascript
import { useState, useEffect } from 'react';

export function PaymentStatus({ checkoutId }) {
  const [status, setStatus] = useState('pending');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(
          'https://your-server.com/api/mpesa-verification-proxy',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ checkoutId })
          }
        );

        const data = await response.json();

        if (data.success) {
          setStatus(data.payment.status);
          setLoading(false);

          if (data.payment.status === 'success') {
            clearInterval(interval);
          } else if (data.payment.status === 'failed') {
            clearInterval(interval);
          }
        }
      } catch (error) {
        console.error('Error checking status:', error);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [checkoutId]);

  if (loading) {
    return <div>Checking payment status...</div>;
  }

  if (status === 'success') {
    return <div className="success">Payment confirmed!</div>;
  }

  if (status === 'failed') {
    return <div className="error">Payment failed</div>;
  }

  return <div>Processing...</div>;
}
```

### Example 2: Express.js Backend

```javascript
import express from 'express';

const app = express();

app.post('/api/check-payment', async (req, res) => {
  const { checkoutId } = req.body;

  try {
    const response = await fetch(
      'https://your-server.com/api/mpesa-verification-proxy',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkoutId })
      }
    );

    const data = await response.json();

    if (data.success && data.payment.status === 'success') {
      // Update your database
      await db.transactions.update(
        { checkoutId },
        { status: 'success', receipt: data.payment.receipt }
      );
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

### Example 3: Vue.js Component

```vue
<template>
  <div class="payment-status">
    <div v-if="status === 'pending'" class="spinner">
      Checking payment status...
    </div>
    <div v-else-if="status === 'success'" class="success">
      ✓ Payment confirmed!
    </div>
    <div v-else-if="status === 'failed'" class="error">
      ✗ Payment failed
    </div>
  </div>
</template>

<script>
export default {
  props: ['checkoutId'],
  data() {
    return {
      status: 'pending'
    };
  },
  mounted() {
    this.pollStatus();
  },
  methods: {
    async pollStatus() {
      const interval = setInterval(async () => {
        try {
          const response = await fetch(
            'https://your-server.com/api/mpesa-verification-proxy',
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ checkoutId: this.checkoutId })
            }
          );

          const data = await response.json();

          if (data.success) {
            this.status = data.payment.status;

            if (this.status !== 'processing') {
              clearInterval(interval);
            }
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }, 5000);
    }
  }
};
</script>
```

## Best Practices

### 1. Implement Timeout

```javascript
async function checkPaymentWithTimeout(checkoutId, timeoutMs = 5000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(
      'https://your-server.com/api/mpesa-verification-proxy',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkoutId }),
        signal: controller.signal
      }
    );

    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}
```

### 2. Implement Retry Logic

```javascript
async function checkPaymentWithRetry(checkoutId, maxRetries = 3) {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(
        'https://your-server.com/api/mpesa-verification-proxy',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ checkoutId })
        }
      );

      return await response.json();
    } catch (error) {
      lastError = error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }

  throw lastError;
}
```

### 3. Cache Results

```javascript
const statusCache = new Map();

async function checkPaymentCached(checkoutId) {
  // Return cached result if available
  if (statusCache.has(checkoutId)) {
    return statusCache.get(checkoutId);
  }

  const result = await checkPaymentStatus(checkoutId);

  // Cache successful results
  if (result.success && result.payment.status !== 'processing') {
    statusCache.set(checkoutId, result);
  }

  return result;
}
```

## Error Handling

### Network Error

```javascript
try {
  const result = await checkPaymentStatus(checkoutId);
} catch (error) {
  if (error.name === 'AbortError') {
    console.log('Request timeout');
  } else {
    console.error('Network error:', error);
  }
}
```

### Invalid Response

```javascript
const result = await checkPaymentStatus(checkoutId);

if (!result.success) {
  console.error('Verification failed:', result.message);
  // Retry or show error to user
}
```

### Missing CheckoutID

```javascript
if (!checkoutId) {
  console.error('CheckoutID is required');
  return;
}

const result = await checkPaymentStatus(checkoutId);
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Invalid API key" | Contact your provider for correct API key |
| "Timeout" | Implement retry logic with exponential backoff |
| "Payment still processing" | Wait 5-10 seconds and retry |
| "Network error" | Check internet connection and endpoint URL |

## Support

For issues or questions:
1. Check the [API Reference](#api-reference) section
2. Review [Implementation Examples](#implementation-examples)
3. Check [Best Practices](#best-practices)
4. Contact your M-Pesa integration provider

## Security Notes

- Never hardcode the proxy URL in your code - use environment variables
- If an API key is required, store it securely in environment variables
- Always use HTTPS when calling the proxy endpoint
- Don't expose your CheckoutID in client-side logs
- Implement rate limiting on your client to avoid excessive API calls

## Example .env

```bash
VITE_MPESA_PROXY_URL=https://your-server.com/api/mpesa-verification-proxy
VITE_MPESA_API_KEY=your-api-key-here
```

## Example Usage with .env

```javascript
const proxyUrl = import.meta.env.VITE_MPESA_PROXY_URL;
const apiKey = import.meta.env.VITE_MPESA_API_KEY;

async function checkPaymentStatus(checkoutId) {
  const response = await fetch(proxyUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ checkoutId, apiKey })
  });

  return await response.json();
}
```
