# Development Superadmin Setup Guide

## Overview
This guide explains how to set up a development superadmin account that bypasses standard authentication for the system administrator during development.

**Development Superadmin Credentials:**
- **Email:** abdulssekyanzi@gmail.com
- **Password:** Su4at3#0

---

## Setup Method 1: Using Supabase Dashboard (Recommended)

### Step 1: Create User in Supabase Auth
1. Go to your **Supabase Dashboard**
2. Navigate to **Authentication** → **Users**
3. Click **Add User** → **Create new user**
4. Fill in the details:
   - **Email:** `abdulssekyanzi@gmail.com`
   - **Password:** `Su4at3#0`
   - **Auto Confirm User:** ✅ Check this box
   - **Email Confirm:** ✅ Check this box
5. Click **Create User**

### Step 2: Add User to Admins Table
1. Go to **SQL Editor**
2. Run this query:

```sql
-- Insert the superadmin into admins table
INSERT INTO admins (full_name, email, password_hash, phone_number, is_active)
VALUES (
  'System Developer',
  'abdulssekyanzi@gmail.com',
  encode(digest('Su4at3#0', 'sha256'), 'hex'),
  '+256 700 000000',
  true
)
ON CONFLICT (email) DO UPDATE SET
  password_hash = encode(digest('Su4at3#0', 'sha256'), 'hex'),
  is_active = true;
```

### Step 3: Verify Setup
Run this query to confirm:

```sql
SELECT 
  a.id,
  a.full_name,
  a.email,
  a.is_active,
  u.email_confirmed_at
FROM admins a
LEFT JOIN auth.users u ON u.email = a.email
WHERE a.email = 'abdulssekyanzi@gmail.com';
```

You should see:
- Admin record exists ✅
- is_active = true ✅
- email_confirmed_at is not null ✅

---

## Setup Method 2: SQL Only (Alternative)

If you prefer to do everything via SQL, run this in **Supabase SQL Editor**:

```sql
-- Create user in auth.users table
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'abdulssekyanzi@gmail.com',
  crypt('Su4at3#0', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
)
ON CONFLICT (email) DO UPDATE SET
  encrypted_password = crypt('Su4at3#0', gen_salt('bf')),
  email_confirmed_at = NOW();

-- Create admin record
INSERT INTO admins (full_name, email, password_hash, phone_number, is_active)
VALUES (
  'System Developer',
  'abdulssekyanzi@gmail.com',
  encode(digest('Su4at3#0', 'sha256'), 'hex'),
  '+256 700 000000',
  true
)
ON CONFLICT (email) DO UPDATE SET
  password_hash = encode(digest('Su4at3#0', 'sha256'), 'hex'),
  is_active = true;
```

---

## Authentication Flow

### Standard Login Process
1. User enters email and password
2. Supabase Auth validates credentials
3. If valid, Supabase creates session
4. App checks if user exists in `admins` table
5. If admin record exists with `is_active = true`, grant access
6. Otherwise, deny access

### Development Superadmin Benefits
- **Always Active:** The `is_active` flag ensures this account cannot be deactivated
- **Password Recovery:** Can reset password through Supabase Auth
- **Full Access:** Has all admin privileges
- **Development Safe:** Can be removed before production deployment

---

## Testing the Setup

### 1. Test Login
1. Go to your app's login page: `/admin/login`
2. Enter:
   - Email: `abdulssekyanzi@gmail.com`
   - Password: `Su4at3#0`
3. Click **Login**
4. You should be redirected to `/admin/dashboard`

### 2. Verify Session
Check the browser console and look for:
```javascript
// You should see a valid session
supabase.auth.getSession()
```

### 3. Test Admin Access
- Navigate to different admin pages
- Try creating/editing content
- Verify all CRUD operations work

---

## Security Considerations

### Development Environment
- ✅ Use this account only in development
- ✅ Keep credentials secure
- ✅ Don't commit credentials to version control

### Production Deployment
Before deploying to production:

1. **Remove or Disable the Account:**
```sql
-- Disable the development superadmin
UPDATE admins 
SET is_active = false 
WHERE email = 'abdulssekyanzi@gmail.com';

-- Or delete it entirely
DELETE FROM admins WHERE email = 'abdulssekyanzi@gmail.com';
DELETE FROM auth.users WHERE email = 'abdulssekyanzi@gmail.com';
```

2. **Create Production Admin:**
```sql
-- Create a new admin with a strong password
-- Use Supabase Dashboard to create the auth user first, then:
INSERT INTO admins (full_name, email, password_hash, phone_number, is_active)
VALUES (
  'Production Admin',
  'admin@yourdomain.com',
  encode(digest('STRONG_PRODUCTION_PASSWORD', 'sha256'), 'hex'),
  '+256 XXX XXXXXX',
  true
);
```

---

## Troubleshooting

### Issue: "Invalid login credentials"
**Solution:**
1. Verify the user exists in Supabase Auth Dashboard
2. Check if email is confirmed
3. Try resetting the password through Supabase Dashboard

### Issue: "User not found in admins table"
**Solution:**
```sql
-- Check if admin record exists
SELECT * FROM admins WHERE email = 'abdulssekyanzi@gmail.com';

-- If not, create it
INSERT INTO admins (full_name, email, password_hash, phone_number, is_active)
VALUES (
  'System Developer',
  'abdulssekyanzi@gmail.com',
  encode(digest('Su4at3#0', 'sha256'), 'hex'),
  '+256 700 000000',
  true
)
ON CONFLICT (email) DO UPDATE SET is_active = true;
```

### Issue: "Access denied"
**Solution:**
```sql
-- Ensure the admin is active
UPDATE admins 
SET is_active = true 
WHERE email = 'abdulssekyanzi@gmail.com';
```

### Issue: "Email not confirmed"
**Solution:**
1. Go to Supabase Dashboard → Authentication → Users
2. Find the user `abdulssekyanzi@gmail.com`
3. Click the menu → **Confirm email**

---

## Alternative: Environment Variable Bypass

For even easier development access, you can add an environment variable check in your auth middleware:

### Add to `.env.local`:
```env
# Development superadmin bypass
DEV_SUPERADMIN_EMAIL=abdulssekyanzi@gmail.com
DEV_SUPERADMIN_PASSWORD=Su4at3#0
ENABLE_DEV_BYPASS=true
```

### Update your auth check (optional):
```typescript
// In your auth middleware or login handler
if (process.env.ENABLE_DEV_BYPASS === 'true') {
  if (
    email === process.env.DEV_SUPERADMIN_EMAIL &&
    password === process.env.DEV_SUPERADMIN_PASSWORD
  ) {
    // Grant access without Supabase auth check
    // Create a session or JWT manually
    return { success: true, isSuperadmin: true };
  }
}

// Continue with normal Supabase Auth
```

⚠️ **Warning:** Remove this bypass code before production deployment!

---

## Quick Reference

**Login Credentials:**
```
Email: abdulssekyanzi@gmail.com
Password: Su4at3#0
```

**SQL to Create User:**
```sql
-- Run in Supabase SQL Editor after creating auth user
INSERT INTO admins (full_name, email, password_hash, phone_number, is_active)
VALUES (
  'System Developer',
  'abdulssekyanzi@gmail.com',
  encode(digest('Su4at3#0', 'sha256'), 'hex'),
  '+256 700 000000',
  true
)
ON CONFLICT (email) DO NOTHING;
```

**SQL to Verify:**
```sql
SELECT a.*, u.email_confirmed_at
FROM admins a
LEFT JOIN auth.users u ON u.email = a.email
WHERE a.email = 'abdulssekyanzi@gmail.com';
```

**SQL to Remove (before production):**
```sql
UPDATE admins SET is_active = false WHERE email = 'abdulssekyanzi@gmail.com';
DELETE FROM auth.users WHERE email = 'abdulssekyanzi@gmail.com';
```

---

## Next Steps

After setting up the superadmin:

1. ✅ Test login with the credentials
2. ✅ Verify admin dashboard access
3. ✅ Test creating/editing content
4. ✅ Create additional admin users through the dashboard
5. ✅ Before production: Remove or disable this account

**Happy Development! 🚀**
