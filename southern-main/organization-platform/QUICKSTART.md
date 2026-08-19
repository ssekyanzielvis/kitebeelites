# QUICK START GUIDE - Southern Organization Platform

## 🚀 Get Started in 5 Minutes

### Step 1: Setup Supabase Database

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project (choose a region close to you)
3. Wait for the project to initialize (~2 minutes)
4. Go to **SQL Editor** in the left sidebar
5. Click **"New Query"**
6. Copy and paste the contents of `lib/supabase/schema.sql`
7. Click **"Run"** to create all tables
8. Create another new query
9. Copy and paste the contents of `lib/supabase/initial-data.sql`
10. Click **"Run"** to insert sample data

### Step 2: Get Your Supabase Credentials

1. In your Supabase project, go to **Settings** (gear icon in sidebar)
2. Click **API** in the settings menu
3. Copy these values:
   - **Project URL** (starts with https://)
   - **anon public** key (long string)
   - **service_role** key (long string) - Click "Reveal" first

### Step 3: Configure Environment Variables

1. In VS Code, open the file `.env.local`
2. Replace the placeholder values:

```env
NEXT_PUBLIC_SUPABASE_URL=paste_your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=paste_your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=paste_your_service_role_key_here
```

3. For NEXTAUTH_SECRET, run this in terminal:
```bash
openssl rand -base64 32
```
Copy the output and paste it as the NEXTAUTH_SECRET value.

4. Save the file (Ctrl+S or Cmd+S)

### Step 4: Run the Application

Open the terminal in VS Code and run:

```bash
npm run dev
```

Wait for the build to complete (~30 seconds). You should see:
```
✓ Ready in X seconds
○ Local: http://localhost:3000
```

### Step 5: View Your Site

1. Open your browser
2. Go to: http://localhost:3000
3. You should see the homepage with sample data!

### Step 6: Access Admin Dashboard

1. Go to: http://localhost:3000/admin/login
2. Use these credentials:
   - **Email**: admin@southern.org
   - **Password**: admin123
3. Click "Sign In"
4. You'll be redirected to the admin dashboard

## 📱 What You Can Do Now

### Visitor Site (Public)
- ✅ View home page with all sections
- ✅ Browse programs, achievements, core values
- ✅ Check gallery with sample images
- ✅ Read news articles
- ✅ View leadership team
- ✅ Submit contact form
- ✅ Make donation (will save to database)

### Admin Dashboard (Requires Login)
- ✅ View dashboard statistics
- ✅ See all navigation options
- 🚧 CRUD operations (to be implemented)

## 🛠️ Next Development Tasks

The following admin pages need to be created:

1. **Content Management Pages**
   - `/admin/hello-slides` - Manage carousel images
   - `/admin/about` - Edit about content
   - `/admin/vision-mission` - Edit vision & mission
   - `/admin/objectives` - Manage objectives
   - `/admin/programs` - Manage programs
   - `/admin/achievements` - Manage achievements
   - `/admin/core-values` - Manage core values
   - `/admin/gallery` - Upload and manage gallery
   - `/admin/news` - Create and edit news
   - `/admin/leadership` - Manage leadership profiles

2. **Other Admin Pages**
   - `/admin/contacts` - View contact submissions & export CSV
   - `/admin/donations` - View donations & generate receipts
   - `/admin/analytics` - View website statistics
   - `/admin/theme` - Customize colors and fonts
   - `/admin/settings` - Edit footer and payment settings
   - `/admin/users` - Manage admin users

## 🎨 Customizing Your Site

### Change Organization Name
1. Login to Supabase dashboard
2. Go to **Table Editor**
3. Open `footer_info` table
4. Edit the `organization_name` field
5. Refresh your website to see changes

### Add Your Own Images
For now, the site uses placeholder images from Unsplash. To use your own:
1. Complete the file upload functionality (admin dashboard)
2. Or manually update image URLs in Supabase

### Change Colors
1. Login to admin dashboard
2. Go to Theme Settings (when implemented)
3. Or manually update in Supabase `theme_settings` table

## 🆘 Troubleshooting

### "Error connecting to database"
- Check your `.env.local` file has correct Supabase credentials
- Verify your Supabase project is active
- Check your internet connection

### "Page not loading"
- Make sure `npm run dev` is running in terminal
- Try refreshing the page
- Check terminal for error messages

### "Admin login not working"
- Verify you ran `initial-data.sql` to create admin user
- Check credentials: admin@southern.org / admin123
- Look for error messages in browser console (F12)

### "No data showing"
- Confirm you ran `initial-data.sql` script
- Check Supabase Table Editor to see if data exists
- Verify environment variables are correct

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Hook Form](https://react-hook-form.com/)
- [Zustand State Management](https://zustand-demo.pmnd.rs/)

## 🚢 Deploy to Production

When ready to deploy:

1. Push code to GitHub
2. Connect to Vercel (free)
3. Add environment variables
4. Deploy!

See `SETUP_GUIDE.md` for detailed deployment instructions.

## ✅ Checklist Before Development

- [ ] Supabase project created
- [ ] Database schema executed
- [ ] Initial data inserted
- [ ] Environment variables configured
- [ ] `npm install` completed
- [ ] Dev server running
- [ ] Can access homepage
- [ ] Can login to admin
- [ ] Sample data visible

## 💡 Tips

1. **Development**: Always run `npm run dev` before starting work
2. **Database**: Use Supabase Table Editor to view/edit data directly
3. **Errors**: Check both browser console and terminal for errors
4. **Git**: Commit your changes regularly
5. **Backup**: Supabase automatically backs up your database

## 📞 Need Help?

- Review `PROJECT_STATUS.md` for what's done and what's next
- Check `SETUP_GUIDE.md` for detailed setup
- Read `documentation.txt` for requirements
- Email: dev@southern.org (if support is available)

---

**You're all set! Start customizing your organization's website! 🎉**
