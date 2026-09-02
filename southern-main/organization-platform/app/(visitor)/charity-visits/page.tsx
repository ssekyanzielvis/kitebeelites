'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import MediaRenderer from '@/components/MediaRenderer';
import { MapPin, Calendar, Users, Heart, ArrowRight, CheckCircle, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

import { useAppStore } from '@/lib/store';

type CharityVisit = Database['public']['Tables']['charity_visits']['Row'];

export default function CharityVisitsPage() {
  const theme = useAppStore((state) => state.theme);
  const [visits, setVisits] = useState<CharityVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'Upcoming' | 'Completed'>('Upcoming');

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    try {
      const { data, error } = await (supabase.from('charity_visits') as any).select('*').order('visit_date', { ascending: false });
      if (error) throw error;
      setVisits(data || []);
      
      // Auto-switch tab if there are no upcoming but there are completed
      if (data && data.length > 0) {
        const hasUpcoming = data.some((v: any) => v.status === 'Upcoming');
        if (!hasUpcoming) setActiveTab('Completed');
      }
    } catch (error) {
      console.error('Error fetching visits:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVisits = visits.filter(v => v.status === activeTab);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <div className="text-white py-20 relative overflow-hidden" style={{ backgroundColor: theme.primaryColor }}>
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559027615-cd4628ce2751?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center" />
        
        <div className="container mx-auto px-4 relative z-20 text-center">
          <Heart className="w-16 h-16 mx-auto mb-6 text-red-500 animate-pulse" fill="currentColor" />
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Charity Visits & Outreach</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto font-light opacity-90">
            Reaching out to communities, sharing hope, and making a tangible impact through our charitable programs.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-white rounded-full p-1.5 shadow-md border">
            <button
              onClick={() => setActiveTab('Upcoming')}
              className={`px-8 py-3 rounded-full font-bold transition-all ${
                activeTab === 'Upcoming' 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Upcoming Visits
            </button>
            <button
              onClick={() => setActiveTab('Completed')}
              className={`px-8 py-3 rounded-full font-bold transition-all flex items-center gap-2 ${
                activeTab === 'Completed' 
                  ? 'bg-green-600 text-white shadow-lg' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <CheckCircle size={18} />
              Completed Impact
            </button>
          </div>
        </div>

        {/* List */}
        {filteredVisits.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
            <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-2xl font-bold text-gray-400 mb-2">No {activeTab.toLowerCase()} visits found.</h3>
            <p className="text-gray-500">Check back later for updates on our community outreach.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVisits.map((visit) => {
              const funders = (visit.funders as any[]) || [];
              
              return (
                <div key={visit.id} className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 group flex flex-col hover:-translate-y-2 transition-transform duration-300">
                  <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                    {visit.main_media_url ? (
                      <div className="group-hover:scale-105 transition-transform duration-500 w-full h-full">
                        <MediaRenderer src={visit.main_media_url} alt={visit.title || 'Visit media'} />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ImageIcon size={48} className="opacity-30" />
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-2xl font-bold line-clamp-2 leading-tight">{visit.title}</h3>
                    </div>

                    <div className={`absolute top-4 right-4 px-4 py-1.5 rounded-full text-sm font-bold shadow-lg ${
                      visit.status === 'Completed' ? 'bg-green-500 text-white' : 'bg-blue-600 text-white'
                    }`}>
                      {visit.status}
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex flex-col gap-3 mb-6 border-b pb-6">
                      <div className="flex items-center text-gray-600 font-medium">
                        <MapPin size={18} className="mr-3 text-blue-600 shrink-0" />
                        <span className="truncate">{visit.location}</span>
                      </div>
                      <div className="flex items-center text-gray-600 font-medium">
                        <Calendar size={18} className="mr-3 text-blue-600 shrink-0" />
                        <span>{new Date(visit.visit_date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                      {funders.length > 0 && (
                        <div className="flex items-center text-gray-600 font-medium">
                          <Users size={18} className="mr-3 text-blue-600 shrink-0" />
                          <span>{funders.length} Key Funder{funders.length !== 1 ? 's' : ''}</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-gray-600 line-clamp-3 mb-6 flex-1">
                      {visit.objective || visit.activities}
                    </p>

                    <Link 
                      href={`/charity-visits/${visit.id}`}
                      className="inline-flex items-center justify-center w-full bg-gray-50 text-blue-600 font-bold py-3 rounded-xl hover:bg-blue-50 transition-colors group/btn"
                    >
                      View Details
                      <ArrowRight size={18} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
