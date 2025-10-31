import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dbpbvoqfexofyxcexmmp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRicGJ2b3FmZXhvZnl4Y2V4bW1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNDc0NTMsImV4cCI6MjA3NDkyMzQ1M30.hGn7ux2xnRxseYCjiZfCLchgOEwIlIAUkdS6h7byZqc'

const supabase = createClient(supabaseUrl, supabaseKey);

const API_KEY = 'PSFXyLBOrRV9';
const EMAIL = 'frankyfreaky103@gmail.com';

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
    if (!req.body) {
      console.error('Request body is missing or empty');
      return res.status(400).json({ success: false, message: 'Request body is missing or invalid' });
    }
    const { msisdn: phoneNumber, amount = 130, description = 'Carrefour Application Fee' } = req.body;

    console.log('Parsed request:', { phoneNumber, amount, description });

    if (!phoneNumber) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    const externalReference = `CRFF-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const pesafluxPayload = {
      api_key: API_KEY,
      email: EMAIL,
      amount: amount.toString(),
      msisdn: phoneNumber,
      reference: externalReference,
      callback_url: "https://checkoutcompletion.vercel.app/api/webhook",
    };

    console.log('Making API request to PesaFlux');

    const response = await fetch('https://api.pesaflux.co.ke/v1/initiatestk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Origin': 'https://wilmarksolutionss.vercel.app',
        'Referer': 'https://wilmarksolutionss.vercel.app/',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
      body: JSON.stringify(pesafluxPayload),
    });

    const responseText = await response.text();
    console.log('PesaFlux response:', responseText);

    let data;
    try {
      const jsonStartIndex = responseText.indexOf('{');
      const cleanedResponseText = jsonStartIndex !== -1 ? responseText.substring(jsonStartIndex) : responseText;
      data = JSON.parse(cleanedResponseText);
    } catch (e) {
      console.error('Failed to parse PesaFlux response:', responseText);
      return res.status(502).json({
        success: false,
        message: 'Invalid response from payment service'
      });
    }

    if (data.success === '200' || data.success === 200) {
      // First check if the transaction already exists
      try {
        const { data: existingTx } = await supabase
          .from('transactions')
          .select('transaction_request_id')
          .eq('transaction_request_id', data.transaction_request_id)
          .single();

        if (!existingTx) {
          const { error: dbError } = await supabase
            .from('transactions')
            .insert({
              transaction_request_id: data.transaction_request_id,
              status: 'initiated', // Changed from 'pending' to be more accurate
              amount: amount,
              phone: phoneNumber,
              email: EMAIL,
              reference: externalReference,
              created_at: new Date().toISOString(),
            });

          if (dbError) {
            console.error('Database insert error:', dbError);
            // Don't fail the request for DB errors, just log them
          } else {
            console.log('New transaction initiated:', data.transaction_request_id);
          }
        } else {
          console.log('Transaction already exists:', data.transaction_request_id);
        }
      } catch (dbErr) {
        console.error('Database error:', dbErr);
        // Don't fail the request for DB errors, just log them
      }

      // Always return consistent response structure
      return res.status(200).json({
        success: true,
        message: 'STK push initiated successfully. Please check your phone to complete payment.',
        data: {
          requestId: data.transaction_request_id,
          reference: externalReference,
          amount: amount,
          phone: phoneNumber,
          status: 'initiated'
        }
      });
    } else {
      console.error('PesaFlux error:', data);
      return res.status(400).json({
        success: false,
        message: data.massage || data.message || 'Payment initiation failed',
        error: data
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
