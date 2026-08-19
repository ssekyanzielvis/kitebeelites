# Vercel Deployment Guide

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. Your Supabase project URL and API keys
3. Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Prepare Your Project

Your project is ready for deployment with the following configuration:
- `vercel.json` - Vercel configuration file
- `.env.local.example` - Environment variables template

## Step 2: Push to Git Repository

If you haven't already, push your code to a Git repository:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

## Step 3: Deploy on Vercel

### Option A: Using Vercel Dashboard (Recommended)

1. Go to https://vercel.com and sign in
2. Click "Add New Project"
3. Import your Git repository
4. Configure your project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `organization-platform`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)

5. Add Environment Variables:
   Click "Environment Variables" and add:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

6. Click "Deploy"

### Option B: Using Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Navigate to your project:
   ```bash
   cd organization-platform
   ```

3. Login to Vercel:
   ```bash
   vercel login
   ```

4. Deploy:
   ```bash
   vercel
   ```

5. Follow the prompts and add environment variables when asked

## Step 4: Configure Supabase

After deployment, you need to update your Supabase project settings:

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** > **URL Configuration**
3. Add your Vercel deployment URL to:
   - **Site URL**: `https://your-app.vercel.app`
   - **Redirect URLs**: Add `https://your-app.vercel.app/admin/**`

4. Update **Storage** CORS settings if needed:
   - Go to **Storage** > **Policies**
   - Ensure your Vercel domain is allowed

## Step 5: Test Your Deployment

1. Visit your deployed URL
2. Test the visitor pages
3. Login to admin dashboard at `/admin/login`
4. Test file uploads
5. Verify database operations

## Environment Variables Reference

| Variable | Description | Where to Find |
|----------|-------------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard > Settings > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Supabase Dashboard > Settings > API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (keep secret!) | Supabase Dashboard > Settings > API |

## Automatic Deployments

Once connected to Git, Vercel will automatically deploy:
- **Production**: Commits to `main` branch
- **Preview**: Pull requests and other branches

## Custom Domain (Optional)

1. Go to your Vercel project dashboard
2. Navigate to **Settings** > **Domains**
3. Add your custom domain
4. Update DNS records as instructed
5. Update Supabase redirect URLs with your custom domain

## Troubleshooting

### Build Errors
- Check build logs in Vercel dashboard
- Verify all environment variables are set correctly
- Ensure no TypeScript errors: `npm run build` locally

### Database Connection Issues
- Verify Supabase URL and keys are correct
- Check Supabase project is active
- Review RLS policies (currently disabled for development)

### Image Upload Issues
- Verify Storage bucket policies in Supabase
- Check CORS settings allow your Vercel domain
- Ensure service role key is set correctly

### Authentication Issues
- Add Vercel URL to Supabase redirect URLs
- Check admin credentials in database
- Verify session management is working

## Production Checklist

Before going live:
- [ ] Enable RLS policies on all tables
- [ ] Review and update security rules
- [ ] Set up proper admin roles
- [ ] Test all functionality on preview deployment
- [ ] Add custom domain
- [ ] Update Supabase redirect URLs
- [ ] Set up monitoring and analytics
- [ ] Review and optimize images
- [ ] Test on multiple devices
- [ ] Set up backups

## Support

For issues:
- Vercel Documentation: https://vercel.com/docs
- Supabase Documentation: https://supabase.com/docs
- Next.js Documentation: https://nextjs.org/docs
