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
    console.log('Webhook received:', req.body);
    
    const payload = req.body;
    
    let transactionId = payload.transaction_request_id || payload.checkoutRequestId || payload.reference;
    let paymentStatus = payload.status || payload.payment_status || 'pending';
    let receiptNumber = payload.receipt_number || payload.mpesaReceiptNumber || null;
    let resultCode = payload.result_code || payload.resultCode || null;
    let resultDescription = payload.result_description || payload.resultDesc || null;

    if (!transactionId) {
      console.error('Missing transaction identifier in webhook payload');
      return res.status(400).json({
        success: false,
        message: 'Missing transaction identifier'
      });
    }

    console.log(`Processing webhook for transaction ${transactionId} with status ${paymentStatus}`);

    // Map various status formats to standard status
    let normalizedStatus = 'pending';
    if (paymentStatus === 'success' || paymentStatus === 'completed' || paymentStatus === 'SUCCESS') {
      normalizedStatus = 'success';
    } else if (paymentStatus === 'failed' || paymentStatus === 'FAILED') {
      normalizedStatus = 'failed';
    } else if (paymentStatus === 'cancelled' || paymentStatus === 'CANCELLED') {
      normalizedStatus = 'cancelled';
    }

    // Update transaction in database
    const updateData = {
      status: normalizedStatus,
      updated_at: new Date().toISOString()
    };

    if (receiptNumber) {
      updateData.receipt_number = receiptNumber;
    }
    if (resultCode) {
      updateData.result_code = resultCode;
    }
    if (resultDescription) {
      updateData.result_description = resultDescription;
    }

    const { error } = await supabase
      .from('transactions')
      .update(updateData)
      .eq('transaction_request_id', transactionId);

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error updating transaction'
      });
    }

    console.log(`Transaction ${transactionId} updated successfully with status ${normalizedStatus}`);

    return res.status(200).json({
      success: true,
      message: 'Webhook processed successfully',
      transactionId: transactionId,
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