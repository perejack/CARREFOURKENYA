# M-Pesa Verification - Quick Reference

Fast lookup guide for common tasks.

## Setup (5 minutes)

```bash
# 1. Copy utility to your project
cp lib/mpesa-verification.js your-project/lib/

# 2. Add to .env
MPESA_CONSUMER_KEY=your_key
MPESA_CONSUMER_SECRET=your_secret
MPESA_BUSINESS_SHORT_CODE=your_code
MPESA_PASSKEY=your_passkey

# 3. Import in your code
import { verifyMpesaPayment } from './lib/mpesa-verification.js';
```

## Verify a Payment (1 line)

```javascript
const result = await verifyMpesaPayment(checkoutId, {
  consumerKey: process.env.MPESA_CONSUMER_KEY,
  consumerSecret: process.env.MPESA_CONSUMER_SECRET,
  businessShortCode: process.env.MPESA_BUSINESS_SHORT_CODE,
  passkey: process.env.MPESA_PASSKEY
});

if (result.success) {
  console.log('Payment confirmed!');
}
```

## Response Codes

| Code | Meaning | Action |
|------|---------|--------|
| `0` | Success | Update DB to success |
| `4999` | Processing | Retry in 5 seconds |
| Other | Failed | Show error to user |

## Common Patterns

### Pattern 1: Check Status Endpoint

```javascript
app.post('/api/check-status', async (req, res) => {
  const { checkoutId } = req.body;
  const result = await verifyMpesaPayment(checkoutId, credentials);
  
  res.json({
    success: true,
    payment: { status: result.status }
  });
});
```

### Pattern 2: Frontend Polling

```javascript
setInterval(async () => {
  const response = await fetch('/api/check-status', {
    method: 'POST',
    body: JSON.stringify({ checkoutId })
  });
  
  const data = await response.json();
  
  if (data.payment.status === 'success') {
    showSuccessScreen();
  }
}, 5000); // Poll every 5 seconds
```

### Pattern 3: Database Update

```javascript
if (result.success) {
  await db.transactions.update(
    { id: checkoutId },
    { status: 'success', receipt: result.mpesaReceiptNumber }
  );
}
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Authentication failed" | Check credentials in .env |
| "Invalid timestamp" | Use `generateMpesaTimestamp()` |
| "Payment still pending" | Wait 5-10 seconds, retry |
| "Timeout" | Implement retry logic |

## Files

- `lib/mpesa-verification.js` - Main utility module
- `docs/MPESA_VERIFICATION_GUIDE.md` - Full documentation
- `docs/MPESA_QUICK_REFERENCE.md` - This file

## Need Help?

See `MPESA_VERIFICATION_GUIDE.md` for:
- Full API reference
- Implementation examples
- Error handling
- Best practices
