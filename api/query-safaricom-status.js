import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dbpbvoqfexofyxcexmmp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRicGJ2b3FmZXhvZnl4Y2V4bW1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNDc0NTMsImV4cCI6MjA3NDkyMzQ1M30.hGn7ux2xnRxseYCjiZfCLchgOEwIlIAUkdS6h7byZqc';

const supabase = createClient(supabaseUrl, supabaseKey);

// M-Pesa Configuration
const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY || '';
const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET || '';
const MPESA_BUSINESS_SHORTCODE = process.env.MPESA_BUSINESS_SHORT_CODE || process.env.MPESA_BUSINESS_SHORTCODE || '';
const MPESA_PASSKEY = process.env.MPESA_PASSKEY || '';

// Get OAuth token from Safaricom
async function getMpesaToken() {
  try {
    const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString('base64');
    
    const response = await fetch('https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    if (response.ok && data.access_token) {
      return data.access_token;
    }
    
    console.error('Failed to get M-Pesa token:', data);
    return null;
  } catch (error) {
    console.error('Error getting M-Pesa token:', error);
    return null;
  }
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
    const { checkout_id } = req.body;
    
    if (!checkout_id) {
      return res.status(400).json({
        success: false,
        message: 'Checkout ID is required'
      });
    }
    
    console.log('Querying Safaricom M-Pesa for checkout_id:', checkout_id);
    
    // Get M-Pesa token
    const token = await getMpesaToken();
    if (!token) {
      console.error('Failed to get M-Pesa authentication token');
      return res.status(500).json({
        success: false,
        message: 'Authentication failed'
      });
    }
    
    // Query STK Push status from Safaricom
    const now = new Date();
    const timestamp = now.getFullYear().toString() + 
      String(now.getMonth() + 1).padStart(2, '0') + 
      String(now.getDate()).padStart(2, '0') + 
      String(now.getHours()).padStart(2, '0') + 
      String(now.getMinutes()).padStart(2, '0') + 
      String(now.getSeconds()).padStart(2, '0');
    const password = Buffer.from(`${MPESA_BUSINESS_SHORTCODE}${MPESA_PASSKEY}${timestamp}`).toString('base64');
    
    const safaricomResponse = await fetch('https://api.safaricom.co.ke/mpesa/stkpushquery/v1/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        BusinessShortCode: MPESA_BUSINESS_SHORTCODE,
        CheckoutRequestID: checkout_id,
        Timestamp: timestamp,
        Password: password
      })
    });

    const safaricomData = await safaricomResponse.json();
    
    console.log('Safaricom M-Pesa query response:', JSON.stringify(safaricomData, null, 2));
    
    // Check if payment was successful
    if (safaricomResponse.ok && safaricomData.ResultCode === '0') {
      console.log(`Payment successful for ${checkout_id}, updating database`);
      
      // Find and update the transaction
      const { data: transaction, error: findError } = await supabase
        .from('transactions')
        .select('*')
        .eq('transaction_request_id', checkout_id)
        .maybeSingle();
      
      if (transaction && !findError) {
        const { error: updateError } = await supabase
          .from('transactions')
          .update({
            status: 'success',
            mpesa_response: {
              ...(transaction.mpesa_response || {}),
              MpesaReceiptNumber: safaricomData.MpesaReceiptNumber,
              ResultCode: safaricomData.ResultCode,
              ResultDesc: safaricomData.ResultDesc
            }
          })
          .eq('id', transaction.id);
        
        if (!updateError) {
          console.log(`Transaction ${checkout_id} updated to success`);
        }
      }
      
      return res.status(200).json({
        success: true,
        payment: {
          status: 'success',
          amount: transaction?.amount,
          receipt: safaricomData.MpesaReceiptNumber,
          timestamp: new Date().toISOString()
        }
      });
    }
    
    // If not successful, check local database
    const { data: transaction, error: dbError } = await supabase
      .from('transactions')
      .select('*')
      .eq('transaction_request_id', checkout_id)
      .maybeSingle();
    
    if (transaction) {
      let paymentStatus = 'pending';
      if (transaction.status === 'success' || transaction.status === 'completed') {
        paymentStatus = 'success';
      } else if (transaction.status === 'failed' || transaction.status === 'cancelled') {
        paymentStatus = 'failed';
      }
      
      return res.status(200).json({
        success: true,
        payment: {
          status: paymentStatus,
          amount: transaction.amount,
          timestamp: transaction.updated_at
        }
      });
    }
    
    return res.status(200).json({
      success: true,
      payment: {
        status: 'pending',
        message: 'Payment is still being processed'
      }
    });
    
  } catch (error) {
    console.error('Query Safaricom status error:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Failed to query payment status',
      error: error.message || String(error)
    });
  }
};
