/**
 * M-Pesa Verification Proxy Endpoint
 * 
 * This endpoint allows external projects to verify M-Pesa payments
 * without exposing your Safaricom credentials.
 * 
 * Usage:
 * POST /api/mpesa-verification-proxy
 * Body: { checkoutId: "ws_CO_..." }
 * 
 * Response: { success: true, payment: { status: "success|processing|failed" } }
 */

import { verifyMpesaPayment } from '../lib/mpesa-verification.js';

export default async function handler(req, res) {
  // Enable CORS for client applications
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed. Use POST.'
    });
  }

  try {
    const { checkoutId, apiKey } = req.body;

    // Validate required fields
    if (!checkoutId) {
      return res.status(400).json({
        success: false,
        message: 'checkoutId is required'
      });
    }

    // Optional: Implement API key authentication for additional security
    if (process.env.MPESA_PROXY_API_KEY && apiKey !== process.env.MPESA_PROXY_API_KEY) {
      return res.status(401).json({
        success: false,
        message: 'Invalid API key'
      });
    }

    console.log(`[MPESA Proxy] Verifying payment for checkout: ${checkoutId}`);

    // Verify payment using your credentials
    const result = await verifyMpesaPayment(checkoutId, {
      consumerKey: process.env.MPESA_CONSUMER_KEY,
      consumerSecret: process.env.MPESA_CONSUMER_SECRET,
      businessShortCode: process.env.MPESA_BUSINESS_SHORT_CODE,
      passkey: process.env.MPESA_PASSKEY
    });

    if (!result) {
      return res.status(500).json({
        success: false,
        message: 'Failed to verify payment'
      });
    }

    // Log the verification
    console.log(`[MPESA Proxy] Payment ${checkoutId} status: ${result.status}`);

    // Return normalized response
    return res.status(200).json({
      success: true,
      payment: {
        status: result.status, // 'success', 'processing', 'failed', 'error'
        resultCode: result.resultCode,
        resultDesc: result.resultDesc,
        receipt: result.mpesaReceiptNumber || null,
        checkoutId: checkoutId
      }
    });
  } catch (error) {
    console.error('[MPESA Proxy] Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
