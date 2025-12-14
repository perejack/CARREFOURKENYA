import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dbpbvoqfexofyxcexmmp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRicGJ2b3FmZXhvZnl4Y2V4bW1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNDc0NTMsImV4cCI6MjA3NDkyMzQ1M30.hGn7ux2xnRxseYCjiZfCLchgOEwIlIAUkdS6h7byZqc';

const supabase = createClient(supabaseUrl, supabaseKey);

// SwiftPay Configuration
const SWIFTPAY_API_KEY = 'sp_25c79c9c-5980-410e-b8e6-b223796c55a6';
const SWIFTPAY_TILL_ID = 'dbdedaea-11d8-4bbe-b94f-84bbe4206d3c';
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

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    let { msisdn: phoneNumber, amount = 20, description = 'Carrefour Application Fee' } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    const normalizedPhone = normalizePhoneNumber(phoneNumber);
    if (!normalizedPhone) {
      return res.status(400).json({ success: false, message: 'Invalid phone number format. Use 07XXXXXXXX or 254XXXXXXXXX' });
    }

    const externalReference = `CARREFOUR-${Date.now()}`;

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
      
      // Use raw SQL to bypass schema cache issues
      const { data: insertedData, error: dbError } = await supabase.rpc('insert_transaction', {
        p_till_id: SWIFTPAY_TILL_ID,
        p_transaction_id: checkoutId,
        p_phone_number: normalizedPhone,
        p_amount: parseFloat(amount),
        p_transaction_type: 'stk_push',
        p_reference: externalReference,
        p_mpesa_response: JSON.stringify({
          CheckoutRequestID: checkoutId,
          ResponseCode: '0',
          CustomerMessage: 'Success. Request accepted for processing',
          ResponseDescription: 'Success. Request accepted for processing'
        })
      });

      if (dbError) {
        console.error('Database insert error - code:', dbError.code);
        console.error('Database insert error - message:', dbError.message);
        console.error('Full error:', JSON.stringify(dbError, null, 2));
        
        // Fallback: Try direct insert without mpesa_response
        console.log('Attempting fallback insert without mpesa_response...');
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('transactions')
          .insert({
            till_id: SWIFTPAY_TILL_ID,
            transaction_id: checkoutId,
            amount: parseFloat(amount),
            status: 'pending'
          })
          .select();
        
        if (fallbackError) {
          console.error('Fallback insert also failed:', fallbackError);
          return res.status(500).json({
            success: false,
            message: 'Failed to store transaction',
            error: fallbackError.message
          });
        } else {
          console.log('Fallback insert successful:', fallbackData);
        }
      } else {
        console.log('Transaction stored successfully:', insertedData);
      }

      return res.status(200).json({
        success: true,
        message: 'Payment initiated successfully',
        data: {
          requestId: checkoutId,
          checkoutId: checkoutId,
          externalReference: externalReference
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
