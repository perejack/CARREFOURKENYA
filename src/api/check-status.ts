import type { VercelRequest, VercelResponse } from '@vercel/node'
import { supabase } from './_lib/supabase'

interface StatusRequest {
  api_key: string
  email: string
  transaction_request_id: string
}

interface PesaFluxStatusResponse {
  ResultCode?: string | number
  ResultDesc?: string
  TransactionReceipt?: string
  TransactionAmount?: number
  TransactionDate?: string
  Msisdn?: string
  MerchantRequestID?: string
  CheckoutRequestID?: string
  TransactionID?: string
  TransactionReference?: string
  TransactionStatus?: string
  TransactionCode?: string
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Parse request body
    const body: StatusRequest = req.body
    const { api_key, email, transaction_request_id } = body
    
    // Validate required fields
    if (!api_key || !email || !transaction_request_id) {
      return res.status(400).json({
        error: 'Missing required fields: api_key, email, transaction_request_id'
      })
    }

    console.log('Checking transaction status in database:', transaction_request_id)

    // Query database for transaction status
    const { data: transaction, error: dbError } = await supabase
      .from('transactions')
      .select('*')
      .eq('transaction_request_id', transaction_request_id)
      .single()

    if (dbError) {
      console.error('Database query error:', dbError)
      // If transaction not found, it might still be processing
      // Return pending status to keep polling
      return res.status(200).json({
        ResultCode: '200',
        ResultDesc: 'Transaction is pending',
        TransactionStatus: 'Pending',
        TransactionReceipt: 'N/A',
        TransactionAmount: null,
        TransactionDate: null,
        TransactionReference: null,
        Msisdn: null,
        MerchantRequestID: null,
        CheckoutRequestID: null,
        TransactionID: null,
      })
    }

    // Return the status data
    return res.status(200).json({
      ResultCode: transaction.status === 'success' ? '200' : (transaction.status === 'cancelled' ? '1032' : (transaction.status === 'pending' ? '200' : '1')),
      ResultDesc: transaction.result_description || (transaction.status === 'pending' ? 'Transaction is pending' : transaction.status),
      TransactionStatus: transaction.status === 'success' ? 'Completed' : (transaction.status === 'pending' ? 'Pending' : transaction.status),
      TransactionReceipt: transaction.receipt_number || 'N/A',
      TransactionAmount: transaction.amount,
      TransactionDate: transaction.transaction_date,
      TransactionReference: transaction.reference,
      Msisdn: transaction.phone,
      MerchantRequestID: transaction.merchant_request_id,
      CheckoutRequestID: transaction.checkout_request_id,
      TransactionID: transaction.transaction_id,
    })
  } catch (error) {
    console.error('Status check error:', error)
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}