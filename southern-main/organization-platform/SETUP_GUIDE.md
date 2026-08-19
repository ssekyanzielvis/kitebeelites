# Southern Organization Platform - Complete Setup Guide

## Overview
Full-stack organization management platform with visitor website and admin dashboard.

**Tech Stack**: Next.js 16, TypeScript, Tailwind CSS 4, Supabase, Zustand

## Quick Start

### 1. Database Setup
1. Create Supabase project at supabase.com
2. Run SQL from `lib/supabase/schema.sql` in SQL Editor

### 2. Environment Variables
```bash
cp .env.example .env.local
```
Fill in:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY  
- SUPABASE_SERVICE_ROLE_KEY
- NEXTAUTH_SECRET

### 3. Install & Run
```bash
npm install
npm run dev
```

Visit http://localhost:3000

## Features Implemented

### Visitor Website ✅
- Dynamic Home page with all sections
- About, Programs, Achievements, Core Values pages
- Gallery with category filtering
- News page
- Leadership profiles
- Contact form with validation
- Donate page with multiple payment methods
- Responsive design
- Professional UI/UX

### Admin Dashboard ⏳ (Next Phase)
- Authentication system
- CRUD operations for all content
- Theme customization
- Analytics dashboard
- File upload management
- Admin user management

## Project Structure
```
organization-platform/
├── app/                    # Next.js pages
├── components/             # React components
├── lib/
│   ├── supabase/          # Database client & schema
│   ├── store.ts           # Zustand state management
│   └── utils.ts           # Helper functions
└── .env.local             # Environment variables
```

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

### Production Checklist
- [ ] Configure Supabase RLS policies
- [ ] Set up storage bucket for images
- [ ] Add custom domain (optional)
- [ ] Enable analytics
- [ ] Configure backup strategy

## Database Tables
- admins
- site_settings, theme_settings, footer_info
- hello_slides, about_us
- vision, mission, objectives
- programs, achievements, core_values
- gallery, news, leadership
- contact_submissions, donations
- payment_settings, analytics

## Security
- Environment variables protected
- Input validation with Zod
- SQL injection protection via Supabase client
- XSS protection with React
- RLS policies (to be configured)

## Next Steps for Completion

1. **Admin Authentication** - Login system with email/password
2. **Admin Dashboard** - Layout with sidebar navigation
3. **Content Management** - CRUD interfaces for all tables
4. **File Upload** - Image upload with Supabase Storage
5. **Theme Editor** - Customize colors, fonts
6. **Analytics** - Track visitors, submissions, donations
7. **Admin Management** - Register/manage admin users
8. **Receipt Generation** - PDF receipts for donations

## Documentation
See [documentation.txt](../documentation.txt) for complete requirements

## Support
Contact: dev@southern.org
