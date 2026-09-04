'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { adminDb } from '@/lib/supabase/adminDb';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useNotification } from '@/lib/store';
import { Database } from '@/lib/supabase/types';
import { CheckCircle, XCircle, Mail, Phone, Calendar } from 'lucide-react';

type Sponsorship = Database['public']['Tables']['program_sponsorships']['Row'];
type Program = Database['public']['Tables']['programs']['Row'];

export default function SponsorshipsManagement() {
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sponsorsRes, programsRes] = await Promise.all([
        (supabase.from('program_sponsorships') as any).select('*').order('created_at', { ascending: false }),
        (supabase.from('programs') as any).select('*')
      ]);

      if (sponsorsRes.error) throw sponsorsRes.error;
      if (programsRes.error) throw programsRes.error;

      setSponsorships(sponsorsRes.data || []);
      setPrograms(programsRes.data || []);
    } catch (error: any) {
      showNotification('Failed to load sponsorships', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setProcessingId(id);
    try {
      const { error } = await adminDb('program_sponsorships').update({
        status: newStatus,
      }).eq('id', id);

      if (error) throw error;
      showNotification(`Sponsorship ${newStatus} successfully`, 'success');
      fetchData();
    } catch (error: any) {
      showNotification(error.message, 'error');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading && sponsorships.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Program Sponsorships</h1>
        <p className="text-gray-600">Review and manage incoming sponsorship applications.</p>
      </div>

      <div className="space-y-4">
        {sponsorships.map((sponsor) => {
          const program = programs.find((p) => p.id === sponsor.program_id);
          
          return (
            <div key={sponsor.id} className="bg-white border rounded-lg p-6 flex flex-col md:flex-row gap-6 items-start shadow-sm">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold">{sponsor.full_name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    sponsor.status === 'approved' ? 'bg-green-100 text-green-800' :
                    sponsor.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {sponsor.status.toUpperCase()}
                  </span>
                </div>
                
                <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded border inline-block">
                  <span className="font-semibold text-gray-900">Program:</span> {program?.title || 'Unknown Program'}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <a href={`mailto:${sponsor.email}`} className="hover:text-blue-600">{sponsor.email || 'N/A'}</a>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <a href={`tel:${sponsor.phone}`} className="hover:text-blue-600">{sponsor.phone || 'N/A'}</a>
                  </div>
                </div>

                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-800 mb-1">Sponsoring Amount or Item(s):</p>
                    <p className="text-gray-700 bg-blue-50 p-3 rounded border border-blue-100">{sponsor.amount_or_item}</p>
                  </div>
                  
                  {sponsor.message && (
                    <div>
                      <p className="text-sm font-semibold text-gray-800 mb-1">Brief Message:</p>
                      <p className="text-gray-700 bg-purple-50 p-3 rounded border border-purple-100 italic">"{sponsor.message}"</p>
                    </div>
                  )}

                  {sponsor.logo_url && (
                    <div>
                      <p className="text-sm font-semibold text-gray-800 mb-1">Sponsor Logo:</p>
                      <div className="bg-gray-50 border rounded p-2 inline-block">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={sponsor.logo_url} alt={`${sponsor.full_name} logo`} className="h-16 object-contain" />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                  <Calendar className="w-4 h-4" />
                  Applied on {new Date(sponsor.created_at).toLocaleDateString()}
                </div>
              </div>

              <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 md:border-l md:pl-6 border-gray-100">
                {sponsor.status !== 'approved' && (
                  <button
                    disabled={processingId === sponsor.id}
                    onClick={() => handleUpdateStatus(sponsor.id, 'approved')}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
                  >
                    <CheckCircle className="w-4 h-4" /> Approve
                  </button>
                )}
                {sponsor.status !== 'rejected' && (
                  <button
                    disabled={processingId === sponsor.id}
                    onClick={() => handleUpdateStatus(sponsor.id, 'rejected')}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {sponsorships.length === 0 && (
          <div className="bg-white rounded-lg border p-12 text-center text-gray-500">
            <p className="text-lg">No sponsorship applications found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
