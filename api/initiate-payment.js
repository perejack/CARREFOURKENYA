import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dbpbvoqfexofyxcexmmp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRicGJ2b3FmZXhvZnl4Y2V4bW1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNDc0NTMsImV4cCI6MjA3NDkyMzQ1M30.hGn7ux2xnRxseYCjiZfCLchgOEwIlIAUkdS6h7byZqc';

const supabase = createClient(supabaseUrl, supabaseKey);

// SwiftPay Configuration
const SWIFTPAY_API_KEY = process.env.SWIFTPAY_API_KEY;
const SWIFTPAY_TILL_ID = process.env.SWIFTPAY_TILL_ID;
const SWIFTPAY_BACKEND_URL = 'https://swiftpay-backend-uvv9.onrender.com/api';

// Normalize phone number to 254 format
function normalizePhoneNumber(phone) {
  if (!phone) return null;
  let cleaned = phone.replace(/[\s\-\(\)]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '254' + cleaned.substring(1);
  }
  if (cleaned.length !== 12 || !/^\d+$/.test(cleaned)) {
    return null; // Basic validation for Kenyan numbers
  }
  return cleaned;
}

export default async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).send('');
  }

  console.log('Received request body:', JSON.stringify(req.body, null, 2));

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    let {
      msisdn: phoneNumber,
      amount = 139,
      description = 'Carrefour Application Fee',
      email = null,
      reference = null,
    } = req.body;
    
    // Ensure amount is always 139 if not explicitly provided
    if (!req.body.amount) {
      amount = 139;
    }

    if (!phoneNumber) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    const normalizedPhone = normalizePhoneNumber(phoneNumber);
    if (!normalizedPhone) {
      return res.status(400).json({ success: false, message: 'Invalid phone number format. Use 07XXXXXXXX or 254XXXXXXXXX' });
    }

    const externalReference = `CARREFOUR-${Date.now()}`;
    const transactionReference = reference || externalReference;

    const swiftpayPayload = {
      phone_number: normalizedPhone,
      amount: amount,
      till_id: SWIFTPAY_TILL_ID,
      reference: externalReference,
      description: description
    };

    const response = await fetch(`${SWIFTPAY_BACKEND_URL}/mpesa/stk-push-api`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SWIFTPAY_API_KEY}`,
      },
      body: JSON.stringify(swiftpayPayload),
    });

    const responseData = await response.json();
    
    console.log('SwiftPay response status:', response.status);
    console.log('SwiftPay response ok:', response.ok);
    console.log('SwiftPay response data:', JSON.stringify(responseData, null, 2));

    if (response.ok && responseData.success === true) {
      const checkoutId = responseData.data?.checkout_id || responseData.checkout_id || externalReference;
      
      console.log('Storing transaction with checkout_id:', checkoutId);
      
      // Insert minimal fields (matching CANADAADS working pattern)
      console.log('Attempting insert with transaction_request_id:', checkoutId);
      const { error: dbError } = await supabase
        .from('transactions')
        .insert({
          transaction_request_id: checkoutId,
          amount: parseFloat(amount)
        });

      if (dbError) {
        console.error('Insert failed - code:', dbError.code);
        console.error('Insert failed - message:', dbError.message);
        console.error('Insert failed - details:', dbError.details);
        console.error('Insert failed - hint:', dbError.hint);
      } else {
        console.log('Transaction stored successfully');
      }

      return res.status(200).json({
        success: true,
        message: dbError ? 'Payment initiated successfully (transaction storage pending)' : 'Payment initiated successfully',
        warning: dbError ? 'Failed to store transaction; status will be verified via polling.' : undefined,
        storageError: dbError ? dbError.message : undefined,
        data: {
          requestId: checkoutId,
          checkoutId: checkoutId,
          externalReference: externalReference,
          reference: transactionReference
        }
      });
    } else {
      console.error('SwiftPay error:', responseData);
      return res.status(response.status || 400).json({
        success: false,
        message: responseData.message || 'Payment initiation failed',
        error: responseData
      });
    }
  } catch (error) {
    console.error('Global error in initiate-payment:', error);
    return res.status(500).json({
      success: false,
      message: 'An unexpected server error occurred',
      error: error.message || String(error)
    });
  }
};
