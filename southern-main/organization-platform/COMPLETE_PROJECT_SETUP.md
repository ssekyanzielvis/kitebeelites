# 🚀 Complete Project Setup Guide

## Overview
This guide covers the complete setup of the Southern Organization Platform, including database, storage, and authentication.

---

## 📋 Prerequisites

Before you begin, ensure you have:

- ✅ Supabase account created
- ✅ New Supabase project created
- ✅ Supabase project URL and API keys
- ✅ Access to Supabase SQL Editor
- ✅ Node.js and npm installed
- ✅ Project cloned from repository

---

## 🎯 Quick Setup (3 Steps)

### Step 1: Configure Environment Variables

Create `.env.local` in the project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Southern Organization Platform

# Development Superadmin (REMOVE IN PRODUCTION!)
DEV_SUPERADMIN_EMAIL=abdulssekyanzi@gmail.com
DEV_SUPERADMIN_PASSWORD=Su4at3#0
ENABLE_DEV_BYPASS=true
```

**Get your Supabase credentials:**
1. Go to Supabase Dashboard
2. Select your project
3. Go to Settings → API
4. Copy Project URL and anon/public key

### Step 2: Run Complete Setup SQL

1. Open **Supabase SQL Editor**
2. Open the file: `lib/supabase/COMPLETE_SETUP.sql`
3. Copy the **entire file contents**
4. Paste into SQL Editor
5. Click **Run**

⏱️ This will take 10-30 seconds. It creates:
- ✅ All 19 database tables
- ✅ All 12 storage buckets  
- ✅ All RLS policies
- ✅ Indexes for performance
- ✅ Sample data
- ✅ Development superadmin account

### Step 3: Create Superadmin Auth User

**Option A: Via Supabase Dashboard (Recommended)**

1. Go to **Authentication** → **Users**
2. Click **Add User** → **Create new user**
3. Enter:
   - Email: `abdulssekyanzi@gmail.com`
   - Password: `Su4at3#0`
   - ✅ Auto Confirm User
   - ✅ Email Confirm
4. Click **Create User**

**Option B: Via SQL (Advanced)**

Run this in SQL Editor:
```sql
-- See DEV_SUPERADMIN_SETUP.md for the complete SQL
```

---

## ✅ Verify Setup

### Run Verification Script

1. Open **Supabase SQL Editor**
2. Open: `lib/supabase/VERIFY_SETUP.sql`
3. Run the script
4. Check that all items show ✅ PASS

### Test Login

1. Start development server:
   ```bash
   npm install
   npm run dev
   ```

2. Navigate to: `http://localhost:3000/admin/login`

3. Login with:
   - Email: `abdulssekyanzi@gmail.com`
   - Password: `Su4at3#0`

4. You should be redirected to `/admin/dashboard`

---

## 📁 Project Structure

```
organization-platform/
├── lib/supabase/
│   ├── COMPLETE_SETUP.sql          ⭐ Main setup script (RUN THIS)
│   ├── VERIFY_SETUP.sql            ✅ Verification script
│   ├── schema.sql                  📋 Database schema only
│   ├── storage-buckets.sql         💾 Storage setup only
│   ├── rls-policies.sql            🔒 Security policies only
│   ├── initial-data.sql            📝 Sample data only
│   └── migration-*.sql             🔄 Schema updates
├── MEDIA_UPLOAD_SETUP.md           📸 Media upload guide
├── DEV_SUPERADMIN_SETUP.md         👤 Superadmin setup guide
└── COMPLETE_PROJECT_SETUP.md       📚 This file
```

---

## 🗄️ Database Tables Created

The setup creates 19 tables:

| Table | Purpose |
|-------|---------|
| `admins` | Admin users |
| `site_settings` | Site configuration |
| `theme_settings` | Theme customization |
| `footer_info` | Footer content |
| `hello_slides` | Home page hero slides |
| `about_us` | About Us content |
| `vision` | Vision statement |
| `mission` | Mission statement |
| `objectives` | Organizational objectives |
| `programs` | Programs showcase |
| `achievements` | Achievement records |
| `core_values` | Core values display |
| `gallery` | Media gallery (images & videos) |
| `news` | News articles |
| `leadership` | Leadership profiles |
| `contact_submissions` | Contact form entries |
| `donations` | Donation records |
| `payment_settings` | Payment configuration |
| `analytics` | Site analytics data |

---

## 💾 Storage Buckets Created

12 dedicated storage buckets:

| Bucket | Max Size | Media Types | Purpose |
|--------|----------|-------------|---------|
| `hello-slides` | 10MB | Images & Videos | Hero slides |
| `about-us` | 10MB | Images | About content |
| `vision` | 10MB | Images | Vision section |
| `mission` | 10MB | Images | Mission section |
| `objectives` | 10MB | Images | Objectives |
| `programs` | 10MB | Images & Videos | Programs |
| `achievements` | 10MB | Images & Videos | Achievements |
| `core-values` | 10MB | Images | Core values |
| `gallery` | 20MB | Images & Videos | Main gallery |
| `news` | 10MB | Images & Videos | News articles |
| `leadership` | 5MB | Images | Leadership photos |
| `admin-profiles` | 2MB | Images | Admin avatars |

---

## 🔒 Security Features

### Row Level Security (RLS)

All tables have RLS enabled with policies:

- **Public Read:** Visitors can read active content
- **Public Write:** Contact forms, donations, analytics
- **Admin Full Access:** Authenticated admins have full CRUD

### Storage Security

- **Public Read:** Anyone can view uploaded files
- **Authenticated Write:** Only admins can upload/delete

---

## 📊 Sample Data Included

The setup includes sample data:

- 3 Hello Slides
- 2 About Us sections
- 1 Vision statement
- 1 Mission statement
- 3 Objectives
- 3 Programs (2 featured)
- 2 Achievements
- 3 Core Values
- Default theme settings
- Default footer info
- Payment settings template

---

## 🎨 Features Enabled

✅ **Admin Dashboard**
- User management
- Content management (CRUD)
- Theme customization
- Analytics tracking

✅ **Visitor Website**
- Home page with hero slides
- About page with Vision/Mission/Objectives
- Programs showcase
- Achievements gallery
- Core values display
- Media gallery (images & videos)
- News section
- Leadership profiles
- Contact form
- Donation system

✅ **Media Upload**
- Image & video support
- Drag & drop upload
- File type validation
- Size limits
- Preview functionality

✅ **Analytics**
- Auto-tracking visitor behavior
- Page views
- Device detection
- Geographic data

---

## 🔧 Configuration Options

### Theme Customization

Admins can customize:
- Background color
- Text color
- Primary color (default: blue)
- Font family

### Payment Methods

Configure via admin dashboard:
- MTN Mobile Money
- Airtel Money
- Manual payment instructions

---

## 📝 Development Workflow

### 1. Start Development

```bash
npm install
npm run dev
```

Access:
- Visitor site: `http://localhost:3000`
- Admin login: `http://localhost:3000/admin/login`

### 2. Create Content

1. Login as superadmin
2. Navigate to content management pages
3. Upload media using FileUpload component
4. Create/edit content
5. Preview on visitor site

### 3. Add More Admins

1. Go to Admin Dashboard → Users
2. Click "Add Admin"
3. Fill in details
4. New admin will be created in both:
   - `admins` table
   - Supabase Auth (if integrated)

---

## 🚨 Troubleshooting

### Issue: Tables not created

**Solution:**
- Check for SQL errors in Supabase SQL Editor
- Ensure you have permissions
- Try running sections individually

### Issue: Storage buckets not created

**Solution:**
```sql
-- Check existing buckets
SELECT * FROM storage.buckets;

-- Re-run storage section from COMPLETE_SETUP.sql
```

### Issue: Can't login as superadmin

**Solution:**
1. Verify auth user exists: Authentication → Users
2. Check admin record:
   ```sql
   SELECT * FROM admins WHERE email = 'abdulssekyanzi@gmail.com';
   ```
3. Reset password in Supabase Dashboard

### Issue: File upload fails

**Solution:**
1. Check bucket exists: Storage → Buckets
2. Verify RLS policies on `storage.objects`
3. Check file size limits
4. Verify MIME types allowed

### Issue: RLS blocking admin access

**Solution:**
```sql
-- Temporarily disable RLS for debugging
ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;

-- Re-enable after fixing
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
```

---

## 📚 Additional Resources

- **Media Upload Guide:** `MEDIA_UPLOAD_SETUP.md`
- **Superadmin Guide:** `DEV_SUPERADMIN_SETUP.md`
- **Project Documentation:** `documentation.txt`
- **Project Requirements:** `project.txt`

---

## 🚀 Deployment Checklist

Before deploying to production:

### 1. Remove Development Superadmin

```sql
-- Disable or delete development account
UPDATE admins SET is_active = false 
WHERE email = 'abdulssekyanzi@gmail.com';

DELETE FROM auth.users 
WHERE email = 'abdulssekyanzi@gmail.com';
```

### 2. Create Production Admin

Use Supabase Dashboard to create production admin with strong password

### 3. Update Environment Variables

```env
# Remove development bypass
ENABLE_DEV_BYPASS=false

# Update URLs
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 4. Enable Email Confirmation

- Supabase Dashboard → Authentication → Email Auth
- Enable "Confirm email"

### 5. Configure Email Templates

- Customize email templates in Supabase
- Set up SMTP (optional)

### 6. Test All Features

- ✅ Visitor pages
- ✅ Admin login
- ✅ Content CRUD
- ✅ File uploads
- ✅ Contact form
- ✅ Donations
- ✅ Analytics

---

## 📞 Support

For issues or questions:

1. Check troubleshooting section above
2. Review Supabase documentation
3. Check browser console for errors
4. Verify SQL scripts ran successfully

---

## ✅ Setup Checklist

Use this checklist to track your progress:

- [ ] Create Supabase project
- [ ] Configure `.env.local`
- [ ] Run `COMPLETE_SETUP.sql`
- [ ] Create superadmin auth user
- [ ] Run `VERIFY_SETUP.sql`
- [ ] Install npm dependencies
- [ ] Start development server
- [ ] Test admin login
- [ ] Test file upload
- [ ] Create sample content
- [ ] Verify visitor site works
- [ ] Review all admin pages
- [ ] Test contact form
- [ ] Test analytics tracking

---

## 🎉 You're All Set!

Your Southern Organization Platform is now fully configured and ready for development!

**Next steps:**
1. Customize the content through admin dashboard
2. Replace sample data with real content
3. Configure payment settings
4. Test all functionality
5. Deploy to production when ready

**Happy building! 🚀**
