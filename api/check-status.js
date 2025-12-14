import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dbpbvoqfexofyxcexmmp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRicGJ2b3FmZXhvZnl4Y2V4bW1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNDc0NTMsImV4cCI6MjA3NDkyMzQ1M30.hGn7ux2xnRxseYCjiZfCLchgOEwIlIAUkdS6h7byZqc'

const supabase = createClient(supabaseUrl, supabaseKey);

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
    
    console.log('Checking status for checkout_id:', transaction_request_id);
    
    const { data: allTransactions, error: dbError } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    
    if (dbError) {
      console.error('Database query error:', dbError);
      return res.status(500).json({
        success: false,
        message: 'Error checking payment status',
        error: dbError.message || String(dbError)
      });
    }
    
    console.log('Total transactions fetched:', allTransactions?.length);
    console.log('Looking for CheckoutRequestID:', transaction_request_id);
    
    // Log all transactions to see what we have
    if (allTransactions && allTransactions.length > 0) {
      console.log('Sample transaction mpesa_response:', JSON.stringify(allTransactions[0].mpesa_response, null, 2));
    }
    
    // Find transaction by CheckoutRequestID in mpesa_response JSON
    const transaction = allTransactions?.find(t => {
      const checkoutId = t.mpesa_response?.CheckoutRequestID;
      console.log(`Comparing: "${checkoutId}" === "${transaction_request_id}" ? ${checkoutId === transaction_request_id}`);
      return checkoutId === transaction_request_id;
    }) || null;
    
    if (transaction) {
      console.log(`Payment status found for ${transaction_request_id}:`, transaction);
      
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
