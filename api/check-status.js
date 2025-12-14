import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dbpbvoqfexofyxcexmmp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRicGJ2b3FmZXhvZnl4Y2V4bW1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNDc0NTMsImV4cCI6MjA3NDkyMzQ1M30.hGn7ux2xnRxseYCjiZfCLchgOEwIlIAUkdS6h7byZqc'

const supabase = createClient(supabaseUrl, supabaseKey);

// M-Pesa Configuration
const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY || '';
const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET || '';
const MPESA_BUSINESS_SHORTCODE = process.env.MPESA_BUSINESS_SHORT_CODE || process.env.MPESA_BUSINESS_SHORTCODE || '';
const MPESA_PASSKEY = process.env.MPESA_PASSKEY || '';

// Get OAuth token from Safaricom
async function getMpesaToken() {
  try {
    if (!MPESA_CONSUMER_KEY || !MPESA_CONSUMER_SECRET) {
      console.error('M-Pesa credentials not configured');
      return null;
    }
    
    const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString('base64');
    
    const response = await fetch('https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('M-Pesa token response status:', response.status);
      const text = await response.text();
      console.error('M-Pesa token response:', text);
      return null;
    }

    const data = await response.json();
    return data.access_token || null;
  } catch (error) {
    console.error('Error getting M-Pesa token:', error.message);
    return null;
  }
}

export default async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).send('');
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { transaction_request_id } = req.body;
    
    if (!transaction_request_id) {
      return res.status(400).json({
        success: false,
        message: 'Payment reference is required'
      });
    }
    
    console.log('Checking status for transaction_request_id:', transaction_request_id);
    
    const { data: transaction, error: dbError } = await supabase
      .from('transactions')
      .select('*')
      .eq('transaction_request_id', transaction_request_id)
      .maybeSingle();
    
    if (dbError) {
      console.error('Database query error:', dbError);
      return res.status(500).json({
        success: false,
        message: 'Error checking payment status',
        error: dbError.message || String(dbError)
      });
    }
    
    console.log('Transaction found:', transaction ? 'YES' : 'NO');
    if (transaction) {
      console.log('Transaction status:', transaction.status);
    }
    
    if (transaction) {
      console.log(`Payment status found for ${transaction_request_id}:`, transaction);
      
      let paymentStatus = 'pending';
      if (transaction.status === 'success' || transaction.status === 'completed') {
        paymentStatus = 'success';
      } else if (transaction.status === 'failed' || transaction.status === 'cancelled') {
        paymentStatus = 'failed';
      }
      
      // If status is still pending, query Safaricom M-Pesa API as fallback
      if (paymentStatus === 'pending') {
        console.log(`Status is pending, querying Safaricom M-Pesa API for ${transaction_request_id}`);
        try {
          const token = await getMpesaToken();
          if (token) {
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
                CheckoutRequestID: transaction_request_id,
                Timestamp: timestamp,
                Password: password
              })
            });

            const safaricomData = await safaricomResponse.json();
            console.log('Safaricom M-Pesa query response:', JSON.stringify(safaricomData, null, 2));
            
            if (safaricomResponse.ok && safaricomData.ResultCode === '0') {
              console.log(`Safaricom confirmed payment success for ${transaction_request_id}, updating database`);
              
              // Update transaction to success
              const { data: updatedTransaction, error: updateError } = await supabase
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
                .eq('id', transaction.id)
                .select();
              
              if (!updateError && updatedTransaction && updatedTransaction.length > 0) {
                paymentStatus = 'success';
                console.log(`Transaction ${transaction_request_id} updated to success:`, updatedTransaction[0]);
              } else if (updateError) {
                console.error('Error updating transaction:', updateError);
              }
            }
          }
        } catch (safaricomError) {
          console.error('Error querying Safaricom M-Pesa:', safaricomError);
          // Continue with local status if Safaricom query fails
        }
      }
      
      return res.status(200).json({
        success: true,
        payment: {
          status: paymentStatus,
          amount: transaction.amount,
          phoneNumber: transaction.phone_number,
          mpesaReceiptNumber: transaction.mpesa_response?.MpesaReceiptNumber,
          resultDesc: transaction.mpesa_response?.ResultDesc,
          resultCode: transaction.mpesa_response?.ResultCode,
          timestamp: transaction.updated_at
        }
      });
    } else {
      console.log(`Payment status not found for ${transaction_request_id}, still pending`);
      
      return res.status(200).json({
        success: true,
        payment: {
          status: 'pending',
          message: 'Payment is still being processed'
        }
      });
    }
  } catch (error) {
    console.error('Payment status check error:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Failed to check payment status',
      error: error.message || String(error)
    });
  }
};
