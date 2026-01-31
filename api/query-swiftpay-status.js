import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dbpbvoqfexofyxcexmmp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRicGJ2b3FmZXhvZnl4Y2V4bW1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNDc0NTMsImV4cCI6MjA3NDkyMzQ1M30.hGn7ux2xnRxseYCjiZfCLchgOEwIlIAUkdS6h7byZqc';

const supabase = createClient(supabaseUrl, supabaseKey);

// SwiftPay Configuration
const SWIFTPAY_API_KEY = process.env.SWIFTPAY_API_KEY;
const SWIFTPAY_TILL_ID = process.env.SWIFTPAY_TILL_ID;
const SWIFTPAY_BACKEND_URL = 'https://swiftpay-backend-uvv9.onrender.com/api';

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
    
    console.log('Querying SwiftPay for checkout_id:', checkout_id);
    
    // Query SwiftPay API to get transaction status
    const swiftpayResponse = await fetch(`${SWIFTPAY_BACKEND_URL}/mpesa/query-stk-status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SWIFTPAY_API_KEY}`,
      },
      body: JSON.stringify({
        checkout_id: checkout_id,
        till_id: SWIFTPAY_TILL_ID
      }),
    });

    const swiftpayData = await swiftpayResponse.json();
    
    console.log('SwiftPay query response:', JSON.stringify(swiftpayData, null, 2));
    
    if (swiftpayResponse.ok && swiftpayData.success) {
      // Payment was successful, update the transaction in database
      const paymentStatus = swiftpayData.data?.status || 'success';
      
      if (paymentStatus === 'success' || paymentStatus === 'completed') {
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
                ...swiftpayData.data
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
            timestamp: new Date().toISOString(),
            ...swiftpayData.data
          }
        });
      }
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
    console.error('Query SwiftPay status error:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Failed to query payment status',
      error: error.message || String(error)
    });
  }
};
