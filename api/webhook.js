import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dbpbvoqfexofyxcexmmp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRicGJ2b3FmZXhvZnl4Y2V4bW1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNDc0NTMsImV4cCI6MjA3NDkyMzQ1M30.hGn7ux2xnRxseYCjiZfCLchgOEwIlIAUkdS6h7byZqc';

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
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

    // Update transaction in database - find by CheckoutRequestID in mpesa_response JSON
    const updateData = {
      status: normalizedStatus,
      updated_at: new Date().toISOString(),
      callback_data: payload
    };

    if (receiptNumber) {
      updateData.mpesa_response = {
        MpesaReceiptNumber: receiptNumber,
        ResultCode: resultCode,
        ResultDesc: resultDescription
      };
    }

    console.log(`Attempting to update transaction with checkout ${checkoutId} and data:`, updateData);

    const { data: updatedData, error } = await supabase
      .from('transactions')
      .update(updateData)
      .filter('mpesa_response->CheckoutRequestID', 'eq', checkoutId)
      .select();

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error updating transaction'
      });
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