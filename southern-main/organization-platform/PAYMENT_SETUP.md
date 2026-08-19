# Mobile Money Payment Integration Setup Guide

This guide explains how to set up automated mobile money payments with MTN Mobile Money and Airtel Money for the donation platform.

## Overview

The platform integrates with MTN MoMo and Airtel Money APIs to automatically:
- Send payment prompts directly to donors' phones
- Track payment status in real-time
- Update donation records automatically
- Generate receipts upon successful payment

## Prerequisites

### 1. MTN Mobile Money Developer Account
1. Visit [MTN MoMo Developer Portal](https://momodeveloper.mtn.com)
2. Create a developer account
3. Subscribe to the **Collections** product (for receiving payments)
4. Generate API credentials:
   - **Subscription Key**: Found in your subscription dashboard
   - **API User**: Create via the sandbox API
   - **API Key**: Generate for your API user

### 2. Airtel Money Developer Account
1. Visit [Airtel Developers Portal](https://developers.airtel.africa)
2. Register for a developer account
3. Subscribe to the **Payment** API
4. Get your credentials:
   - **Client ID**: From your app dashboard
   - **Client Secret**: From your app dashboard

## Setup Steps

### Step 1: Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Fill in your credentials in `.env.local`:

   ```env
   # MTN Mobile Money
   MTN_MOMO_SUBSCRIPTION_KEY=your_actual_subscription_key
   MTN_MOMO_API_USER=your_api_user_uuid
   MTN_MOMO_API_KEY=your_api_key
   MTN_MOMO_BASE_URL=https://sandbox.momodeveloper.mtn.com
   MTN_MOMO_ENVIRONMENT=sandbox

   # Airtel Money
   AIRTEL_CLIENT_ID=your_actual_client_id
   AIRTEL_CLIENT_SECRET=your_actual_client_secret
   AIRTEL_BASE_URL=https://openapiuat.airtel.africa
   ```

### Step 2: MTN MoMo Sandbox Setup

MTN requires creating an API user in the sandbox environment:

1. **Create API User**:
   ```bash
   curl -X POST https://sandbox.momodeveloper.mtn.com/v1_0/apiuser \
     -H "X-Reference-Id: YOUR_UUID" \
     -H "Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY" \
     -H "Content-Type: application/json" \
     -d '{"providerCallbackHost": "your-callback-url.com"}'
   ```

2. **Create API Key**:
   ```bash
   curl -X POST https://sandbox.momodeveloper.mtn.com/v1_0/apiuser/YOUR_UUID/apikey \
     -H "Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY"
   ```

3. Add the returned UUID and API key to your `.env.local`

### Step 3: Test the Integration

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Navigate to the donation page**: http://localhost:3000/donate

3. **Test MTN Payment**:
   - Select "MTN Mobile Money"
   - Enter amount (minimum 1000 UGX)
   - Fill in donor details
   - Use test phone number: `256700000000`
   - Click "Complete Donation"
   - Check console for API responses

4. **Test Airtel Payment**:
   - Select "Airtel Money"
   - Same process as MTN
   - Use test phone number: `256750000000`

### Step 4: Monitoring and Debugging

**Check payment status**:
- Open browser DevTools (F12)
- Go to Network tab
- Monitor API calls to `/api/payments/initiate` and `/api/payments/status`

**Common issues**:

1. **"Payment initiation failed"**
   - Check environment variables are set correctly
   - Verify API credentials are active
   - Check MTN/Airtel sandbox status

2. **"Payment timeout"**
   - Payment prompt may take 30-60 seconds
   - Ensure phone number format is correct (256XXXXXXXXX)
   - Check if sandbox is in test mode

3. **401 Unauthorized**
   - Regenerate API keys
   - Verify subscription is active
   - Check OAuth token generation

### Step 5: Going to Production

When ready to accept real payments:

1. **MTN Production**:
   ```env
   MTN_MOMO_BASE_URL=https://momodeveloper.mtn.com
   MTN_MOMO_ENVIRONMENT=production
   ```
   - Apply for production access
   - Complete KYC verification
   - Get production credentials

2. **Airtel Production**:
   ```env
   AIRTEL_BASE_URL=https://openapi.airtel.africa
   ```
   - Contact Airtel for production approval
   - Complete merchant onboarding
   - Switch to production credentials

3. **Important**:
   - Test thoroughly in sandbox first
   - Set up proper error logging
   - Monitor transactions closely
   - Have customer support ready

## API Flow

### Payment Initiation
1. User fills donation form
2. Frontend calls `/api/payments/initiate`
3. Backend creates donation record
4. Backend calls MTN/Airtel API to trigger payment
5. User receives payment prompt on phone
6. User approves with PIN

### Payment Verification
1. Backend automatically checks status every 10 seconds
2. Makes up to 12 attempts (2 minutes)
3. Updates donation status: `pending` → `processing` → `success/failed`
4. Notifies user of final status
5. Admin can generate receipt for successful payments

## Database Schema

Ensure your `donations` table has these columns:
```sql
- payment_status: text (pending, processing, success, failed)
- payment_reference: text (transaction reference)
- receipt_number: text (auto-generated)
- receipt_generated: boolean
```

## Security Considerations

1. **Never commit `.env.local`** to version control
2. Use **service role key** (not anon key) for API routes
3. Validate all inputs on the server side
4. Rate-limit payment initiation endpoints
5. Log all transactions for audit
6. Set up webhook verification (future enhancement)

## Support

**MTN MoMo**: support@mtn.com  
**Airtel Money**: developers@airtel.africa  
**Platform Issues**: Check application logs or contact admin

## Next Steps

1. Set up webhook endpoints for instant payment notifications
2. Add payment receipt email sending
3. Implement refund functionality
4. Add transaction reporting dashboard
5. Set up automated reconciliation

---

**Status**: ✅ Sandbox Ready | 🔄 Production Pending Setup
