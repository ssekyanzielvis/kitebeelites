# Media Upload & Storage Setup Guide

## Overview

The Southern Organization Platform now supports **both image and video uploads** for all media components. Each component uses its **own dedicated Supabase storage bucket** for better organization, security, and management.

---

## 🎯 Features

✅ **Dual Media Support**: Upload both images and videos
✅ **Dedicated Buckets**: Each component has its own storage bucket
✅ **File Upload Component**: Drag & drop file upload with preview
✅ **Type Validation**: Automatic validation of file types and sizes
✅ **Auto-Detection**: Media type automatically detected from file
✅ **Security**: Row Level Security (RLS) policies for all buckets

---

## 📦 Storage Buckets Configuration

### Bucket List & Specifications

| Bucket Name | Purpose | Max Size | Supported Formats |
|------------|---------|----------|-------------------|
| `hello-slides` | Home page hero slides | 10MB | Images & Videos |
| `about-us` | About Us content | 10MB | Images only |
| `vision` | Vision section | 10MB | Images only |
| `mission` | Mission section | 10MB | Images only |
| `objectives` | Objectives section | 10MB | Images only |
| `programs` | Programs showcase | 10MB | Images & Videos |
| `achievements` | Achievements gallery | 10MB | Images & Videos |
| `core-values` | Core values display | 10MB | Images only |
| `gallery` | Main gallery | **20MB** | Images & Videos |
| `news` | News articles | 10MB | Images & Videos |
| `leadership` | Leadership profiles | 5MB | Images only |
| `admin-profiles` | Admin user avatars | 2MB | Images only |

---

## 🚀 Setup Instructions

### Step 1: Run the Storage Buckets SQL Script

1. Open your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Open the file: `lib/supabase/storage-buckets.sql`
4. Copy and paste the entire SQL script
5. Click **Run** to execute

**What this does:**
- Creates all 12 storage buckets
- Sets up public read access
- Configures file size limits
- Defines allowed MIME types
- Applies Row Level Security (RLS) policies

### Step 2: Apply Gallery Media Type Migration

1. In **Supabase SQL Editor**
2. Open the file: `lib/supabase/migration-gallery-media-support.sql`
3. Copy and paste the SQL
4. Click **Run**

**What this does:**
- Adds `media_type` column to gallery table
- Renames `image_url` to `media_url`
- Sets default media_type to 'image'
- Adds constraints for media type validation

### Step 3: Verify Bucket Creation

Run this query in SQL Editor to verify all buckets:

```sql
SELECT id, name, public, file_size_limit, allowed_mime_types, created_at 
FROM storage.buckets 
ORDER BY name;
```

You should see 12 buckets listed.

### Step 4: Test Upload Functionality

1. Login to **Admin Dashboard**
2. Navigate to any media management page (e.g., Gallery, Programs, News)
3. Click **Add New** button
4. Use the file upload component to:
   - Drag & drop a file
   - Or click to browse and select
5. Verify:
   - File uploads successfully
   - Preview displays correctly
   - Media appears in the bucket

---

## 🎨 Component Usage

### FileUpload Component

The `FileUpload` component is used across all admin pages for media uploads.

**Props:**

```typescript
interface FileUploadProps {
  bucket: string;              // Supabase bucket name
  onUploadComplete: (url: string) => void; // Callback with public URL
  currentUrl?: string;          // Existing media URL for edit mode
  accept?: 'image' | 'video' | 'both'; // File type restriction
  maxSizeMB?: number;           // Maximum file size in MB
  label?: string;               // Label text
}
```

**Example Usage:**

```tsx
<FileUpload
  bucket="gallery"
  currentUrl={formData.media_url}
  onUploadComplete={(url) => setFormData({ ...formData, media_url: url })}
  accept="both"
  label="Media (Image or Video)"
  maxSizeMB={20}
/>
```

---

## 📋 Supported File Formats

### Images
- JPEG (`.jpg`, `.jpeg`)
- PNG (`.png`)
- WebP (`.webp`)
- GIF (`.gif`)
- SVG (`.svg`) - Gallery only

### Videos
- MP4 (`.mp4`)
- WebM (`.webm`)
- QuickTime (`.mov`)
- AVI (`.avi`) - Gallery only
- OGG (`.ogg`)

---

## 🔒 Security & Permissions

### Row Level Security (RLS) Policies

All buckets have the following RLS policies:

1. **Public Read Access**: Anyone can view files
2. **Authenticated Upload**: Only logged-in admins can upload
3. **Authenticated Update**: Only logged-in admins can update files
4. **Authenticated Delete**: Only logged-in admins can delete files

### Policy Configuration

```sql
-- Public read access
CREATE POLICY "Public Access"
  ON storage.objects FOR SELECT
  USING (bucket_id IN ('hello-slides', 'gallery', ...));

-- Authenticated upload
CREATE POLICY "Authenticated users can upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id IN (...) AND auth.role() = 'authenticated');
```

---

## 🎬 Media Type Detection

The system automatically detects media type based on file extension:

- **Images**: Files ending in `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`, `.svg`
- **Videos**: Files ending in `.mp4`, `.webm`, `.mov`, `.avi`, `.ogg`

In the gallery, media_type is auto-populated when uploading:

```typescript
const isVideo = url.match(/\.(mp4|webm|ogg|mov|avi)$/i);
if (isVideo) {
  setFormData({ ...formData, media_url: url, media_type: 'video' });
} else {
  setFormData({ ...formData, media_url: url, media_type: 'image' });
}
```

---

## 📊 Database Schema Updates

### Gallery Table Structure

```sql
CREATE TABLE gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  media_url TEXT NOT NULL,
  media_type VARCHAR(10) DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
  description TEXT,
  category VARCHAR(100),
  order_index INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🎭 Display Components

### Admin Gallery Display

Shows both images and videos with appropriate rendering:

```tsx
{item.media_type === 'video' ? (
  <video src={item.media_url} controls className="w-full h-48 object-cover" />
) : (
  <img src={item.media_url} alt={item.description} className="w-full h-48 object-cover" />
)}
```

### Visitor Gallery Page

Renders images and videos responsively:

```tsx
{item.media_type === 'video' ? (
  <video src={item.media_url} className="object-cover w-full h-full" controls />
) : (
  <Image src={item.media_url} alt={item.description} fill className="object-cover" />
)}
```

---

## 🛠️ Troubleshooting

### Issue: Files not uploading

**Check:**
1. Buckets are created in Supabase
2. RLS policies are applied
3. User is authenticated as admin
4. File size is within limits
5. File type is in allowed MIME types

### Issue: "Bucket not found" error

**Solution:**
Re-run the `storage-buckets.sql` script in Supabase SQL Editor

### Issue: Images/videos not displaying

**Check:**
1. Bucket is set to `public: true`
2. URL is correctly saved in database
3. File exists in storage bucket
4. Browser console for any CORS errors

### Issue: Upload successful but media_type not set

**Solution:**
Ensure the `migration-gallery-media-support.sql` was run for gallery table

---

## 📝 Best Practices

### File Naming
- System auto-generates unique filenames
- Format: `{random-id}-{timestamp}.{extension}`
- Prevents naming conflicts
- Maintains file extension for type detection

### File Size Optimization
- Compress images before upload when possible
- Use WebP format for better compression
- Keep videos under 20MB
- Consider video compression tools

### Bucket Organization
- Each component has dedicated bucket
- Easier to manage and backup
- Better security isolation
- Clear separation of concerns

---

## 🔄 Migration from URL-based Storage

If you previously used URL inputs:

1. Run both SQL scripts in order:
   - `storage-buckets.sql`
   - `migration-gallery-media-support.sql`

2. The system will continue to work with existing URLs

3. New uploads will use Supabase Storage

4. Gradually migrate old content by:
   - Re-uploading media through admin panel
   - Using the FileUpload component
   - Old URLs remain functional

---

## 📞 Support

For issues or questions:
1. Check Supabase Storage dashboard
2. Review browser console for errors
3. Verify RLS policies are active
4. Check file permissions in bucket settings

---

## ✅ Verification Checklist

After setup, verify:

- [ ] All 12 buckets created in Supabase
- [ ] RLS policies applied and active
- [ ] Gallery table has `media_type` column
- [ ] Gallery `media_url` column exists
- [ ] Admin can upload images
- [ ] Admin can upload videos (where supported)
- [ ] Images display on visitor pages
- [ ] Videos play on visitor pages
- [ ] File size limits enforced
- [ ] File type validation works

---

**Setup Complete!** 🎉

Your media upload system is now configured to handle both images and videos across all components with dedicated storage buckets.
