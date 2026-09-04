'use client';

import { useEffect, useState } from 'react';
import MediaRenderer from '@/components/MediaRenderer';
import LoadingSpinner from '@/components/LoadingSpinner';
import { supabase } from '@/lib/supabase/client';
import { useHydratedTheme } from '@/lib/store';
import { GraduationCap } from 'lucide-react';

interface Graduate {
  id: string;
  profile_image_url: string | null;
  full_name: string;
  course: string;
  graduation_year: number;
}

export default function GraduatesPage() {
  const [graduates, setGraduates] = useState<Graduate[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useHydratedTheme();

  useEffect(() => {
    fetchGraduates();
  }, []);

  const fetchGraduates = async () => {
    try {
      const { data, error } = await supabase
        .from('graduates')
        .select('*')
        .eq('is_active', true)
        .order('graduation_year', { ascending: false });

      if (error) throw error;
      setGraduates(data || []);
    } catch (error) {
      console.error('Error fetching graduates:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Group graduates by year for a nicer layout
  const graduatesByYear = graduates.reduce((acc, graduate) => {
    if (!acc[graduate.graduation_year]) {
      acc[graduate.graduation_year] = [];
    }
    acc[graduate.graduation_year].push(graduate);
    return acc;
  }, {} as Record<number, Graduate[]>);

  const years = Object.keys(graduatesByYear).map(Number).sort((a, b) => b - a);

  return (
    <div className="w-full py-16 px-4 bg-gray-50 min-h-screen">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-4 rounded-full mb-6" style={{ backgroundColor: `${theme.primaryColor}15` }}>
            <GraduationCap className="w-12 h-12" style={{ color: theme.primaryColor }} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Kitebe Graduates</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Celebrating the incredible achievements of individuals who have passed through Kitebe and gone on to graduate in various fields. We are proud to have been part of their journey!
          </p>
        </div>
        
        {years.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
            <p className="text-xl text-gray-500">No graduates have been featured yet. Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-16">
            {years.map((year) => (
              <div key={year} className="relative">
                <div className="flex items-center mb-8">
                  <div className="h-px bg-gray-200 flex-1"></div>
                  <h2 className="text-3xl font-bold mx-6 px-6 py-2 rounded-full text-white shadow-md" style={{ backgroundColor: theme.primaryColor }}>
                    Class of {year}
                  </h2>
                  <div className="h-px bg-gray-200 flex-1"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {graduatesByYear[year].map((graduate) => (
                    <div
                      key={graduate.id}
                      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100 flex flex-col"
                    >
                      <div className="relative w-full aspect-[4/5] overflow-hidden bg-gray-100">
                        {graduate.profile_image_url ? (
                          <MediaRenderer src={graduate.profile_image_url} alt={graduate.full_name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                            <span className="text-6xl text-gray-400 font-bold">{graduate.full_name.charAt(0)}</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                        <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                          <h3 className="text-2xl font-bold mb-1 line-clamp-2">{graduate.full_name}</h3>
                          <p className="text-white/90 font-medium text-sm line-clamp-3">{graduate.course}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
