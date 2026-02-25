# M-Pesa Payment Verification Guide

A comprehensive guide for implementing reliable M-Pesa STK Push payment verification using Safaricom's API directly, without relying on webhooks.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Quick Start](#quick-start)
5. [API Reference](#api-reference)
6. [Implementation Examples](#implementation-examples)
7. [Error Handling](#error-handling)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

## Overview

This guide provides a reusable M-Pesa payment verification system that:

- **Queries Safaricom's API directly** instead of relying on unreliable webhooks
- **Works with any M-Pesa integration** (SwiftPay, Pesaflux, or direct Safaricom)
- **Provides real-time payment status** without webhook dependencies
- **Handles all authentication** automatically
- **Normalizes response codes** for easy integration

### Why Direct API Query?

| Aspect | Webhooks | Direct API Query |
|--------|----------|------------------|
| Reliability | ❌ Can fail silently | ✅ Always works |
| Real-time | ✅ Instant | ⚠️ Polling required |
| Dependencies | ❌ External service | ✅ Direct control |
| Complexity | ✅ Simple | ⚠️ More setup |
| Cost | ✅ Free | ✅ Free |

**Recommendation:** Use Direct API Query for production systems.

## Prerequisites

### M-Pesa Credentials

You need the following from Safaricom:

1. **Consumer Key** - API authentication key
2. **Consumer Secret** - API authentication secret
3. **Business Short Code** - Your M-Pesa till/paybill number
4. **Pass Key** - Security key for password generation

### Environment Setup

Store credentials in your `.env` file:

```bash
# M-Pesa Credentials
MPESA_CONSUMER_KEY=your_consumer_key_here
MPESA_CONSUMER_SECRET=your_consumer_secret_here
MPESA_BUSINESS_SHORT_CODE=your_shortcode_here
MPESA_PASSKEY=your_passkey_here
```

### Node.js Requirements

- Node.js 14+ (for `Buffer` and `fetch` support)
- ES6 module support (or use CommonJS with appropriate imports)

## Installation

### 1. Copy the Utility Module

Copy `lib/mpesa-verification.js` to your project:

```bash
cp lib/mpesa-verification.js your-project/lib/
```

### 2. Import in Your Code

```javascript
import { 
  getMpesaToken, 
  queryMpesaPaymentStatus, 
  verifyMpesaPayment 
} from './lib/mpesa-verification.js';
```

### 3. Set Environment Variables

Ensure your `.env` file has M-Pesa credentials:

```bash
MPESA_CONSUMER_KEY=QNDgt0ltfcmiiDAEVWfwAwWq2uHq3XeXv7BEXKGJKS7X7wVg
MPESA_CONSUMER_SECRET=TD6vam4JJs7ghG5eGutL4zsNFFNLBF9yEBxUNZRopGPVNv77yqQvYo0OhsMy3eSq
MPESA_BUSINESS_SHORT_CODE=3581047
MPESA_PASSKEY=cb9041a559db0ad7cbd8debaa5574661c5bf4e1fb7c7e99a8116c83dcaa8474d
```

## Quick Start

### Simple Payment Verification

```javascript
import { verifyMpesaPayment } from './lib/mpesa-verification.js';

// Verify a payment
const result = await verifyMpesaPayment('ws_CO_14122025231025749795704273', {
  consumerKey: process.env.MPESA_CONSUMER_KEY,
  consumerSecret: process.env.MPESA_CONSUMER_SECRET,
  businessShortCode: process.env.MPESA_BUSINESS_SHORT_CODE,
  passkey: process.env.MPESA_PASSKEY
});

if (result.success) {
  console.log('Payment confirmed!');
  // Update database, send confirmation email, etc.
} else if (result.status === 'processing') {
  console.log('Payment still processing...');
  // Retry later
} else {
  console.log('Payment failed:', result.resultDesc);
}
```

### Advanced: Step-by-Step Verification

```javascript
import { 
  getMpesaToken, 
  queryMpesaPaymentStatus 
} from './lib/mpesa-verification.js';

// Step 1: Get authentication token
const token = await getMpesaToken(
  process.env.MPESA_CONSUMER_KEY,
  process.env.MPESA_CONSUMER_SECRET
);

if (!token) {
  console.error('Failed to authenticate');
  return;
}

// Step 2: Query payment status
const response = await queryMpesaPaymentStatus(
  token,
  'ws_CO_14122025231025749795704273',
  {
    businessShortCode: process.env.MPESA_BUSINESS_SHORT_CODE,
    passkey: process.env.MPESA_PASSKEY
  }
);

// Step 3: Handle response
if (response.ResultCode === '0') {
  console.log('Payment successful!');
  console.log('Receipt:', response.MpesaReceiptNumber);
} else if (response.ResultCode === '4999') {
  console.log('Payment still processing');
} else {
  console.log('Payment failed:', response.ResultDesc);
}
```

## API Reference

### `getMpesaToken(consumerKey, consumerSecret)`

Authenticates with Safaricom and returns an OAuth token.

**Parameters:**
- `consumerKey` (string): M-Pesa Consumer Key
- `consumerSecret` (string): M-Pesa Consumer Secret

**Returns:** `Promise<string|null>` - Access token or null if failed

**Example:**
```javascript
const token = await getMpesaToken(
  'QNDgt0ltfcmiiDAEVWfwAwWq2uHq3XeXv7BEXKGJKS7X7wVg',
  'TD6vam4JJs7ghG5eGutL4zsNFFNLBF9yEBxUNZRopGPVNv77yqQvYo0OhsMy3eSq'
);
```

---

### `queryMpesaPaymentStatus(token, checkoutRequestId, config)`

Queries Safaricom for payment status.

**Parameters:**
- `token` (string): OAuth token from `getMpesaToken()`
- `checkoutRequestId` (string): CheckoutRequestID from STK push response
- `config` (object):
  - `businessShortCode` (string): M-Pesa Business Short Code
  - `passkey` (string): M-Pesa Pass Key

**Returns:** `Promise<Object>` - Safaricom API response

**Response Codes:**
- `0` - Payment successful
- `4999` - Payment still processing
- Other codes - Payment failed

**Example:**
```javascript
const response = await queryMpesaPaymentStatus(
  token,
  'ws_CO_14122025231025749795704273',
  {
    businessShortCode: '3581047',
    passkey: 'cb9041a559db0ad7cbd8debaa5574661c5bf4e1fb7c7e99a8116c83dcaa8474d'
  }
);

console.log(response.ResultCode); // '0', '4999', etc.
console.log(response.ResultDesc); // Human-readable description
```

---

### `verifyMpesaPayment(checkoutRequestId, credentials)`

Convenience function that combines authentication and status query.

**Parameters:**
- `checkoutRequestId` (string): CheckoutRequestID from STK push
- `credentials` (object):
  - `consumerKey` (string): M-Pesa Consumer Key
  - `consumerSecret` (string): M-Pesa Consumer Secret
  - `businessShortCode` (string): M-Pesa Business Short Code
  - `passkey` (string): M-Pesa Pass Key

**Returns:** `Promise<Object>` - Normalized result with fields:
- `success` (boolean): true if payment successful
- `status` (string): 'success', 'processing', 'failed', or 'error'
- `resultCode` (string): Safaricom result code
- `resultDesc` (string): Human-readable description
- `mpesaReceiptNumber` (string): M-Pesa receipt if successful
- `rawResponse` (object): Full Safaricom response

**Example:**
```javascript
const result = await verifyMpesaPayment('ws_CO_14122025231025749795704273', {
  consumerKey: process.env.MPESA_CONSUMER_KEY,
  consumerSecret: process.env.MPESA_CONSUMER_SECRET,
  businessShortCode: process.env.MPESA_BUSINESS_SHORT_CODE,
  passkey: process.env.MPESA_PASSKEY
});

if (result.success) {
  console.log('Payment confirmed:', result.mpesaReceiptNumber);
}
```

---

### `generateMpesaTimestamp(date)`

Generates timestamp in Safaricom's required format.

**Parameters:**
- `date` (Date, optional): Date object (defaults to current time)

**Returns:** `string` - Timestamp in YYYYMMDDHHmmss format

**Example:**
```javascript
const timestamp = generateMpesaTimestamp();
// Returns: "20251214234530"
```

---

### `generateMpesaPassword(businessShortCode, passkey, timestamp)`

Generates Base64-encoded password for Safaricom API.

**Parameters:**
- `businessShortCode` (string): M-Pesa Business Short Code
- `passkey` (string): M-Pesa Pass Key
- `timestamp` (string): Timestamp in YYYYMMDDHHmmss format

**Returns:** `string` - Base64-encoded password

**Example:**
```javascript
const password = generateMpesaPassword(
  '3581047',
  'cb9041a559db0ad7cbd8debaa5574661c5bf4e1fb7c7e99a8116c83dcaa8474d',
  '20251214234530'
);
```

## Implementation Examples

### Example 1: Express.js Payment Status Endpoint

```javascript
import express from 'express';
import { verifyMpesaPayment } from './lib/mpesa-verification.js';

const app = express();

app.post('/api/check-payment-status', async (req, res) => {
  const { checkoutId } = req.body;

  if (!checkoutId) {
    return res.status(400).json({
      success: false,
      message: 'Checkout ID required'
    });
  }

  try {
    const result = await verifyMpesaPayment(checkoutId, {
      consumerKey: process.env.MPESA_CONSUMER_KEY,
      consumerSecret: process.env.MPESA_CONSUMER_SECRET,
      businessShortCode: process.env.MPESA_BUSINESS_SHORT_CODE,
      passkey: process.env.MPESA_PASSKEY
    });

    // Update database if payment successful
    if (result.success) {
      await updateTransactionStatus(checkoutId, 'success');
    }

    res.json({
      success: true,
      payment: {
        status: result.status,
        receipt: result.mpesaReceiptNumber,
        message: result.resultDesc
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to check payment status'
    });
  }
});
```

### Example 2: Polling with Retry Logic

```javascript
import { verifyMpesaPayment } from './lib/mpesa-verification.js';

async function pollPaymentStatus(checkoutId, maxRetries = 30) {
  let retries = 0;

  while (retries < maxRetries) {
    const result = await verifyMpesaPayment(checkoutId, {
      consumerKey: process.env.MPESA_CONSUMER_KEY,
      consumerSecret: process.env.MPESA_CONSUMER_SECRET,
      businessShortCode: process.env.MPESA_BUSINESS_SHORT_CODE,
      passkey: process.env.MPESA_PASSKEY
    });

    if (result.success) {
      console.log('Payment confirmed!');
      return { confirmed: true, result };
    }

    if (result.status === 'failed') {
      console.log('Payment failed');
      return { confirmed: false, result };
    }

    // Still processing, wait and retry
    console.log(`Checking again... (attempt ${retries + 1}/${maxRetries})`);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
    retries++;
  }

  return { confirmed: false, message: 'Payment verification timeout' };
}
```

### Example 3: Database Integration

```javascript
import { verifyMpesaPayment } from './lib/mpesa-verification.js';
import { supabase } from './lib/supabase.js';

async function verifyAndUpdatePayment(checkoutId) {
  try {
    // Verify payment with Safaricom
    const result = await verifyMpesaPayment(checkoutId, {
      consumerKey: process.env.MPESA_CONSUMER_KEY,
      consumerSecret: process.env.MPESA_CONSUMER_SECRET,
      businessShortCode: process.env.MPESA_BUSINESS_SHORT_CODE,
      passkey: process.env.MPESA_PASSKEY
    });

    // Update database
    const { error } = await supabase
      .from('transactions')
      .update({
        status: result.success ? 'success' : 'failed',
        mpesa_receipt: result.mpesaReceiptNumber,
        result_code: result.resultCode,
        result_description: result.resultDesc
      })
      .eq('transaction_request_id', checkoutId);

    if (error) {
      console.error('Database update error:', error);
      return false;
    }

    return result.success;
  } catch (error) {
    console.error('Verification error:', error);
    return false;
  }
}
```

## Error Handling

### Common Errors and Solutions

#### 1. Authentication Failed

```javascript
const token = await getMpesaToken(consumerKey, consumerSecret);
if (!token) {
  console.error('Authentication failed');
  // Check credentials in .env file
  // Verify credentials are correct from Safaricom
}
```

#### 2. Invalid Timestamp

The timestamp must be in exact format: `YYYYMMDDHHmmss`

```javascript
// ❌ Wrong
const timestamp = new Date().toISOString(); // "2025-12-14T23:45:30.123Z"

// ✅ Correct
import { generateMpesaTimestamp } from './lib/mpesa-verification.js';
const timestamp = generateMpesaTimestamp(); // "20251214234530"
```

#### 3. Invalid CheckoutRequestID

```javascript
// ❌ Wrong - missing prefix
const checkoutId = '14122025231025749795704273';

// ✅ Correct - includes SwiftPay prefix
const checkoutId = 'ws_CO_14122025231025749795704273';
```

#### 4. Network Timeout

```javascript
try {
  const result = await verifyMpesaPayment(checkoutId, credentials);
} catch (error) {
  if (error.message.includes('timeout')) {
    console.log('Network timeout, will retry later');
    // Implement retry logic
  }
}
```

## Best Practices

### 1. Implement Polling on Frontend

Don't rely on a single status check. Poll every 5-10 seconds:

```javascript
async function pollPaymentStatus(checkoutId) {
  const maxAttempts = 30;
  let attempts = 0;

  const interval = setInterval(async () => {
    attempts++;

    const response = await fetch('/api/check-payment-status', {
      method: 'POST',
      body: JSON.stringify({ checkoutId })
    });

    const data = await response.json();

    if (data.payment.status === 'success') {
      clearInterval(interval);
      showSuccessScreen();
    } else if (data.payment.status === 'failed') {
      clearInterval(interval);
      showErrorScreen();
    } else if (attempts >= maxAttempts) {
      clearInterval(interval);
      showTimeoutScreen();
    }
  }, 5000); // Poll every 5 seconds
}
```

### 2. Cache Tokens

Tokens are valid for 1 hour. Cache them to reduce API calls:

```javascript
let cachedToken = null;
let tokenExpiry = null;

async function getToken() {
  if (cachedToken && tokenExpiry > Date.now()) {
    return cachedToken;
  }

  cachedToken = await getMpesaToken(
    process.env.MPESA_CONSUMER_KEY,
    process.env.MPESA_CONSUMER_SECRET
  );
  tokenExpiry = Date.now() + (59 * 60 * 1000); // 59 minutes

  return cachedToken;
}
```

### 3. Log All Transactions

```javascript
async function verifyAndLog(checkoutId) {
  const result = await verifyMpesaPayment(checkoutId, credentials);

  console.log({
    timestamp: new Date().toISOString(),
    checkoutId,
    status: result.status,
    resultCode: result.resultCode,
    resultDesc: result.resultDesc
  });

  return result;
}
```

### 4. Implement Timeout Handling

```javascript
async function verifyWithTimeout(checkoutId, timeoutMs = 5000) {
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Timeout')), timeoutMs)
  );

  try {
    return await Promise.race([
      verifyMpesaPayment(checkoutId, credentials),
      timeoutPromise
    ]);
  } catch (error) {
    if (error.message === 'Timeout') {
      console.log('Verification timeout, will retry later');
    }
    throw error;
  }
}
```

## Troubleshooting

### Payment Shows as Pending but User Completed It

**Cause:** Safaricom API might still be processing

**Solution:** 
- Wait 5-10 seconds and retry
- Implement exponential backoff: 2s, 4s, 8s, 16s, etc.
- Maximum wait: 30 seconds

### "Could not find column in schema cache"

**Cause:** Supabase schema caching issue

**Solution:**
- Only update the `status` field, not JSON fields
- Avoid updating `mpesa_response` in the same query
- Update JSON fields in a separate query if needed

### Token Expires During Long Polling

**Cause:** OAuth token valid for 1 hour only

**Solution:**
- Implement token caching (see Best Practices #2)
- Refresh token every 50 minutes
- Handle 401 errors by requesting new token

### Timestamp Format Errors

**Cause:** Incorrect timestamp format

**Solution:**
- Always use `generateMpesaTimestamp()` function
- Never use ISO format or other formats
- Format must be exactly: `YYYYMMDDHHmmss`

## Support & Questions

For issues or questions:
1. Check the [API Reference](#api-reference) section
2. Review [Implementation Examples](#implementation-examples)
3. Check [Troubleshooting](#troubleshooting) section
4. Review error logs for specific error codes

## License

This utility is provided as-is for use in M-Pesa payment integration projects.
