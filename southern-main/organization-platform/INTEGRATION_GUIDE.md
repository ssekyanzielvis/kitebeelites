# Complete Payment Integration Guide

This guide walks you through every step needed to integrate MTN Mobile Money, Airtel Money, and Credit/Debit Card payments into your donation platform.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Part 1: Supabase Setup](#part-1-supabase-setup)
3. [Part 2: MTN Mobile Money Setup](#part-2-mtn-mobile-money-setup)
4. [Part 3: Airtel Money Setup](#part-3-airtel-money-setup)
5. [Part 4: Flutterwave Card Payment Setup](#part-4-flutterwave-card-payment-setup)
6. [Part 5: Configure Environment Variables](#part-5-configure-environment-variables)
7. [Part 6: Testing the Integration](#part-6-testing-the-integration)
8. [Part 7: Going to Production](#part-7-going-to-production)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- Node.js installed (v18 or higher)
- Active internet connection
- Email address for account registrations
- Phone number (for verification)
- Windows PowerShell or Command Prompt

---

## Part 1: Supabase Setup

### Step 1.1: Get Your Supabase Credentials

If you already have Supabase configured, skip to Part 2. Otherwise:

1. **Go to:** https://supabase.com
2. **Sign in** or create an account
3. **Open your project** (or create a new one)
4. **Get your credentials:**
   - Click on ⚙️ **Settings** (bottom left)
   - Click **API** in the sidebar
   - Copy these values:
     - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
     - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - **service_role** key (click "Reveal" first) → `SUPABASE_SERVICE_ROLE_KEY`

5. **Save these somewhere safe** - you'll need them later

---

## Part 2: MTN Mobile Money Setup

### Step 2.1: Create MTN MoMo Developer Account

1. **Go to:** https://momodeveloper.mtn.com
2. **Click "Register"** (top right)
3. **Fill in the registration form:**
   - Email address
   - Password
   - Country: **Uganda**
   - Accept terms and conditions
4. **Verify your email** (check inbox/spam)
5. **Log in** to the developer portal

### Step 2.2: Subscribe to Collections Product

1. **In the MTN Developer Portal:**
   - Click on **"Products"** in the top menu
   - Find **"Collections"** (this is for receiving payments)
   - Click **"Subscribe"**

2. **Complete the subscription:**
   - Read the terms
   - Click **"Subscribe"** to confirm

3. **Get your Subscription Key:**
   - Go to **"Profile"** → **"Subscriptions"**
   - Under **Collections**, you'll see **Primary key** and **Secondary key**
   - **Copy the Primary key** and save it as: `MTN_MOMO_SUBSCRIPTION_KEY`

### Step 2.3: Create API User and API Key

MTN requires you to create an API user using their API. Here's how:

#### Option A: Using PowerShell (Recommended for Windows)

1. **Open PowerShell** (search for it in Windows)

2. **Generate a UUID:**
   ```powershell
   $uuid = [guid]::NewGuid().ToString()
   Write-Host "Your UUID: $uuid"
   Write-Host "Save this UUID somewhere safe!"
   ```
   **Copy this UUID** - you'll need it multiple times

3. **Set your subscription key:**
   ```powershell
   $subscriptionKey = "YOUR_SUBSCRIPTION_KEY_HERE"
   ```
   Replace `YOUR_SUBSCRIPTION_KEY_HERE` with the key you copied in Step 2.2

4. **Create API User:**
   ```powershell
   curl.exe -X POST "https://sandbox.momodeveloper.mtn.com/v1_0/apiuser" `
     -H "X-Reference-Id: $uuid" `
     -H "Ocp-Apim-Subscription-Key: $subscriptionKey" `
     -H "Content-Type: application/json" `
     -d '{\"providerCallbackHost\": \"webhook.site\"}'
   ```
   
   **Expected response:** Status 201 Created (no body)

5. **Generate API Key:**
   ```powershell
   curl.exe -X POST "https://sandbox.momodeveloper.mtn.com/v1_0/apiuser/$uuid/apikey" `
     -H "Ocp-Apim-Subscription-Key: $subscriptionKey"
   ```
   
   **Expected response:** Something like:
   ```json
   {"apiKey":"b1d2c3a4e5f6g7h8i9j0k1l2m3n4o5p6"}
   ```

6. **Save your credentials:**
   - The **UUID** from step 2 → `MTN_MOMO_API_USER`
   - The **apiKey** from step 5 → `MTN_MOMO_API_KEY`
   - The **Subscription Key** from Step 2.2 → `MTN_MOMO_SUBSCRIPTION_KEY`

#### Option B: Using Online API Testing Tool

If PowerShell doesn't work, use Postman or https://reqbin.com:

1. **Generate a UUID** at https://www.uuidgenerator.net/ (save it)

2. **Create API User:**
   - Method: `POST`
   - URL: `https://sandbox.momodeveloper.mtn.com/v1_0/apiuser`
   - Headers:
     ```
     X-Reference-Id: YOUR_UUID_HERE
     Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY
     Content-Type: application/json
     ```
   - Body:
     ```json
     {"providerCallbackHost": "webhook.site"}
     ```

3. **Generate API Key:**
   - Method: `POST`
   - URL: `https://sandbox.momodeveloper.mtn.com/v1_0/apiuser/YOUR_UUID_HERE/apikey`
   - Headers:
     ```
     Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY
     ```
   - Copy the returned `apiKey`

### Step 2.4: Verify Your Credentials

Test that your credentials work:

```powershell
# Set your credentials
$uuid = "YOUR_UUID"
$apiKey = "YOUR_API_KEY"
$subscriptionKey = "YOUR_SUBSCRIPTION_KEY"

# Get access token
$auth = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${uuid}:${apiKey}"))

curl.exe -X POST "https://sandbox.momodeveloper.mtn.com/collection/token/" `
  -H "Authorization: Basic $auth" `
  -H "Ocp-Apim-Subscription-Key: $subscriptionKey"
```

**Expected response:** An access token (means it's working!)

---

## Part 3: Airtel Money Setup

### Step 3.1: Create Airtel Developer Account

1. **Go to:** https://developers.airtel.africa
2. **Click "Get Started" or "Sign Up"**
3. **Fill in registration details:**
   - Full name
   - Email address
   - Company name (your organization name)
   - Country: **Uganda**
   - Phone number
4. **Verify your email** (check inbox)
5. **Log in** to the developer portal

### Step 3.2: Create an Application

1. **In the Airtel Developer Dashboard:**
   - Click **"Create App"** or **"My Apps"** → **"Create New App"**

2. **Fill in app details:**
   - **App Name:** Your Organization Donations
   - **Description:** Donation payment processing
   - **Category:** Payments
   - **Country:** Uganda
   - **Select APIs:** Check **"Payment"** or **"Disbursement & Collections"**

3. **Submit the application**

### Step 3.3: Get Your Credentials

1. **After app approval** (usually instant for sandbox):
   - Go to **"My Apps"**
   - Click on your app name

2. **Find your credentials:**
   - **Client ID** → Copy this as `AIRTEL_CLIENT_ID`
   - **Client Secret** → Copy this as `AIRTEL_CLIENT_SECRET`

3. **Note the environment:**
   - For testing: Use **UAT/Sandbox** base URL
   - For production: Use **Production** base URL

### Step 3.4: Test Your Credentials

You can test using PowerShell:

```powershell
$clientId = "YOUR_CLIENT_ID"
$clientSecret = "YOUR_CLIENT_SECRET"

curl.exe -X POST "https://openapiuat.airtel.africa/auth/oauth2/token" `
  -H "Content-Type: application/json" `
  -d "{\"client_id\":\"$clientId\",\"client_secret\":\"$clientSecret\",\"grant_type\":\"client_credentials\"}"
```

**Expected response:** An access token (means it's working!)

---

## Part 4: Flutterwave Card Payment Setup

### Step 4.1: Create Flutterwave Account

1. **Go to:** https://flutterwave.com
2. **Click "Get Started"** or **"Sign Up"**
3. **Fill in registration details:**
   - Business name (your organization name)
   - Email address
   - Phone number
   - Country: **Uganda**
   - Business type: **NGO/Non-profit** (or appropriate type)
4. **Verify your email** (check inbox)
5. **Complete profile setup**

### Step 4.2: Get Your API Keys

1. **Log in to Flutterwave Dashboard:** https://dashboard.flutterwave.com
2. **Navigate to Settings:**
   - Click on **Settings** (gear icon in sidebar)
   - Select **API** from the menu

3. **Get Test Keys** (for development):
   - Find **Test** section
   - Copy **Public Key** (starts with `FLWPUBK_TEST-`) → `FLUTTERWAVE_PUBLIC_KEY`
   - Copy **Secret Key** (starts with `FLWSECK_TEST-`) → `FLUTTERWAVE_SECRET_KEY`

4. **Get Production Keys** (for live payments - later):
   - Complete business verification first
   - Find **Live** section
   - Copy **Public Key** and **Secret Key**

### Step 4.3: Set Up Webhook

Webhooks notify your app when payments are completed:

1. **In Flutterwave Dashboard:**
   - Go to **Settings** → **Webhooks**

2. **Add Webhook URL:**
   - **Webhook URL:** `https://your-domain.com/api/payments/card/webhook`
   - For local testing: Use **ngrok** or **localhost.run**

3. **Generate Secret Hash:**
   - Flutterwave will show you a **Secret Hash**
   - Copy this → `FLUTTERWAVE_WEBHOOK_SECRET`

4. **Select Events:**
   - Check **charge.completed**
   - Save webhook settings

### Step 4.4: Configure Payment Settings

1. **In Dashboard, go to Settings → Payment:**
   - Enable **Card Payments** (Visa, Mastercard, Verve)
   - Enable **Bank Transfer** (optional)
   - Enable **Mobile Money** (MTN, Airtel via Flutterwave - optional backup)

2. **Currency Settings:**
   - Ensure **UGX (Ugandan Shilling)** is enabled

3. **Settlement:**
   - Add your **bank account** for receiving funds
   - Set settlement frequency (daily, weekly, etc.)

### Step 4.5: Test Your Credentials

Test using PowerShell:

```powershell
$secretKey = "YOUR_FLUTTERWAVE_SECRET_KEY"

curl.exe -X GET "https://api.flutterwave.com/v3/balances" `
  -H "Authorization: Bearer $secretKey"
```

**Expected response:** Your account balances (means it's working!)

### Step 4.6: Test Card Numbers

For testing, Flutterwave provides test cards:

**Successful Payment:**
- Card Number: `5531886652142950`
- CVV: `564`
- Expiry: `09/32`
- PIN: `3310`
- OTP: `12345`

**Insufficient Funds:**
- Card Number: `5531886652142950`
- CVV: `564`
- Expiry: `09/32`
- PIN: `3310`
- OTP: `12345` (but different response)

---

## Part 5: Configure Environment Variables

### Step 5.1: Create `.env.local` File

1. **Navigate to your project folder:**
   ```powershell
   cd C:\Users\Vash\Desktop\southern\southern\organization-platform
   ```

2. **Create the file:**
   ```powershell
   notepad .env.local
   ```
   (Click "Yes" if asked to create a new file)

### Step 5.2: Add All Credentials

Copy and paste this template, then **replace all the placeholder values** with your actual credentials:

```env
# ===================================
# SUPABASE CONFIGURATION
# ===================================
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxxxxx

# ===================================
# MTN MOBILE MONEY API
# ===================================
# Subscription Key from MTN Developer Portal > Profile > Subscriptions
MTN_MOMO_SUBSCRIPTION_KEY=1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p

# API User UUID (the one you generated)
MTN_MOMO_API_USER=12345678-1234-1234-1234-123456789abc

# API Key (from the apikey endpoint response)
MTN_MOMO_API_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6

# Base URL (use sandbox for testing, production when live)
MTN_MOMO_BASE_URL=https://sandbox.momodeveloper.mtn.com

# Environment (sandbox or production)
MTN_MOMO_ENVIRONMENT=sandbox

# ===================================
# AIRTEL MONEY API
# ===================================
# Client ID from Airtel Developer Portal > My Apps
AIRTEL_CLIENT_ID=abc123def456ghi789

# Client Secret from Airtel Developer Portal > My Apps
AIRTEL_CLIENT_SECRET=xyz789abc123def456

# Base URL (UAT for testing, production when live)
AIRTEL_BASE_URL=https://openapiuat.airtel.africa

# ===================================
# FLUTTERWAVE PAYMENT GATEWAY
# ===================================
# Secret Key from Flutterwave Dashboard > Settings > API
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-X

# Public Key from Flutterwave Dashboard > Settings > API
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-X

# Base URL (same for test and production)
FLUTTERWAVE_BASE_URL=https://api.flutterwave.com/v3

# Webhook Secret Hash from Flutterwave Dashboard > Settings > Webhooks
FLUTTERWAVE_WEBHOOK_SECRET=your_webhook_secret_hash

# Your website URL (for redirects after payment)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Step 5.3: Save the File

1. **Save in Notepad:** File → Save
2. **Close Notepad**

### Step 5.4: Verify the File

```powershell
# Check if file exists
Test-Path .env.local

# View the file (make sure all values are filled)
Get-Content .env.local
```

**Important:** 
- Make sure there are **NO spaces** before or after the `=` sign
- Make sure **all placeholder values** are replaced with real credentials
- **Never commit this file to Git** (it's already in `.gitignore`)

---

## Part 6: Testing the Integration

### Step 6.1: Install Dependencies

```powershell
npm install
```

### Step 6.2: Start Development Server

```powershell
npm run dev
```

Wait for "Ready" message, then open: http://localhost:3000

### Step 6.3: Test the Donation Form

1. **Navigate to:** http://localhost:3000/donate

2. **Fill in the form:**
   - Name: Test Donor
   - Phone: 256700000000
   - Email: test@example.com
   - Amount: 5000

3. **Select Payment Method:**

   **For MTN Testing:**
   - Select "MTN Mobile Money"
   - Click "Complete Donation"
   - Check the browser console (F12 → Console tab)
   - Look for API responses

   **For Airtel Testing:**
   - Select "Airtel Money"
   - Click "Complete Donation"
   - Check the browser console

   **For Card Testing:**
   - Select "Credit/Debit Card"
   - Click "Complete Donation"
   - You'll be redirected to Flutterwave payment page
   - Use test card: `5531886652142950`
   - CVV: `564`, Expiry: `09/32`, PIN: `3310`, OTP: `12345`
   - Complete payment and verify redirect back

   **For Manual Testing:**
   - Select "Direct Transfer"
   - Should show payment numbers from admin panel

### Step 6.4: Monitor API Calls

Open **Browser DevTools** (press F12):

1. **Go to Network tab**
2. **Submit a donation**
3. **Look for:**
   - `/api/payments/initiate` - MTN/Airtel payments
   - `/api/payments/card/initiate` - Card payments
   - `/api/payments/status` - Payment status checks
   - `/api/payments/card/verify` - Card verification

4. **Check the Response:**
   ```json
   {
     "success": true,
     "message": "Payment initiated successfully...",
     "referenceId": "some-uuid",
     "status": "pending"
   }
   ```

### Step 6.5: Check Database

1. **Go to Supabase Dashboard**
2. **Table Editor → donations**
3. **Verify:**
   - New donation record created
   - `payment_status` = "processing" or "pending"
   - `payment_reference` has a value
   - `receipt_number` is auto-generated

### Step 6.6: Common Test Scenarios

#### Test 1: Successful MTN Payment
```
Phone: 256700000000
Amount: 5000
Expected: Payment initiated, status checked, donation created
```

#### Test 2: Successful Airtel Payment
```
Phone: 256750000000
Amount: 5000
Expected: Payment initiated, status checked, donation created
```

#### Test 3: Successful Card Payment
```
Card: 5531886652142950
CVV: 564
Expiry: 09/32
PIN: 3310
OTP: 12345
Expected: Redirect to Flutterwave, payment successful, redirect back
```
Expected: Payment initiated, status checked, donation created
```

#### Test 4: Invalid Phone Number
```
Phone: 1234567890
Expected: Error message shown
```

#### Test 5: Manual Transfer
```
Method: Direct Transfer
Expected: Shows payment numbers, donation created as "pending"
```

---

## Part 7: Going to Production

### Step 6.1: MTN Production Setup

1. **Apply for Production Access:**
   - Email: support@mtn.com or use developer portal support
   - Request to move from sandbox to production
   - Provide business details

2. **Complete KYC (Know Your Customer):**
   - Business registration documents
   - Tax identification
   - Bank account details

3. **Get Production Credentials:**
   - New subscription key
   - Create new API user for production
   - Get production API key

4. **Update `.env.local`:**
   ```env
   MTN_MOMO_BASE_URL=https://momodeveloper.mtn.com
   MTN_MOMO_ENVIRONMENT=production
   MTN_MOMO_SUBSCRIPTION_KEY=your_production_key
   MTN_MOMO_API_USER=your_production_uuid
   MTN_MOMO_API_KEY=your_production_api_key
   ```

### Step 6.2: Airtel Production Setup

1. **Request Production Access:**
   - Contact Airtel support through developer portal
   - Submit business documentation
   - Complete merchant onboarding

2. **Get Production Credentials:**
   - Production Client ID
   - Production Client Secret

3. **Update `.env.local`:**
   ```env
   AIRTEL_BASE_URL=https://openapi.airtel.africa
   AIRTEL_CLIENT_ID=your_production_client_id
   AIRTEL_CLIENT_SECRET=your_production_client_secret
   ```

### Step 7.3: Flutterwave Production Setup

1. **Complete Business Verification:**
   - In Flutterwave Dashboard, go to Settings → Business
   - Upload required documents (business registration, tax ID, etc.)
   - Add directors/beneficial owners
   - Provide bank account details
   - Submit for review (can take 1-3 business days)

2. **Get Live API Keys:**
   - After approval, go to Settings → API
   - Find **Live** section
   - Copy **Live Public Key** → `FLUTTERWAVE_PUBLIC_KEY`
   - Copy **Live Secret Key** → `FLUTTERWAVE_SECRET_KEY`

3. **Update Webhook:**
   - Go to Settings → Webhooks
   - Update URL to production domain
   - Ensure Secret Hash is saved

4. **Update `.env.local`:**
   ```env
   FLUTTERWAVE_SECRET_KEY=FLWSECK-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-X
   FLUTTERWAVE_PUBLIC_KEY=FLWPUBK-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-X
   NEXT_PUBLIC_BASE_URL=https://your-domain.com
   ```

### Step 7.4: Production Checklist

Before going live:

- [ ] Test all payment methods in sandbox
- [ ] Verify database updates correctly
- [ ] Test error handling (wrong phone, insufficient funds, card decline)
- [ ] Test card payment flow with test cards
- [ ] Set up error logging/monitoring
- [ ] Configure production environment variables
- [ ] Test webhooks are working
- [ ] Test with small real amounts first
- [ ] Set up customer support process
- [ ] Train staff on payment verification
- [ ] Set up receipt generation
- [ ] Configure automated bank transfers (settlement)
- [ ] Set up fraud monitoring (Flutterwave dashboard)
- [ ] Test payment redirects work correctly

### Step 7.5: Deploy to Vercel (Production)

1. **Add environment variables to Vercel:**
   - Go to Vercel Dashboard
   - Select your project
   - Settings → Environment Variables
   - Add all variables from `.env.local` (production values)

2. **Deploy:**
   ```powershell
   git add .
   git commit -m "Production payment integration"
   git push
   ```

3. **Verify deployment:**
   - Visit your production URL
   - Test with small real amounts
   - Monitor for errors

---

## Troubleshooting

### Issue: "Payment initiation failed"

**Possible causes:**
1. Wrong API credentials
2. API keys not active
3. Network issues

**Solutions:**
```powershell
# Verify MTN credentials
curl.exe -X POST "https://sandbox.momodeveloper.mtn.com/collection/token/" `
  -H "Authorization: Basic $([Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes('UUID:API_KEY')))" `
  -H "Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY"

# Verify Airtel credentials
curl.exe -X POST "https://openapiuat.airtel.africa/auth/oauth2/token" `
  -H "Content-Type: application/json" `
  -d '{"client_id":"YOUR_ID","client_secret":"YOUR_SECRET","grant_type":"client_credentials"}'
```

### Issue: "401 Unauthorized"

**Solutions:**
- Regenerate API keys
- Check subscription is active
- Verify UUID matches API key

### Issue: Payment timeout / No response

**Solutions:**
- Check phone number format (should be 256XXXXXXXXX)
- Verify sandbox mode is enabled
- Check MTN/Airtel service status
- Increase timeout in code if needed

### Issue: ".env.local not working"

**Solutions:**
```powershell
# Restart dev server
npm run dev

# Check file name (must be exactly .env.local)
Get-ChildItem .env*

# Verify no spaces in variables
Get-Content .env.local | Select-String "="
```

### Issue: "Cannot read environment variables"

**Solutions:**
1. Ensure `.env.local` is in project root
2. Restart dev server after changes
3. Check for typos in variable names
4. Verify no extra spaces around `=`

### Issue: Database errors

**Solutions:**
```powershell
# Check Supabase connection
# In browser console on your site:
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
```

### Issue: Card payment redirect not working

**Solutions:**
1. Check `NEXT_PUBLIC_BASE_URL` is set correctly
2. Verify Flutterwave redirect URL in dashboard
3. Ensure webhook URL is accessible (not localhost for production)
4. Check browser console for CORS errors

### Issue: Flutterwave "Invalid API Key"

**Solutions:**
- Ensure you're using the correct key (test vs live)
- Check no extra spaces in `.env.local`
- Regenerate API keys in Flutterwave dashboard
- Verify account is active

### Issue: Payment successful but webhook not received

**Solutions:**
1. Check webhook URL is publicly accessible
2. Verify Secret Hash matches
3. Test webhook with Flutterwave's webhook tester
4. Check server logs for webhook hits
5. For local testing, use **ngrok**:
   ```powershell
   ngrok http 3000
   # Use the ngrok URL in Flutterwave webhook settings
   ```

### Issue: Card payment failing

**Solutions:**
- Ensure card payments are enabled in Flutterwave dashboard
- Check UGX currency is supported
- Verify bank integration is active
- Test with Flutterwave test cards first
- Check transaction limits

### Get Help

- **MTN Support:** support@mtn.com | Developer forum
- **Airtel Support:** developers@airtel.africa | Support ticket in portal
- **Flutterwave Support:** developers@flutterwavego.com | Live chat in dashboard
- **Supabase:** https://supabase.com/docs | Discord community
- **Next.js:** https://nextjs.org/docs

---

## Summary Checklist

### Setup Phase
- [ ] Created Supabase project and got credentials
- [ ] Registered MTN Developer account
- [ ] Subscribed to MTN Collections
- [ ] Created MTN API User and Key
- [ ] Registered Airtel Developer account
- [ ] Created Airtel App and got credentials
- [ ] Registered Flutterwave account
- [ ] Got Flutterwave test API keys
- [ ] Set up Flutterwave webhook
- [ ] Created `.env.local` with all credentials
- [ ] Installed dependencies (`npm install`)

### Testing Phase
- [ ] Started dev server (`npm run dev`)
- [ ] Tested MTN payment in sandbox
- [ ] Tested Airtel payment in sandbox
- [ ] Tested card payment with test cards
- [ ] Tested payment verification and redirects
- [ ] Tested manual transfer option
- [ ] Verified database updates
- [ ] Checked error handling
- [ ] Reviewed browser console for errors
- [ ] Tested webhooks (using ngrok if local)

### Production Phase
- [ ] Applied for MTN production access
- [ ] Applied for Airtel production access
- [ ] Completed Flutterwave business verification
- [ ] Completed KYC verification for all providers
- [ ] Got production credentials from all providers
- [ ] Updated environment variables
- [ ] Updated webhook URLs to production domain
- [ ] Tested with small real amounts
- [ ] Set up payment monitoring
- [ ] Deployed to Vercel
- [ ] Set up monitoring and support

---

**Status Tracking:**
- 🟡 Sandbox: Ready to test with fake money and test cards
- 🟢 Production: Ready for real transactions
- 🔴 Not configured: Need to complete steps above

**Payment Methods:**
- MTN Mobile Money: Direct phone payment via USSD prompt
- Airtel Money: Direct phone payment via USSD prompt
- Cards: Visa, Mastercard, Verve via Flutterwave gateway
- Manual Transfer: Direct bank/mobile money transfer with manual verification

**Current Status:** 🟡 Sandbox (After completing Parts 1-5)

---

**Last Updated:** January 7, 2026  
**Document Version:** 2.0 (Added Card Payment Integration)
