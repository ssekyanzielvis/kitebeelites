'use client';

import { useState, useEffect, Suspense } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useNotification, useHydratedTheme } from '@/lib/store';
import { Heart, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import FileUpload from '@/components/FileUpload';

function SponsorForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const programId = searchParams.get('program_id');
  const { showNotification } = useNotification();
  const { theme } = useHydratedTheme();
  
  const [program, setProgram] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    amount_or_item: '',
    logo_url: '',
    message: '',
  });

  useEffect(() => {
    if (programId) {
      fetchProgramDetails();
    } else {
      setLoading(false);
    }
  }, [programId]);

  const fetchProgramDetails = async () => {
    try {
      const { data, error } = await (supabase
        .from('programs') as any)
        .select('*')
        .eq('id', programId as string)
        .single();
        
      if (error) throw error;
      setProgram(data);
    } catch (error) {
      console.error('Error fetching program:', error);
      showNotification('Program not found', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!programId) {
      showNotification('Missing program ID', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await (supabase
        .from('program_sponsorships') as any)
        .insert({
          program_id: programId,
          ...formData,
        });

      if (error) throw error;
      
      setSuccess(true);
      // Automatically redirect back to programs page after a delay
      setTimeout(() => {
        router.push('/programs');
      }, 3000);
      
    } catch (error: any) {
      showNotification(error.message || 'Failed to submit application', 'error');
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  if (!program) {
    return (
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Program Not Found</h2>
        <p className="text-gray-600">The program you are trying to sponsor could not be found.</p>
        <Link href="/programs" className="text-blue-600 hover:underline flex items-center justify-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Programs
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center space-y-6 py-12">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Thank You!</h2>
        <p className="text-gray-600 max-w-md mx-auto text-lg">
          Your sponsorship request has been received. Our team will contact you shortly to complete the process.
        </p>
        <p className="text-sm text-gray-400">Redirecting you back to programs...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-2xl mx-auto border border-gray-100">
      <div className="p-8 text-center text-white relative transition-colors" style={{ backgroundColor: theme.primaryColor }}>
        <Link href="/programs" className="absolute top-4 left-4 text-white/80 hover:text-white flex items-center gap-1 text-sm font-medium transition">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
          <Heart className="w-8 h-8 text-white fill-white" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Sponsor a Program</h1>
        <p className="text-white/90">You are applying to sponsor: <span className="font-bold text-white">{program.title}</span></p>
      </div>
      
      <div className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name or Business Name *</label>
              <input
                type="text"
                required
                value={formData.full_name}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-3 border"
                placeholder="John Doe or Acme Corp"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-3 border"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-3 border"
                  placeholder="+256 700 000 000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Amount (UGX) or Item(s) to Sponsor *</label>
              <textarea
                required
                rows={3}
                value={formData.amount_or_item}
                onChange={(e) => setFormData({...formData, amount_or_item: e.target.value})}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-3 border"
                placeholder="e.g. 5,000,000 UGX or 50 Footballs and 20 Jerseys"
              />
              <p className="text-xs text-gray-500 mt-2">
                Specify exactly what you would like to contribute towards this program. If you are sponsoring a specific item from the budget, please mention it here.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Business or Organization Logo *</label>
              <FileUpload
                bucket="program-sponsors"
                accept="image"
                currentUrl={formData.logo_url}
                onUploadComplete={(url) => setFormData({ ...formData, logo_url: url })}
                label="Upload Sponsor Logo"
              />
              <p className="text-xs text-gray-500 mt-2">
                This logo will be displayed publicly on the program page once your sponsorship is approved.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Brief Message *</label>
              <textarea
                required
                rows={2}
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-3 border"
                placeholder="A short message from your organization..."
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={submitting}
              className="w-full text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ backgroundColor: theme.primaryColor }}
            >
              {submitting ? (
                <>Processing...</>
              ) : (
                <>Submit Sponsorship Request</>
              )}
            </button>
            <p className="text-center text-xs text-gray-500 mt-4">
              By submitting this form, you agree to our terms and conditions. The organization admin will contact you to finalize the sponsorship.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ApplySponsorPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <Suspense fallback={<div className="flex justify-center"><LoadingSpinner size="lg" /></div>}>
        <SponsorForm />
      </Suspense>
    </div>
  );
}
