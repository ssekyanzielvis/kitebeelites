'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import MediaRenderer from '@/components/MediaRenderer';
import { MapPin, Calendar, CheckCircle, ArrowLeft, Heart, Target, DollarSign, Activity } from 'lucide-react';
import Link from 'next/link';

import { useAppStore } from '@/lib/store';

type CharityVisit = Database['public']['Tables']['charity_visits']['Row'];

export default function CharityVisitDetailsPage({ params }: { params: { id: string } }) {
  const theme = useAppStore((state) => state.theme);
  const [visit, setVisit] = useState<CharityVisit | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisit = async () => {
      try {
        const { data, error } = await (supabase.from('charity_visits') as any)
          .select('*')
          .eq('id', params.id)
          .single();
        if (error) throw error;
        setVisit(data);
      } catch (error) {
        console.error('Error fetching visit details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVisit();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!visit) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Visit Not Found</h1>
        <Link href="/charity-visits" className="hover:underline" style={{ color: theme.primaryColor }}>
          Return to Charity Visits
        </Link>
      </div>
    );
  }

  const funders = (visit.funders as any[]) || [];
  const gallery = (visit.gallery as string[]) || [];
  const isCompleted = visit.status === 'Completed';

  return (
    <div className="min-h-screen pb-24">
      {/* Hero Section */}
      <div className="relative text-white" style={{ backgroundColor: theme.primaryColor }}>
        <div className="absolute inset-0 opacity-40">
          {visit.main_media_url ? (
            <MediaRenderer src={visit.main_media_url} alt="Cover" />
          ) : (
            <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1559027615-cd4628ce2751?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center" />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <div className="relative z-10 container mx-auto px-4 pt-32 pb-16 max-w-5xl">
          <Link href="/charity-visits" className="inline-flex items-center hover:opacity-80 mb-8 transition-opacity">
            <ArrowLeft size={20} className="mr-2" />
            Back to Visits
          </Link>
          
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className={`px-4 py-1.5 rounded-full text-sm font-bold ${
              isCompleted ? 'bg-green-500 text-white' : 'bg-blue-600 text-white'
            }`}>
              {visit.status}
            </div>
            <div className="flex items-center text-gray-300 bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-sm">
              <Calendar size={16} className="mr-2" />
              {new Date(visit.visit_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div className="flex items-center text-gray-300 bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-sm">
              <MapPin size={16} className="mr-2" />
              {visit.location}
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
            {visit.title}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 relative z-20 max-w-5xl">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x border-b border-gray-100 bg-gray-50/50">
            {/* Quick Stats */}
            <div className="p-8 flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                <Target size={24} />
              </div>
              <div>
                <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Focus</h3>
                <p className="font-semibold text-gray-900 leading-snug">Community Outreach & Development</p>
              </div>
            </div>
            <div className="p-8 flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center shrink-0">
                <DollarSign size={24} />
              </div>
              <div>
                <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Budget Setup</h3>
                <p className="font-semibold text-gray-900">
                  {visit.estimated_budget_ugx ? `UGX ${visit.estimated_budget_ugx.toLocaleString()}` : 'Not Specified'}
                </p>
                {isCompleted && visit.actual_spent_ugx && (
                  <p className="text-sm text-green-600 font-medium mt-1">
                    Actual: UGX {visit.actual_spent_ugx.toLocaleString()}
                  </p>
                )}
              </div>
            </div>
            <div className="p-8 flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center shrink-0">
                <Activity size={24} />
              </div>
              <div>
                <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Status</h3>
                <p className={`font-semibold ${isCompleted ? 'text-green-600' : 'text-blue-600'}`}>
                  {isCompleted ? 'Successfully Completed' : 'Preparations Ongoing'}
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12 space-y-12">
            
            {/* Main Content */}
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-900">
                  <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3 text-sm">1</span>
                  Our Objective
                </h2>
                <div className="prose prose-lg text-gray-600">
                  <p className="whitespace-pre-wrap">{visit.objective || 'Objective details are being finalized.'}</p>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-900">
                  <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3 text-sm">2</span>
                  Planned Activities
                </h2>
                <div className="prose prose-lg text-gray-600 bg-gray-50 p-6 rounded-2xl border">
                  <p className="whitespace-pre-wrap">{visit.activities || 'Activity schedule will be updated shortly.'}</p>
                </div>
              </div>
            </div>

            {/* Impact Report (Completed Only) */}
            {isCompleted && visit.impact_summary && (
              <div className="bg-green-50 rounded-3xl p-8 md:p-12 border border-green-100">
                <h2 className="text-3xl font-bold mb-6 flex items-center text-green-800">
                  <CheckCircle className="mr-3" size={32} />
                  Impact Report
                </h2>
                <div className="prose prose-lg text-green-900 max-w-none">
                  <p className="whitespace-pre-wrap text-lg leading-relaxed">{visit.impact_summary}</p>
                </div>
              </div>
            )}

            {/* Media Gallery (Completed Only) */}
            {isCompleted && gallery.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-8 text-gray-900 border-b pb-4">Event Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {gallery.map((url, idx) => (
                    <div key={idx} className="aspect-square bg-gray-100 rounded-xl overflow-hidden hover:opacity-90 transition-opacity cursor-pointer">
                      <MediaRenderer src={url} alt="Gallery item" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Funders & Sponsors */}
            {funders.length > 0 && (
              <div className="border-t pt-12">
                <div className="text-center mb-10">
                  <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-gray-900">Made Possible By</h2>
                  <p className="text-gray-500 mt-2">We extend our deepest gratitude to our key funders and sponsors.</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {funders.map((funder, idx) => (
                    <div key={idx} className="bg-white border rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow">
                      {funder.logo_url ? (
                        <div className="h-20 w-full mb-4 relative flex items-center justify-center">
                          <img src={funder.logo_url} alt={funder.name} className="max-h-full max-w-full object-contain" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4 font-bold text-2xl">
                          {funder.name.charAt(0)}
                        </div>
                      )}
                      <h4 className="font-bold text-gray-900 line-clamp-1">{funder.name}</h4>
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mt-1">{funder.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
