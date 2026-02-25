# SwiftPay Integration Guide for CARREFOURKENYA

## 1. Overview
This document outlines the integration of the SwiftPay payment system into the CARREFOURKENYA web application. The system is designed to handle M-Pesa payments for job application fees, replacing the previous Pesaflux integration.

## 2. SwiftPay Credentials
- **API Key:** `sp_25c79c9c-5980-410e-b8e6-b223796c55a6`
- **Till ID:** `dbdedaea-11d8-4bbe-b94f-84bbe4206d3c`
- **Backend URL:** `https://swiftpay-backend-uvv9.onrender.com/api`

## 3. API Endpoints

### Initiate Payment
- **Endpoint:** `POST /api/initiate-payment`
- **Description:** Triggers an STK push to the user's phone to begin the payment process.
- **Request Body:**
  ```json
  {
    "msisdn": "0712345678",
    "amount": 139,
    "description": "Carrefour Application Fee"
  }
  ```
- **Success Response:**
  ```json
  {
    "success": true,
    "message": "Payment initiated successfully",
    "data": {
      "externalReference": "CARREFOUR-1702566000000",
      "checkoutRequestId": "CARREFOUR-1702566000000"
    }
  }
  ```

### Check Payment Status
- **Endpoint:** `GET /api/payment-status?reference=<reference>`
- **Description:** Used to poll for the status of a transaction after it has been initiated.
- **Success Response:**
  ```json
  {
    "success": true,
    "payment": {
      "status": "SUCCESS", // Can be PENDING, SUCCESS, or FAILED
      "amount": 139,
      "phoneNumber": "254712345678",
      "mpesaReceiptNumber": "RCI...",
      "provider": "swiftpay"
    }
  }
  ```

### Submit Application
- **Endpoint:** `POST /api/submit-application`
- **Description:** Submits the user's application details to the database after payment is confirmed.
- **Request Body:**
  ```json
  {
    "phone": "0712345678",
    "userId": "user123",
    "paymentReference": "CARREFOUR-1702566000000"
  }
  ```

## 4. Phone Number Handling
The `initiate-payment` endpoint includes a normalization function that automatically converts phone numbers from `07...` format to the required `254...` format. This ensures a seamless user experience regardless of the input format.

## 5. Frontend Integration Flow
1.  The user completes their application on the frontend.
2.  A call is made to `/api/initiate-payment` to start the payment process.
3.  The frontend receives a `checkoutRequestId` and begins polling `/api/payment-status`.
4.  The user confirms the payment on their phone via an M-Pesa STK push.
5.  Once the polling returns a `SUCCESS` status, the frontend submits the application by calling `/api/submit-application`.
6.  The user is notified of the successful submission.

## 6. Database and Deployment
- **Database:** The integration uses the existing `transactions` and `applications` tables in Supabase. A `payment_provider` column is used to identify transactions processed by SwiftPay.
- **Deployment:** The API routes are set up as serverless functions and are deployed via Vercel. Pushing to the designated GitHub repository will trigger a new deployment.
