'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import LoadingSpinner from '@/components/LoadingSpinner';
import MediaRenderer from '@/components/MediaRenderer';
import { useHydratedTheme } from '@/lib/store';
import { Download, Calendar, CheckCircle, Clock, ChevronDown, ChevronUp, Heart } from 'lucide-react';
import Link from 'next/link';
import { downloadBudgetPDF } from '@/lib/utils/pdfGenerator';
import { Database } from '@/lib/supabase/types';

type Program = Database['public']['Tables']['programs']['Row'];
type Sponsorship = Database['public']['Tables']['program_sponsorships']['Row'];

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedBudgets, setExpandedBudgets] = useState<{ [key: string]: boolean }>({});
  const { theme } = useHydratedTheme();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [programsRes, sponsorsRes] = await Promise.all([
        supabase.from('programs').select('*').eq('is_active', true).order('created_at', { ascending: false }),
        supabase.from('program_sponsorships').select('*').eq('status', 'approved')
      ]);

      if (programsRes.error) throw programsRes.error;
      if (sponsorsRes.error) throw sponsorsRes.error;

      setPrograms(programsRes.data || []);
      setSponsorships(sponsorsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleBudget = (id: string) => {
    setExpandedBudgets(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getProgramStatus = (startDate: string | null, endDate: string | null) => {
    if (!endDate) return { status: 'Ongoing', color: 'bg-blue-100 text-blue-800' };
    const end = new Date(endDate);
    const today = new Date();
    
    if (end < today) {
      return { status: 'Done', color: 'bg-green-100 text-green-800' };
    }
    return { status: 'Active', color: 'bg-yellow-100 text-yellow-800' };
  };

  const getDuration = (startDate: string | null, endDate: string | null) => {
    if (!startDate || !endDate) return null;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="w-full py-16 px-4 bg-gray-50 min-h-screen">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-900">Our Programs</h1>
        <p className="text-xl text-center mb-12 max-w-3xl mx-auto text-gray-600">
          Explore our diverse programs designed to make a positive impact in the community.
        </p>
        
        <div className="space-y-12">
          {programs.map((program) => {
            const { status, color } = getProgramStatus(program.start_date || null, program.end_date || null);
            const duration = getDuration(program.start_date || null, program.end_date || null);
            const programSponsors = sponsorships.filter(s => s.program_id === program.id);
            const hasBudget = program.budget_items && Array.isArray(program.budget_items) && program.budget_items.length > 0;
            const totalBudget = hasBudget ? program.budget_items.reduce((acc: number, curr: any) => acc + (Number(curr.cost) || 0), 0) : 0;
            const isBudgetExpanded = expandedBudgets[program.id] || false;

            return (
              <div key={program.id} className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row w-full group transition-shadow hover:shadow-xl">
                {/* Image on Left */}
                <div className="w-full md:w-5/12 lg:w-4/12 relative aspect-video md:aspect-auto md:min-h-[400px] bg-gray-100 flex-shrink-0">
                  {program.image_url ? (
                    <MediaRenderer 
                      src={program.image_url} 
                      alt={program.title} 
                      fill
                      className="object-cover" 
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      No Media
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${color}`}>
                      {status}
                    </span>
                  </div>
                </div>

                {/* Details on Right */}
                <div className="w-full md:w-7/12 lg:w-8/12 p-6 md:p-8 flex flex-col">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{program.title}</h2>
                  
                  <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600">
                    {program.start_date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Start: {new Date(program.start_date).toLocaleDateString()}</span>
                      </div>
                    )}
                    {program.end_date && (
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        <span>End: {new Date(program.end_date).toLocaleDateString()}</span>
                      </div>
                    )}
                    {duration && (
                      <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">Duration: {duration}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-6 whitespace-pre-wrap flex-1">
                    {program.description}
                  </p>

                  {/* Budget Section */}
                  {hasBudget && (
                    <div className="mb-6 border border-gray-200 rounded-xl overflow-hidden">
                      <button 
                        onClick={() => toggleBudget(program.id)}
                        className="w-full bg-gray-50 p-4 flex items-center justify-between hover:bg-gray-100 transition-colors"
                      >
                        <div>
                          <span className="font-semibold text-gray-800">Estimated Budget: </span>
                          <span className="font-bold text-blue-700">UGX {totalBudget.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="hidden sm:inline">View Breakdown</span>
                          {isBudgetExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                      </button>
                      
                      {isBudgetExpanded && (
                        <div className="p-4 bg-white border-t border-gray-200">
                          <div className="space-y-2 mb-4">
                            {program.budget_items.map((item: any, idx: number) => (
                              <div key={idx} className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                                <span className="text-gray-600">{item.item}</span>
                                <span className="font-semibold text-gray-900">UGX {Number(item.cost).toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                          <button
                            onClick={() => downloadBudgetPDF(program.title, program.budget_items)}
                            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                          >
                            <Download className="w-4 h-4" /> Download PDF Budget
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Sponsors Section */}
                  {programSponsors.length > 0 && (
                    <div className="mb-6 bg-purple-50 p-4 rounded-xl border border-purple-100">
                      <h4 className="font-semibold text-purple-900 mb-4 flex items-center gap-2">
                        <Heart className="w-4 h-4 text-purple-600 fill-current" />
                        Program Sponsors
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {programSponsors.map(sponsor => (
                          <div key={sponsor.id} className="bg-white border border-purple-200 p-4 rounded-lg shadow-sm flex flex-col gap-3">
                            <div className="flex items-start gap-4">
                              {sponsor.logo_url && (
                                <div className="w-16 h-16 shrink-0 bg-gray-50 border border-gray-100 rounded-md overflow-hidden flex items-center justify-center p-1">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={sponsor.logo_url} alt={`${sponsor.full_name} logo`} className="w-full h-full object-contain" />
                                </div>
                              )}
                              <div>
                                <h5 className="font-bold text-purple-900">{sponsor.full_name}</h5>
                                <p className="text-xs font-semibold text-purple-600">{sponsor.amount_or_item}</p>
                              </div>
                            </div>
                            
                            {sponsor.message && (
                              <div className="bg-purple-50/50 p-3 rounded text-sm text-gray-700 italic border-l-2 border-purple-300">
                                "{sponsor.message}"
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <Link 
                      href={`/apply/sponsor?program_id=${program.id}`}
                      className="inline-flex items-center justify-center gap-2 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
                      style={{ backgroundColor: theme.primaryColor }}
                    >
                      <Heart className="w-5 h-5" /> Sponsor this Program
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {programs.length === 0 && (
          <div className="text-center py-24 bg-white rounded-2xl shadow-sm border border-gray-100">
            <p className="text-2xl text-gray-500 font-medium">No programs available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
