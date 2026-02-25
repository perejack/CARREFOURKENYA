import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dbpbvoqfexofyxcexmmp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRicGJ2b3FmZXhvZnl4Y2V4bW1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNDc0NTMsImV4cCI6MjA3NDkyMzQ1M30.hGn7ux2xnRxseYCjiZfCLchgOEwIlIAUkdS6h7byZqc'

const supabase = createClient(supabaseUrl, supabaseKey);

// SwiftPay M-Pesa Verification Proxy
const MPESA_PROXY_URL = process.env.MPESA_PROXY_URL || 'https://swiftpay-backend-uvv9.onrender.com/api/mpesa-verification-proxy';
const MPESA_PROXY_API_KEY = process.env.MPESA_PROXY_API_KEY || 'carrefour-app';

// Query M-Pesa payment status via SwiftPay proxy (no credentials needed)
async function queryMpesaPaymentStatus(checkoutId) {
  try {
    console.log(`Querying M-Pesa status for ${checkoutId} via proxy`);
    
    const response = await fetch(MPESA_PROXY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        checkoutId: checkoutId,
        apiKey: MPESA_PROXY_API_KEY
      })
    });

    if (!response.ok) {
      console.error('Proxy response status:', response.status);
      const text = await response.text();
      console.error('Proxy response:', text);
      return null;
    }

    const data = await response.json();
    console.log('Proxy response:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('Error querying M-Pesa via proxy:', error.message);
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
    
    let transaction = null;
    try {
      const { data, error: dbError } = await supabase
        .from('transactions')
        .select('*')
        .eq('transaction_request_id', transaction_request_id)
        .maybeSingle();

      if (dbError) {
        console.error('Database query error:', dbError);
      }

      transaction = data || null;
    } catch (dbThrownError) {
      console.error('Database query exception:', dbThrownError);
      transaction = null;
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
      
      // If status is still pending, query M-Pesa via SwiftPay proxy
      if (paymentStatus === 'pending') {
        console.log(`Status is pending, querying M-Pesa via proxy for ${transaction_request_id}`);
        try {
          const proxyResponse = await queryMpesaPaymentStatus(transaction_request_id);

          if (proxyResponse?.success && proxyResponse?.payment?.status === 'success') {
            console.log(`Proxy confirmed payment success for ${transaction_request_id}, updating database`);
            
            // Update transaction to success
            const { data: updatedTransaction, error: updateError } = await supabase
              .from('transactions')
              .update({
                status: 'success'
              })
              .eq('id', transaction.id)
              .select();
            
            paymentStatus = 'success';

            if (!updateError && updatedTransaction && updatedTransaction.length > 0) {
              console.log(`Transaction ${transaction_request_id} updated to success:`, updatedTransaction[0]);
            } else if (updateError) {
              console.error('Error updating transaction:', updateError);
            }

          } else if (proxyResponse?.success && proxyResponse?.payment?.status === 'failed') {
            paymentStatus = 'failed';
            console.log(`Proxy confirmed payment failed for ${transaction_request_id}`);
          }
        } catch (proxyError) {
          console.error('Error querying M-Pesa via proxy:', proxyError);
          // Continue with local status if proxy query fails
        }
      }
      
      return res.status(200).json({
        success: true,
        payment: {
          status: paymentStatus,
          amount: transaction.amount,
          phoneNumber: transaction.phone,
          mpesaReceiptNumber: transaction.receipt_number || transaction.mpesa_response?.MpesaReceiptNumber,
          resultDesc: transaction.result_description || transaction.mpesa_response?.ResultDesc,
          resultCode: transaction.result_code || transaction.mpesa_response?.ResultCode,
          timestamp: transaction.updated_at
        }
      });
    } else {
      console.log(`Payment status not found for ${transaction_request_id}, still pending`);
      try {
        const proxyResponse = await queryMpesaPaymentStatus(transaction_request_id);

        if (proxyResponse?.success && proxyResponse?.payment?.status === 'success') {
          console.log(`Proxy confirmed payment success for ${transaction_request_id} (no DB row found)`);
          const receipt = proxyResponse.payment.receipt || null;
          const { error: upsertError } = await supabase
            .from('transactions')
            .upsert(
              {
                transaction_request_id: transaction_request_id,
                status: 'success',
                receipt_number: receipt,
                mpesa_response: proxyResponse.payment,
                payment_provider: 'swiftpay'
              },
              { onConflict: 'transaction_request_id' }
            );

          if (upsertError) {
            console.error('Error upserting successful transaction (proxy confirmed):', upsertError);
          }

          return res.status(200).json({
            success: true,
            payment: {
              status: 'success',
              mpesaReceiptNumber: receipt,
              resultDesc: proxyResponse.payment.resultDesc,
              resultCode: proxyResponse.payment.resultCode,
              timestamp: new Date().toISOString()
            }
          });
        }

        if (proxyResponse?.success && proxyResponse?.payment?.status === 'failed') {
          return res.status(200).json({
            success: true,
            payment: {
              status: 'failed',
              resultDesc: proxyResponse.payment.resultDesc,
              resultCode: proxyResponse.payment.resultCode,
              timestamp: new Date().toISOString()
            }
          });
        }
      } catch (proxyError) {
        console.error('Error querying M-Pesa via proxy (no DB row found):', proxyError);
      }
      
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

    return res.status(200).json({
      success: true,
      payment: {
        status: 'pending',
        message: 'Payment is still being processed'
      }
    });
  }
};
