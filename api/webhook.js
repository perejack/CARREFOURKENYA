import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dbpbvoqfexofyxcexmmp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRicGJ2b3FmZXhvZnl4Y2V4bW1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNDc0NTMsImV4cCI6MjA3NDkyMzQ1M30.hGn7ux2xnRxseYCjiZfCLchgOEwIlIAUkdS6h7byZqc'

const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      message: 'Method not allowed' 
    })
  }

  try {
    console.log('Webhook received:', req.body)
    
    const { transaction_request_id, status } = req.body

    if (!transaction_request_id) {
      return res.status(400).json({
        success: false,
        message: 'Missing transaction_request_id'
      })
    }

    // Update transaction in database
    const { error } = await supabase
      .from('transactions')
      .update({ 
        status, 
        updated_at: new Date().toISOString() 
      })
      .eq('transaction_request_id', transaction_request_id)

    if (error) {
      console.error('Database error:', error)
      return res.status(500).json({
        success: false,
        message: 'Error updating transaction'
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Webhook processed successfully'
    })
  } catch (error) {
    console.error('Webhook error:', error)
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}