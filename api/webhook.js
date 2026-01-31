import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dbpbvoqfexofyxcexmmp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRicGJ2b3FmZXhvZnl4Y2V4bW1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNDc0NTMsImV4cCI6MjA3NDkyMzQ1M30.hGn7ux2xnRxseYCjiZfCLchgOEwIlIAUkdS6h7byZqc';

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Test endpoint to manually trigger webhook for debugging
  if (req.method === 'GET') {
    console.log('=== WEBHOOK TEST ENDPOINT ===');
    console.log('Query params:', req.query);
    
    const testCheckoutId = req.query.checkout_id || 'ws_CO_14122025170125069795704273';
    
    // Create a test payload
    req.body = {
      CheckoutRequestID: testCheckoutId,
      ResultCode: '0',
      ResultDesc: 'The service request has been processed successfully.',
      MpesaReceiptNumber: 'TEST123456',
      TransactionDate: new Date().toISOString(),
      PhoneNumber: '254795704273'
    };
    
    console.log('Test payload created:', req.body);
  }

  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ 
      success: false,
      message: 'Method not allowed' 
    });
  }

  try {
    console.log('=== WEBHOOK RECEIVED ===');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Payload:', JSON.stringify(req.body, null, 2));
    
    const payload = req.body;
    
    let checkoutId = payload.CheckoutRequestID || payload.checkout_id || payload.checkoutRequestId;
    let paymentStatus = payload.ResultCode === '0' ? 'success' : (payload.ResultCode ? 'failed' : 'pending');
    let receiptNumber = payload.MpesaReceiptNumber || null;
    let resultCode = payload.ResultCode || null;
    let resultDescription = payload.ResultDesc || null;

    if (!checkoutId) {
      console.error('Missing CheckoutRequestID in webhook payload');
      return res.status(400).json({
        success: false,
        message: 'Missing CheckoutRequestID'
      });
    }

    console.log(`Processing webhook for checkout ${checkoutId} with status ${paymentStatus}`);

    // Map various status formats to standard status
    let normalizedStatus = 'pending';
    if (paymentStatus === 'success' || paymentStatus === 'completed' || paymentStatus === 'SUCCESS') {
      normalizedStatus = 'success';
    } else if (paymentStatus === 'failed' || paymentStatus === 'FAILED') {
      normalizedStatus = 'failed';
    } else if (paymentStatus === 'cancelled' || paymentStatus === 'CANCELLED') {
      normalizedStatus = 'cancelled';
    }

    console.log(`Normalized status: ${normalizedStatus}`);

    // Find transaction by transaction_request_id (CheckoutRequestID)
    const { data: transactionToUpdate, error: findError } = await supabase
      .from('transactions')
      .select('*')
      .eq('transaction_request_id', checkoutId)
      .maybeSingle();

    if (findError) {
      console.error('Error fetching transaction:', findError);
      return res.status(500).json({
        success: false,
        message: 'Error finding transaction'
      });
    }

    if (!transactionToUpdate) {
      console.error(`Transaction not found for checkout ${checkoutId}`);
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Update transaction in database - just status
    console.log(`Attempting to update transaction ${transactionToUpdate.id} with status: ${normalizedStatus}`);

    // Update the transaction by ID
    const { data: updatedData, error } = await supabase
      .from('transactions')
      .update({ status: normalizedStatus })
      .eq('id', transactionToUpdate.id)
      .select();

    if (error) {
      console.error('Database error - code:', error.code);
      console.error('Database error - message:', error.message);
      console.error('Database error - details:', error.details);
      console.error('Full error:', JSON.stringify(error, null, 2));
      return res.status(500).json({
        success: false,
        message: 'Error updating transaction',
        error: error.message
      });
    }
    
    // Now update mpesa_response if we have receipt details
    if (receiptNumber && updatedData && updatedData.length > 0) {
      const { error: updateError } = await supabase
        .from('transactions')
        .update({
          mpesa_response: {
            ...(transactionToUpdate.mpesa_response || {}),
            MpesaReceiptNumber: receiptNumber,
            ResultCode: resultCode,
            ResultDesc: resultDescription
          }
        })
        .eq('id', transactionToUpdate.id);
      
      if (updateError) {
        console.error('Error updating mpesa_response:', updateError);
      } else {
        console.log('mpesa_response updated successfully');
      }
    }

    console.log(`Transaction ${checkoutId} updated successfully:`, updatedData);
    console.log(`=== WEBHOOK PROCESSED SUCCESSFULLY ===`);

    return res.status(200).json({
      success: true,
      message: 'Webhook processed successfully',
      checkoutId: checkoutId,
      status: normalizedStatus
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}