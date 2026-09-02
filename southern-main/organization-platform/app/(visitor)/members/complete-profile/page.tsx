'use client';

import { Suspense, useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Upload, User, FileText, CheckCircle2, AlertCircle, Loader2, ImageIcon, X
} from 'lucide-react';

interface TokenInfo {
  full_name: string;
  email: string;
  application_id: string;
}

function CompleteProfileContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'invalid' | 'valid' | 'done' | 'already_done'>('loading');
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [extraInfo, setExtraInfo] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!token) {
      setStatus('invalid');
      return;
    }
    validateToken();
  }, [token]);

  const validateToken = async () => {
    try {
      const res = await fetch(`/api/members/complete-profile?token=${token}`);
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          setStatus('already_done');
        } else {
          setStatus('invalid');
        }
        return;
      }

      setTokenInfo(data);
      setStatus('valid');
    } catch {
      setStatus('invalid');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB.');
      return;
    }
    setError(null);
    setProfileImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!profileImage) return null;
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', profileImage);
      formData.append('bucket', 'member-profiles');

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      return data.url;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Upload image first if provided
      let imageUrl: string | null = null;
      if (profileImage) {
        imageUrl = await uploadImage();
        if (!imageUrl) throw new Error('Image upload failed. Please try again.');
      }

      // Complete profile
      const res = await fetch('/api/members/complete-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          profile_image_url: imageUrl,
          extra_profile_info: extraInfo.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to complete profile');

      setStatus('done');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── States ─────────────────────────────────────────────────────────────────

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-white/60">Verifying your invitation...</p>
        </div>
      </div>
    );
  }

  if (status === 'invalid') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 bg-red-500/20 border border-red-400/40 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={48} className="text-red-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Invalid Link</h1>
          <p className="text-white/60 mb-8">
            This profile completion link is invalid or has expired. Please contact the administrator for assistance.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-6 py-3 rounded-xl hover:bg-white/20 transition-colors">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (status === 'already_done') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 bg-emerald-500/20 border border-emerald-400/40 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={48} className="text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Profile Already Complete</h1>
          <p className="text-white/60 mb-8">
            Your profile has already been completed. Welcome to the community!
          </p>
          <Link href="/members" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all">
            View Community Members
          </Link>
        </div>
      </div>
    );
  }

  if (status === 'done') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          <div className="relative mb-8">
            <div className="w-28 h-28 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/30">
              <CheckCircle2 size={56} className="text-white" />
            </div>
            <div className="absolute inset-0 w-28 h-28 mx-auto rounded-full bg-emerald-400/20 animate-ping" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Welcome to the Community!</h1>
          <p className="text-blue-200 text-lg mb-8 leading-relaxed">
            Your profile is now complete,{' '}
            <strong className="text-white">{tokenInfo?.full_name}</strong>! 
            You are now officially a member of Kitebe Elites FC.
          </p>
          <Link
            href="/members"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-10 py-4 rounded-xl font-bold hover:from-emerald-600 hover:to-teal-700 transition-all shadow-xl shadow-emerald-500/30"
          >
            View the Community →
          </Link>
        </div>
      </div>
    );
  }

  // ── Main form (status === 'valid') ─────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Header */}
      <div className="relative py-16 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-600/15 via-transparent to-transparent" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            <CheckCircle2 size={14} />
            Application Approved!
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Complete Your Profile,
            <span className="block bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              {tokenInfo?.full_name}
            </span>
          </h1>
          <p className="text-blue-100/70 text-lg">
            Congratulations on your approval! Upload your profile photo and add any final details to complete your membership.
          </p>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 pb-20">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Profile Image Upload */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 bg-blue-500/20 border border-blue-400/30 rounded-xl flex items-center justify-center">
                <ImageIcon size={18} className="text-blue-400" />
              </div>
              <h2 className="text-lg font-bold text-white">Profile Photo</h2>
              <span className="text-white/40 text-sm ml-auto">(Optional but recommended)</span>
            </div>

            {/* Image preview / upload zone */}
            <div
              className="relative cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <div className="relative w-36 h-36 mx-auto">
                  <div className="w-36 h-36 rounded-full overflow-hidden ring-4 ring-blue-400/30">
                    <Image
                      src={imagePreview}
                      alt="Profile preview"
                      width={144}
                      height={144}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); setProfileImage(null); setImagePreview(null); }}
                    className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X size={14} className="text-white" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-white/20 hover:border-blue-400/50 rounded-2xl p-10 text-center transition-all group-hover:bg-white/5">
                  <Upload size={36} className="text-white/30 group-hover:text-blue-400 mx-auto mb-3 transition-colors" />
                  <p className="text-white/60 font-medium">Click to upload photo</p>
                  <p className="text-white/30 text-sm mt-1">JPG, PNG, WebP · Max 5MB</p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleImageChange}
              className="hidden"
            />
            <p className="text-center text-white/40 text-xs mt-3">
              Your photo will be shown on the public members directory.
            </p>
          </div>

          {/* Extra Info */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 bg-purple-500/20 border border-purple-400/30 rounded-xl flex items-center justify-center">
                <FileText size={18} className="text-purple-400" />
              </div>
              <h2 className="text-lg font-bold text-white">Additional Information</h2>
              <span className="text-white/40 text-sm ml-auto">(Optional)</span>
            </div>
            <label className="block text-sm font-semibold text-blue-200 mb-2">
              Anything new to share since your application?
            </label>
            <textarea
              rows={5}
              value={extraInfo}
              onChange={e => setExtraInfo(e.target.value)}
              placeholder="Recent achievements, new skills, goals for the community, etc..."
              className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400/60 focus:border-transparent resize-none"
            />
          </div>

          {/* Summary card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-500/20 border border-emerald-400/30 rounded-xl flex items-center justify-center shrink-0">
              <User size={18} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-white font-semibold">{tokenInfo?.full_name}</p>
              <p className="text-white/50 text-sm">{tokenInfo?.email}</p>
            </div>
            <span className="ml-auto text-xs bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 px-3 py-1 rounded-full font-semibold">
              Approved ✓
            </span>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-400/40 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle size={18} className="text-red-400 mt-0.5 shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting || uploadingImage}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-60 text-white font-bold text-lg py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-emerald-500/30"
          >
            {submitting || uploadingImage ? (
              <>
                <Loader2 size={22} className="animate-spin" />
                {uploadingImage ? 'Uploading image...' : 'Completing profile...'}
              </>
            ) : (
              <>
                <CheckCircle2 size={22} />
                Complete My Profile
              </>
            )}
          </button>

          <p className="text-center text-white/40 text-xs">
            Both fields above are optional. You can submit without uploading a photo.
          </p>
        </form>
      </div>
    </div>
  );
}

export default function CompleteProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center">
        <Loader2 size={48} className="text-blue-400 animate-spin" />
      </div>
    }>
      <CompleteProfileContent />
    </Suspense>
  );
}
