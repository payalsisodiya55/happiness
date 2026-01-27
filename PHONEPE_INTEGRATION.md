# PhonePe Integration Guide for Chalo Sawari

This guide explains how to set up and use PhonePe payment gateway integration (v2.0.3 SDK) in the Chalo Sawari transportation booking platform.

## 🚀 Features

- **Secure Payment Processing**: Integrated with PhonePe's secure payment gateway (PG SDK Node v2.0.3)
- **Redirect-based Flow**: Securely redirects users to PhonePe's payment page
- **Server-to-Server Callback**: Automatic payment status updates via webhooks
- **Admin Payment Management**: Complete payment tracking and management in admin panel
- **Simulated Refunds**: Internal refund state management for admin operations
- **Payment Analytics**: Comprehensive payment statistics and reporting

## 📋 Prerequisites

1. **PhonePe Merchant Account**: Sign up at [phonepe.com/business](https://www.phonepe.com/business-solutions/payment-gateway/)
2. **API Credentials**:
   - Merchant ID
   - Client ID
   - Client Secret
3. **Node.js**: Version 18 or higher
4. **Environment Variables**: Configure necessary environment variables in `.env`

## 🔧 Setup Instructions

### 1. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install pg-sdk-node@https://phonepe.mycloudrepo.io/public/repositories/phonepe-pg-sdk-node/releases/v2/phonepe-pg-sdk-node-2.0.3.tgz
```

#### Environment Configuration
Update the `.env` file in the backend directory:

```env
# PhonePe Configuration
PHONEPE_MERCHANT_ID=your_merchant_id
PHONEPE_CLIENT_ID=your_client_id
PHONEPE_CLIENT_SECRET=your_client_secret
PHONEPE_CLIENT_VERSION=1
PHONEPE_ENV=SANDBOX # or PRODUCTION
BACKEND_URL=https://your-api.com
FRONTEND_URL=http://localhost:8080
```

#### Database Schema
The Payment model includes PhonePe-specific fields:

```javascript
paymentDetails: {
  // PhonePe specific fields
  phonePeMerchantOrderId: String,
  phonePeTransactionId: String,
  
  // Generic fields...
  gatewayResponse: mongoose.Schema.Types.Mixed
}
```

### 2. Frontend Setup

#### Environment Configuration
Update the `.env` file in the frontend directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api
```

## 🏗️ Architecture

### Backend Components

1. **PhonePeService** (`backend/services/phonePeService.js`)
   - Payment initiation (Standard Checkout)
   - Status checking
   - Callback verification

2. **Payment Controller** (`backend/controllers/paymentController.js`)
   - `initiatePhonePePayment` - Creates pending record and gets redirect URL
   - `handlePhonePeCallback` - Processes server-to-server notifications
   - `getPhonePePaymentStatus` - Public endpoint for frontend redirect landing page

3. **Payment Routes** (`backend/routes/payment.js`)
   - `POST /api/payments/initiate-phonepe` - Start payment
   - `POST /api/payments/phonepe-callback` - Callback (Public)
   - `GET /api/payments/status/:merchantOrderId` - Check status (Public)

### Frontend Components

1. **PhonePeService** (`frontend/src/services/phonePeService.ts`)
   - API calls to initiate payment
   - Redirection logic

2. **Checkout Component** (`frontend/src/components/Checkout.tsx`)
   - Payment method selection
   - PhonePe integration

3. **Payment Status Page** (`frontend/src/pages/PaymentStatus.tsx`)
   - Landing page after redirection
   - Shows Success/Failure/Processing state
   - Polling for final status

## 💳 Payment Flow

### 1. Initiation (Frontend -> Backend)
- Frontend calls `POST /api/payments/initiate-phonepe`
- Backend creates a `pending` payment record
- Backend calls PhonePe SDK to get redirection URL
- Backend returns redirect URL and `merchantOrderId`

### 2. Redirection (Frontend -> PhonePe)
- Frontend redirects user to the provided PhonePe URL
- User completes payment on PhonePe's secure page

### 3. Return (PhonePe -> Frontend)
- PhonePe redirects user back to `FRONTEND_URL/payment-status?merchantOrderId=...`
- Frontend shows "Processing" and polls backend for status

### 4. Callback (PhonePe -> Backend)
- PhonePe sends an asynchronous callback to `BACKEND_URL/api/payments/phonepe-callback`
- Backend verifies the callback and updates payment status to `completed` or `failed`
- Backend updates associated booking or wallet balance

## 🔐 Security Features

1. **OAuth2 Authentication**: Secure communication with PhonePe using Client ID/Secret
2. **Signature Verification**: Callbacks are verified to ensure they originate from PhonePe
3. **Redirect Validation**: Frontend validates payment status with backend, not just URL parameters
4. **Rate Limiting**: Protected initiation endpoints

## 📊 Admin Features

- **Transaction History**: View all PhonePe payments
- **Status Sync**: Refresh status from PhonePe dashboard if callback is missed
- **Refunds**: Administrative refund processing (internal status update)
- **Export**: Export PhonePe transaction IDs in CSV reports

## 🧪 Testing

### Sandbox Environment
1. Use `PHONEPE_ENV=SANDBOX`
2. PhonePe provides test mobile numbers and OTPs in their documentation
3. Use the `backend/scripts/test-payment-flow.js` to verify backend integration

## 🚀 Production Deployment

1. **Credentials**: Switch to live Merchant ID and Client Secret
2. **URL Configuration**:
   - Ensure `BACKEND_URL` is publicly accessible
   - Ensure `FRONTEND_URL` matches the production domain
3. **Whitelist**: Ensure PhonePe domains are allowed in your CSP (handled in `server.js`)

## 🔍 Troubleshooting

- **CORS Errors**: Check `server.js` CSP and CORS configuration
- **Callback Not Received**: Verify `BACKEND_URL` is correct and publicly reachable
- **Initiation Failed**: Check Client ID/Secret and Merchant ID in `.env`

---

**Note**: Always test thoroughly in sandbox before switching to production. Keep your API keys secure.
